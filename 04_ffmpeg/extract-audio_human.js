
var g_ffmpegPath = require( "@ffmpeg-installer/ffmpeg" ).path;
var g_exec = require( "child_process" ).execSync;


const g_video_filename = "sample-video.mp4";

extractAudio( g_video_filename );


function extractAudio( video_filename )
{
	var audio_filename = video_filename.replace( /\..*?$/, ".mp3" );
	
    var cmd = g_ffmpegPath + " " +
              "-i " + video_filename + " " +
              "-vn " +
              audio_filename + " " +
			  "2>&1";
	console.log( "\ncmd:\n" + cmd );

    var output = g_exec( cmd ).toString();
	console.log( "\noutput:\n" + output );
	
}
