const ffmpeg_installer = require( "@ffmpeg-installer/ffmpeg" );
const ffmpeg = require( "fluent-ffmpeg" );
const fs = require( "fs" );
const { execSync } = require( "child_process" );

ffmpeg.setFfmpegPath( ffmpeg_installer.path );

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
    // ...existing code...
}

function getDuration( input_file, callback )
{
    // ...existing code...
}

function trimAndConcat( input_file, segments, output_file )
{
    var list_file = "segments.txt";
    var commands = [];
    segments.forEach( function( seg, idx )
    {
        var seg_file = `seg_${idx}.mp4`;
        commands.push( `"${ffmpeg_installer.path}" -y -i "${input_file}" -ss ${seg.start} -to ${seg.end} -c copy "${seg_file}"` );
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
    execSync( `"${ffmpeg_installer.path}" -y -f concat -safe 0 -i ${list_file} -c copy "${output_file}"` );
    segments.forEach( function( seg, idx )
    {
        fs.unlinkSync( `seg_${idx}.mp4` );
    } );
    fs.unlinkSync( list_file );

}

if ( !g_input_file )
{
    // ...existing code...
}

getDuration( g_input_file, function( duration )
{
    // ...existing code...
} );