
var g_ffmpegPath = require( "@ffmpeg-installer/ffmpeg" ).path;
var g_exec = require( "child_process" ).execSync;


const g_video_filename = "video-with-silences.mp4";

const g_threshold = "0.001";
const g_duration  = "0.2";


var g_ffmpeg_output = detectSilence( g_video_filename );

var g_timing_arr = formatOutput( g_ffmpeg_output );

console.log( "\nsilences:\n" + JSON.stringify( g_timing_arr, null, 3 ) );


function detectSilence( video_filename )
{
	var cmd = g_ffmpegPath + " " +
              "-i " + video_filename + " " +
              "-y " +
              "-filter:a silencedetect=noise=" + g_threshold + ":duration=" + g_duration + " " +
              "-vn " +
              "-copyts " +
              "-start_at_zero " +
              "-f null " +
			  "/dev/null " +
			  "2>&1";
	console.log( "\ncmd:\n" + cmd );

    var output = g_exec( cmd ).toString();
	console.log( "\noutput:\n" + output );

    return output;
}


function formatOutput( output )
{
	var timing_arr = [];
	
	// Part of the output looks like this:
	// ...
	// [silencedetect @ 000001cc25a2d600] silence_start: 0
	// [silencedetect @ 000001cc25a2d600] silence_end: 2.18367 | silence_duration: 2.18367
	// [silencedetect @ 000001cc25a2d600] silence_start: 5.09197
	// [silencedetect @ 000001cc25a2d600] silence_end: 5.57088 | silence_duration: 0.478912
	// ...
	
	var regex = new RegExp( /silence_start\:\s+(\d*(\.\d*)*)[\S\s]*?silence_end\:\s+(\d*(\.\d*)*)/g );
	
	var matches_arr   = [];
	var silence_start = "";
	var silence_end   = "";
	while( matches_arr = regex.exec( output ) )
	{
		if( !matches_arr )
		{
			continue;
		}
		
		silence_start = "";
		silence_end = "";
		
		if( ( matches_arr.length >= 2 ) && ( null != matches_arr[1] ) )
		{
			silence_start = matches_arr[1].toString();
		}
		
		if( ( matches_arr.length >= 4 ) && ( null != matches_arr[3] ) )
		{
			silence_end = matches_arr[3].toString();
		}
		
		timing_arr.push( { "silence_start" : silence_start, "silence_end" : silence_end } );
		
	}
	
	return timing_arr;
	
}

