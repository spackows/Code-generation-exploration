const { execSync } = require( "child_process" );
const fs = require( "fs" );
const path = require( "path" );
const ffmpeg_installer = require( "@ffmpeg-installer/ffmpeg" );

var g_ffmpeg_path = ffmpeg_installer.path;

function getNonSilentSegments( input_file )
{
    var ffmpeg_cmd = "\"" + g_ffmpeg_path + "\" -i \"" + input_file + "\" -af silencedetect=noise=-30dB:d=0.5 -f null - 2>&1";
    var output = execSync( ffmpeg_cmd ).toString();
    var lines = output.split( "\n" );
    var segments = [];
    var last_end = 0;
    var duration = 0;
    lines.forEach( function( line )
    {
        if ( line.includes( "silence_start" ) )
        {
            var silence_start = parseFloat( line.split( "silence_start: " )[ 1 ] );
            if ( silence_start > last_end )
            {
                segments.push( { start: last_end, end: silence_start } );
            }
        }
        if ( line.includes( "silence_end" ) )
        {
            var silence_end = parseFloat( line.split( "silence_end: " )[ 1 ].split( " | " )[ 0 ] );
            last_end = silence_end;
        }
        // Parse duration from last "time=" in ffmpeg output
        if ( line.includes( "time=" ) )
        {
            var match = line.match( /time=([0-9:.]+)/ );
            if ( match )
            {
                var t = match[ 1 ].split( ":" );
                if ( t.length === 3 )
                {
                    var d = parseFloat( t[ 0 ] ) * 3600 + parseFloat( t[ 1 ] ) * 60 + parseFloat( t[ 2 ] );
                    if ( d > duration ) duration = d;
                }
            }
        }
    } );
    // Add last segment if needed
    if ( last_end < duration )
    {
        segments.push( { start: last_end, end: duration } );
    }
    return segments;

}

function trimSilence( input_file, output_file )
{
    var segments = getNonSilentSegments( input_file );
    if ( segments.length === 0 )
    {
        console.log( "No non-silent segments found." );
        return;
    }
    var temp_files = [];
    segments.forEach( function( seg, idx )
    {
        var temp_file = "segment_" + idx + ".mp4";
        // Re-encode to avoid DTS errors
        var cmd = "\"" + g_ffmpeg_path + "\" -y -i \"" + input_file + "\" -ss " + seg.start + " -to " + seg.end + " -c:v libx264 -c:a aac -strict -2 \"" + temp_file + "\"";
        execSync( cmd );
        temp_files.push( temp_file );
    } );
    var list_file = "segments.txt";
    fs.writeFileSync( list_file, temp_files.map( function( f ) { return "file '" + f + "'"; } ).join( "\n" ) );
    var concat_cmd = "\"" + g_ffmpeg_path + "\" -y -f concat -safe 0 -i " + list_file + " -c copy \"" + output_file + "\"";
    execSync( concat_cmd );
    temp_files.forEach( function( f ) { fs.unlinkSync( f ); } );
    fs.unlinkSync( list_file );
    console.log( "Trimmed file saved as " + output_file );

}

if ( process.argv.length < 4 )
{
    console.log( "Usage: node trim_silence_mp4.js input.mp4 output.mp4" );
    process.exit( 1 );
}
var g_input_file = process.argv[ 2 ];
var g_output_file = process.argv[ 3 ];
trimSilence( g_input_file, g_output_file );

