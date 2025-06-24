// Usage: node trim-silence_copilot_one-liner.js input.mp4 output.mp4

const { execSync } = require("child_process");

if ( process.argv.length < 4 )
{
    console.log( "Usage: node trim-silence_copilot_one-liner.js input.mp4 output.mp4" );
    process.exit( 1 );
}

var g_input_file = process.argv[2];
var g_output_file = process.argv[3];

// Adjust silence threshold and duration as needed
var g_silence_threshold = "-30dB";
var g_silence_duration = 0.5;

// Build ffmpeg command to remove silence
var g_cmd = `ffmpeg -i "${g_input_file}" -af silenceremove=start_periods=1:start_duration=${g_silence_duration}:start_threshold=${g_silence_threshold}:detection=peak,areverse,silenceremove=start_periods=1:start_duration=${g_silence_duration}:start_threshold=${g_silence_threshold}:detection=peak,areverse -c:v copy "${g_output_file}" -y`;

try
{
    execSync( g_cmd, { stdio: "inherit" } );
    console.log( "Silence trimmed. Output saved to " + g_output_file );
}
catch ( e )
{
    console.error( "Error trimming silence:", e );
}

