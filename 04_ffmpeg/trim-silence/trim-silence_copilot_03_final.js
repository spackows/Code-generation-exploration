const ffmpeg_installer = require( "@ffmpeg-installer/ffmpeg" );
// Removed: const ffmpeg = require( "fluent-ffmpeg" );
const fs = require( "fs" );
const { execSync } = require( "child_process" );

// Removed: ffmpeg.setFfmpegPath( ffmpeg_installer.path );

var g_input_file = process.argv[ 2 ];
var g_output_file = process.argv[ 3 ] || "output_trimmed.mp4";
var g_silence_threshold = process.argv[ 4 ] || "-30dB";
var g_silence_duration = process.argv[ 5 ] || "0.5";

function detectSilence( input_file, silence_threshold, silence_duration, callback )
{
    var command = `"${ffmpeg_installer.path}" -i "${input_file}" -af silencedetect=noise=${silence_threshold}:d=${silence_duration} -f null - 2>&1`;
    var output = execSync( command ).toString();
    var silence_starts = [];
    var silence_ends = [];
    var lines = output.split( "\n" );
    lines.forEach( function( line )
    {
        if ( line.includes( "silence_start:" ) )
        {
            silence_starts.push( parseFloat( line.split( "silence_start:" )[ 1 ] ) );
        }
        if ( line.includes( "silence_end:" ) )
        {
            silence_ends.push( parseFloat( line.split( "silence_end:" )[ 1 ].split( " | " )[ 0 ] ) );
        }
    } );
    callback( silence_starts, silence_ends );

}

function getNonSilentSegments( duration, silence_starts, silence_ends )
{
    var segments = [];
    var last_end = 0;
    for ( var i = 0; i < silence_starts.length; i++ )
    {
        var seg_start = last_end;
        var seg_end = silence_starts[ i ];
        if ( seg_end > seg_start )
        {
            segments.push( { start: seg_start, end: seg_end } );
        }
        last_end = silence_ends[ i ] || last_end;
    }
    if ( last_end < duration )
    {
        segments.push( { start: last_end, end: duration } );
    }
    return segments;

}

function getDuration( input_file, callback )
{
    var command = `"${ffmpeg_installer.path}" -i "${input_file}" 2>&1`;
    var output = "";
    try
    {
        output = execSync( command ).toString();
    }
    catch ( e )
    {
        output = e.stdout ? e.stdout.toString() : (e.message || "");
    }
    var duration_match = output.match( /Duration: (\d+):(\d+):(\d+\.\d+)/ );
    if ( duration_match )
    {
        var hours = parseInt( duration_match[ 1 ] );
        var minutes = parseInt( duration_match[ 2 ] );
        var seconds = parseFloat( duration_match[ 3 ] );
        var duration = hours * 3600 + minutes * 60 + seconds;
        callback( duration );
    }
    else
    {
        throw new Error( "Could not determine duration" );
    }

}

function trimAndConcat( input_file, segments, output_file )
{
    var list_file = "segments.txt";
    var commands = [];
    segments.forEach( function( seg, idx )
    {
        var seg_file = `seg_${idx}.mp4`;
        // Re-encode segments to ensure proper timestamps for concat
        commands.push(
            `"${ffmpeg_installer.path}" -y -i "${input_file}" -ss ${seg.start} -to ${seg.end} -c:v libx264 -c:a aac -strict -2 -fflags +genpts "${seg_file}"`
        );
    } );
    commands.forEach( function( cmd )
    {
        execSync( cmd );
    } );
    var list_content = segments.map( function( seg, idx )
    {
        return `file 'seg_${idx}.mp4'`;
    } ).join( "\n" );
    fs.writeFileSync( list_file, list_content );
    execSync(
        `"${ffmpeg_installer.path}" -y -f concat -safe 0 -i ${list_file} -c copy "${output_file}"`
    );
    segments.forEach( function( seg, idx )
    {
        fs.unlinkSync( `seg_${idx}.mp4` );
    } );
    fs.unlinkSync( list_file );

}

if ( !g_input_file )
{
    console.log( "Usage: node trim-silence_copilot_03_02.js input.mp4 [output.mp4] [silence_threshold] [silence_duration]" );
    process.exit( 1 );

}

getDuration( g_input_file, function( duration )
{
    detectSilence( g_input_file, g_silence_threshold, g_silence_duration, function( silence_starts, silence_ends )
    {
        var segments = getNonSilentSegments( duration, silence_starts, silence_ends );
        if ( segments.length === 0 )
        {
            console.log( "No non-silent segments detected." );
            process.exit( 1 );
        }
        trimAndConcat( g_input_file, segments, g_output_file );
        console.log( "Done. Output file:", g_output_file );

    } );

} );