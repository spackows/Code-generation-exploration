const { execSync } = require( "child_process" );
const fs = require( "fs" );

if( process.argv.length < 4 )
{
    console.log( "Usage: node trim-silence_copilot_one-liner.js input.mp4 output.mp4" );
    process.exit( 1 );
}

var g_input_file = process.argv[ 2 ];
var g_output_file = process.argv[ 3 ];

// Step 1: Detect silence and get timestamps
var silence_cmd = `ffmpeg -i "${g_input_file}" -af silencedetect=noise=-30dB:d=0.5 -f null - 2>&1`;
var silence_output = execSync( silence_cmd ).toString();

var silence_intervals = [];
var re_start = /silence_start: ([\d\.]+)/g;
var re_end = /silence_end: ([\d\.]+)/g;
var starts = [];
var ends = [];

var match;
while( ( match = re_start.exec( silence_output ) ) !== null )
{
    starts.push( parseFloat( match[ 1 ] ) );
}
while( ( match = re_end.exec( silence_output ) ) !== null )
{
    ends.push( parseFloat( match[ 1 ] ) );
}

if( starts.length === 0 && ends.length === 0 )
{
    // No silence detected, just copy the file
    fs.copyFileSync( g_input_file, g_output_file );
    console.log( "No silence detected. File copied." );
    process.exit( 0 );
}

// Step 2: Build keep intervals (non-silent)
var duration_cmd = `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${g_input_file}"`;
var duration = parseFloat( execSync( duration_cmd ).toString().trim() );
var keep_intervals = [];
var last_end = 0;

for( var i = 0; i < Math.max( starts.length, ends.length ); i++ )
{
    var s = starts[ i ] !== undefined ? starts[ i ] : duration;
    var e = ends[ i ] !== undefined ? ends[ i ] : duration;
    if( last_end < s )
    {
        keep_intervals.push( { start: last_end, end: s } );
    }
    last_end = e;
}
if( last_end < duration )
{
    keep_intervals.push( { start: last_end, end: duration } );
}

// Step 3: Build ffmpeg trim filter
var filter = keep_intervals.map( function( interval, idx )
{
    return `[0:v]trim=start=${interval.start}:end=${interval.end},setpts=PTS-STARTPTS[v${idx}];[0:a]atrim=start=${interval.start}:end=${interval.end},asetpts=PTS-STARTPTS[a${idx}]`;
} ).join( ";" );
var v_concat = keep_intervals.map( function( _, idx ){ return `[v${idx}]`; } ).join( "" );
var a_concat = keep_intervals.map( function( _, idx ){ return `[a${idx}]`; } ).join( "" );
var concat_filter = `${filter};${v_concat}concat=n=${keep_intervals.length}:v=1:a=0[v];${a_concat}concat=n=${keep_intervals.length}:v=0:a=1[a]`;

var ffmpeg_cmd = `ffmpeg -i "${g_input_file}" -filter_complex "${concat_filter}" -map "[v]" -map "[a]" -y "${g_output_file}"`;

console.log( "Trimming silence..." );
execSync( ffmpeg_cmd, { stdio: "inherit" } );
console.log( "Done." );

