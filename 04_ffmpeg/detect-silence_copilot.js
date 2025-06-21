const { spawn } = require( "child_process" );
const ffmpegPath = require( "@ffmpeg-installer/ffmpeg" ).path;

if( process.argv.length < 3 )
{
    console.error( "Usage: node detect-silence_copilot.js <input.mp4>" );
    process.exit( 1 );
}

var g_input_file = process.argv[ 2 ];
var g_silence_periods = [];
var g_silence_start = null;

function parseFfmpegOutput( data )
{
    var lines = data.toString().split( "\n" );

    for( var i = 0; i < lines.length; i++ )
    {
        var line = lines[ i ];
        var match_start = line.match( /silence_start: ([0-9.]+)/ );
        var match_end = line.match( /silence_end: ([0-9.]+)/ );
        if( match_start )
        {
            g_silence_start = parseFloat( match_start[ 1 ] );
        }
        if( match_end )
        {
            var silence_end = parseFloat( match_end[ 1 ] );
            if( g_silence_start !== null )
            {
                g_silence_periods.push( { "silence_start": g_silence_start, "silence_end": silence_end } );
                g_silence_start = null;
            }
        }
    }

}

function detectSilence( input_file )
{
    var ffmpeg_args = [
        "-i", input_file,
        "-af", "silencedetect=noise=-30dB:d=0.5",
        "-f", "null", "-"
    ];

    var ffmpeg = spawn( ffmpegPath, ffmpeg_args );

    ffmpeg.stderr.on( "data", function( data )
    {
        parseFfmpegOutput( data );

    } );

    ffmpeg.on( "close", function( code )
    {
        // If a silence started but never ended, close it at EOF
        if( g_silence_start !== null )
        {
            g_silence_periods.push( { "silence_start": g_silence_start, "silence_end": null } );
            g_silence_start = null;
        }
        console.log( JSON.stringify( g_silence_periods, null, 4 ) );

    } );
}

detectSilence( g_input_file );
