const { spawn, execFileSync } = require("child_process");
const ffmpeg_installer = require("@ffmpeg-installer/ffmpeg");
const fs = require("fs");

const g_input_file = process.argv[2];
const g_output_file = process.argv[3] || "output_trimmed.mp4";
const g_silence_threshold = "-30dB";
const g_silence_duration = 1;

function detectSilence( input_file, callback )
{
    var ffmpeg_path = ffmpeg_installer.path;
    var args = [
        "-i", input_file,
        "-af", `silencedetect=noise=${g_silence_threshold}:d=${g_silence_duration}`,
        "-f", "null",
        "-"
    ];
    var proc = spawn( ffmpeg_path, args );
    proc.stderr.setEncoding( "utf8" );
    proc.stderr.on( "data", function( data )
    {
        var lines = data.split( "\n" );
        lines.forEach( function( line )
        {
            if ( line.includes( "silencedetect" ) )
            {
                callback( line );
            }
        } );
    } );
    proc.on( "close", function()
    {
        callback( null, true );
    } );
    proc.on( "error", function( err )
    {
        console.error( "Error detecting silence:", err );
    } );

}

function parseSilence( lines )
{
    var silence_starts = [];
    var silence_ends = [];
    lines.forEach( function( line )
    {
        var start = line.match( /silence_start: ([\d.]+)/ );
        var end = line.match( /silence_end: ([\d.]+)/ );
        if ( start )
        {
            silence_starts.push( parseFloat( start[1] ) );
        }
        if ( end )
        {
            silence_ends.push( parseFloat( end[1] ) );
        }
    } );
    return { silence_starts, silence_ends };

}

function getNonSilentSegments( duration, silence_starts, silence_ends )
{
    var segments = [];
    var prev_end = 0;
    for ( var i = 0; i < silence_starts.length; i++ )
    {
        var start = silence_starts[i];
        var end = silence_ends[i] || duration;
        if ( prev_end < start )
        {
            segments.push( { start: prev_end, end: start } );
        }
        prev_end = end;
    }
    if ( prev_end < duration )
    {
        segments.push( { start: prev_end, end: duration } );
    }
    return segments;

}

function getDuration( input_file, callback )
{
    var ffprobe_path = ffmpeg_installer.path.replace( /ffmpeg(\.exe)?$/, function( m ) { return m.startsWith("ffmpeg") ? "ffprobe" + (m.endsWith(".exe") ? ".exe" : "") : m; } );
    var args = [
        "-v", "error",
        "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1",
        input_file
    ];
    try
    {
        var output = execFileSync( ffprobe_path, args, { encoding: "utf8" } );
        callback( parseFloat( output.trim() ) );
    }
    catch ( e )
    {
        callback( 0 );
    }

}

function trimSilence( input_file, output_file )
{
    var silence_lines = [];
    detectSilence( input_file, function( line, done )
    {
        if ( line )
        {
            silence_lines.push( line );
        }
        if ( done )
        {
            getDuration( input_file, function( duration )
            {
                var silence = parseSilence( silence_lines );
                var segments = getNonSilentSegments( duration, silence.silence_starts, silence.silence_ends );
                if ( segments.length === 0 )
                {
                    console.log( "No non-silent segments found." );
                    return;
                }
                var filter = segments.map( function( seg )
                {
                    return `between(t,${seg.start},${seg.end})`;
                } ).join( "+" );
                var select_filter = `select='${filter}',setpts=N/FRAME_RATE/TB`;
                var aselect_filter = `aselect='${filter}',asetpts=N/SR/TB`;
                var ffmpeg_path = ffmpeg_installer.path;
                var args = [
                    "-i", input_file,
                    "-vf", select_filter,
                    "-af", aselect_filter,
                    "-y",
                    output_file
                ];
                var proc = spawn( ffmpeg_path, args, { stdio: "inherit" } );
                proc.on( "close", function( code )
                {
                    if ( code === 0 )
                    {
                        console.log( "Trimmed file saved as", output_file );
                    }
                    else
                    {
                        console.error( "Error trimming file, ffmpeg exited with code", code );
                    }
                } );
            } );
        }
    } );

}

if ( !g_input_file )
{
    console.log( "Usage: node trim_silence_mp4.js input.mp4 [output.mp4]" );
    process.exit( 1 );
}

trimSilence( g_input_file, g_output_file );
