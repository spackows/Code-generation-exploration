var g_video_filename = "sample-video.mp4";

const { exec } = require( "child_process" );
const ffmpeg_installer = require( "@ffmpeg-installer/ffmpeg" );

function extractAudio( video_filename )
{
    var path = require( "path" );
    var audio_filename = path.basename( video_filename, path.extname( video_filename ) ) + ".mp3";
    var cmd = "\"" + ffmpeg_installer.path + "\" -i \"" + video_filename + "\" -vn -acodec libmp3lame \"" + audio_filename + "\"";

    console.log( cmd );

    exec( cmd, function( error, stdout, stderr )
    {
        if ( error )
        {
            console.log( "Error: " + error );
        }
        console.log( stdout );
        console.log( stderr );

    } );

}

extractAudio( g_video_filename );
