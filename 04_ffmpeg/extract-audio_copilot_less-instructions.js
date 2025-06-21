const { exec } = require( "child_process" );
const ffmpeg_installer = require( "@ffmpeg-installer/ffmpeg" );

if ( process.argv.length < 4 )
{
    console.log( "Usage: node extract-audio_copilot.js <input.mp4> <output_audio_file>" );
    process.exit( 1 );
}

var g_input_file = process.argv[ 2 ];
var g_output_file = process.argv[ 3 ];

function extractAudio( input_file, output_file )
{
    var ffmpeg_path = ffmpeg_installer.path;
    var is_mp3 = output_file.toLowerCase().endsWith( ".mp3" );
    var acodec = is_mp3 ? "libmp3lame" : "copy";
    var cmd = `"${ffmpeg_path}" -i "${input_file}" -vn -acodec ${acodec} "${output_file}"`;
    console.log( "\ncmd:\n" + cmd );
    exec( cmd, function( error, stdout, stderr )
    {
        if ( error )
        {
            console.error( "Error extracting audio:", error );
            return;
        }
        console.log( "Audio extracted to", output_file );

    } );

}

extractAudio( g_input_file, g_output_file );
