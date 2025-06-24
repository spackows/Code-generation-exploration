const { execSync } = require( "child_process" );
const fs = require( "fs" );
const path = require( "path" );
const ffmpeg_installer = require( "@ffmpeg-installer/ffmpeg" );

var g_ffmpeg_path = ffmpeg_installer.path;
var g_ffprobe_path = g_ffmpeg_path.replace( /ffmpeg(\.exe)?$/, m => m.startsWith("ffmpeg") ? "ffprobe" + (m.endsWith(".exe") ? ".exe" : "") : m );

if ( process.argv.length < 4 )
{
    console.log( "Usage: node trim-silence_copilot.js <input.mp4> <output.mp4>" );
    process.exit( 1 );
}

var g_input_file = process.argv[ 2 ];
var g_output_file = process.argv[ 3 ];

// Step 1: Detect silence using ffmpeg silencedetect
function detectSilence( input_file )
{
    var cmd = "\"" + g_ffmpeg_path + "\" -i \"" + input_file + "\" -af silencedetect=noise=-30dB:d=0.5 -f null - 2>&1";
    var output = execSync( cmd ).toString();
    return output;

}

// Step 2: Parse silence intervals from ffmpeg output
function parseSilenceIntervals( ffmpeg_output )
{
    var silence_intervals = [];
    var lines = ffmpeg_output.split( "\n" );
    var last_silence_start = null;

    lines.forEach( function( line )
    {
        var start_match = line.match( /silence_start: ([\d\.]+)/ );
        var end_match = line.match( /silence_end: ([\d\.]+)/ );
        if ( start_match )
        {
            last_silence_start = parseFloat( start_match[ 1 ] );
        }
        if ( end_match )
        {
            var silence_end = parseFloat( end_match[ 1 ] );
            if ( last_silence_start !== null )
            {
                silence_intervals.push( { start: last_silence_start, end: silence_end } );
                last_silence_start = null;
            }
        }
    } );

    return silence_intervals;

}

// Step 3: Get total duration from ffmpeg output
function getDurationFromFfmpegOutput( ffmpeg_output )
{
    // Try to find the last "silence_end" or "silence_start" as fallback, or parse "Duration: HH:MM:SS.xx" from ffmpeg header
    var duration_match = ffmpeg_output.match( /Duration: (\d+):(\d+):([\d\.]+)/ );
    if ( duration_match )
    {
        var hours = parseInt( duration_match[ 1 ] );
        var minutes = parseInt( duration_match[ 2 ] );
        var seconds = parseFloat( duration_match[ 3 ] );
        return hours * 3600 + minutes * 60 + seconds;
    }
    // fallback: try to find the last silence_end or silence_start
    var last = 0;
    var silence_end_matches = [ ...ffmpeg_output.matchAll( /silence_end: ([\d\.]+)/g ) ];
    if ( silence_end_matches.length > 0 )
    {
        last = parseFloat( silence_end_matches[ silence_end_matches.length - 1 ][ 1 ] );
    }
    else
    {
        var silence_start_matches = [ ...ffmpeg_output.matchAll( /silence_start: ([\d\.]+)/g ) ];
        if ( silence_start_matches.length > 0 )
        {
            last = parseFloat( silence_start_matches[ silence_start_matches.length - 1 ][ 1 ] );
        }
    }
    return last;

}

// Step 4: Build non-silent intervals
function getNonSilentIntervals( silence_intervals, duration )
{
    var non_silent = [];
    var prev_end = 0;

    silence_intervals.forEach( function( interval )
    {
        if ( interval.start > prev_end )
        {
            non_silent.push( { start: prev_end, end: interval.start } );
        }
        prev_end = interval.end;
    } );

    if ( prev_end < duration )
    {
        non_silent.push( { start: prev_end, end: duration } );
    }

    return non_silent;

}

// Step 5: Generate ffmpeg trim commands for non-silent intervals
function buildTrimFilter( intervals )
{
    var filter = "";
    intervals.forEach( function( interval, idx )
    {
        filter += "[0:v]trim=start=" + interval.start + ":end=" + interval.end + ",setpts=PTS-STARTPTS[v" + idx + "];";
        filter += "[0:a]atrim=start=" + interval.start + ":end=" + interval.end + ",asetpts=PTS-STARTPTS[a" + idx + "];";
    } );
    var v_inputs = intervals.map( function( _, idx ) { return "[v" + idx + "]"; } ).join( "" );
    var a_inputs = intervals.map( function( _, idx ) { return "[a" + idx + "]"; } ).join( "" );
    filter += v_inputs + "concat=n=" + intervals.length + ":v=1:a=0[v];";
    filter += a_inputs + "concat=n=" + intervals.length + ":v=0:a=1[a]";
    return filter;

}

// Step 6: Run ffmpeg to trim and concatenate non-silent segments
function trimSilence( input_file, output_file, intervals )
{
    var filter = buildTrimFilter( intervals );
    var cmd = "\"" + g_ffmpeg_path + "\" -i \"" + input_file + "\" -filter_complex \"" + filter + "\" -map \"[v]\" -map \"[a]\" -y \"" + output_file + "\"";
    execSync( cmd, { stdio: "inherit" } );

}

// Main process
var g_ffmpeg_output = detectSilence( g_input_file );
var g_silence_intervals = parseSilenceIntervals( g_ffmpeg_output );
var g_duration = getDurationFromFfmpegOutput( g_ffmpeg_output );
var g_non_silent_intervals = getNonSilentIntervals( g_silence_intervals, g_duration );

if ( g_non_silent_intervals.length === 0 )
{
    console.log( "No non-silent intervals detected." );
    process.exit( 1 );
}

trimSilence( g_input_file, g_output_file, g_non_silent_intervals );

console.log( "Done. Output written to " + g_output_file );

