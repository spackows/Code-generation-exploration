// Usage: node trim-silence_copilot_one-liner.js input.mp4 output.mp4

const { execSync } = require( "child_process" );
const ffmpeg_installer = require( "@ffmpeg-installer/ffmpeg" );

if ( process.argv.length < 4 )
{
    console.log( "Usage: node trim-silence_copilot_one-liner.js input.mp4 output.mp4" );
    process.exit( 1 );
}

var g_input_file = process.argv[2];
var g_output_file = process.argv[3];

var g_ffmpeg_path = ffmpeg_installer.path;

// Adjust silence threshold and duration as needed
var g_silence_threshold = "-30dB";
var g_silence_duration = 0.5;

// Build ffmpeg command to remove silence
var g_cmd = `"${g_ffmpeg_path}" -i "${g_input_file}" -filter_complex "silenceremove=start_periods=1:start_duration=${g_silence_duration}:start_threshold=${g_silence_threshold}:detection=peak,areverse,silenceremove=start_periods=1:start_duration=${g_silence_duration}:start_threshold=${g_silence_threshold}:detection=peak,areverse[aout]" -map 0:v -map "[aout]" -c:v copy -c:a aac -strict -2 "${g_output_file}" -y`;

try
{
    execSync( g_cmd, { stdio: "inherit" } );
    console.log( "Silence trimmed. Output saved to " + g_output_file );
}
catch ( e )
{
    console.error( "Error trimming silence:", e );
}

