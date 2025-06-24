const ffmpeg = require( "fluent-ffmpeg" );
const { execSync } = require( "child_process" );
const fs = require( "fs" );

function detectSilence( input_file, silence_threshold, silence_duration )
{
    var cmd = `ffmpeg -i "${input_file}" -af silencedetect=noise=${silence_threshold}dB:d=${silence_duration} -f null - 2>&1`;
    var output = execSync( cmd ).toString();
    var silence_starts = [];
    var silence_ends = [];
    var lines = output.split( "\n" );
    for ( var i = 0; i < lines.length; i++ )
    {
        if ( lines[ i ].includes( "silence_start:" ) )
        {
            silence_starts.push( parseFloat( lines[ i ].split( "silence_start: " )[ 1 ] ) );
        }
        if ( lines[ i ].includes( "silence_end:" ) )
        {
            silence_ends.push( parseFloat( lines[ i ].split( "silence_end: " )[ 1 ].split( " | " )[ 0 ] ) );
        }
    }
    return { silence_starts, silence_ends };

}

function getNonSilentSegments( duration, silence_starts, silence_ends )
{
    var segments = [];
    var prev_end = 0;
    for ( var i = 0; i < silence_starts.length; i++ )
    {
        if ( silence_starts[ i ] > prev_end )
        {
            segments.push( { start: prev_end, end: silence_starts[ i ] } );
        }
        prev_end = silence_ends[ i ];
    }
    if ( prev_end < duration )
    {
        segments.push( { start: prev_end, end: duration } );
    }
    return segments;

}

function getDuration( input_file )
{
    var cmd = `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${input_file}"`;
    var output = execSync( cmd ).toString();
    return parseFloat( output );

}

function cutSegments( input_file, segments, temp_dir )
{
    if ( !fs.existsSync( temp_dir ) )
    {
        fs.mkdirSync( temp_dir );
    }
    var files = [];
    for ( var i = 0; i < segments.length; i++ )
    {
        var seg = segments[ i ];
        var out_file = `${temp_dir}/part_${i}.mp4`;
        var cmd = `ffmpeg -y -i "${input_file}" -ss ${seg.start} -to ${seg.end} -c copy "${out_file}"`;
        execSync( cmd );
        files.push( out_file );
    }
    return files;

}

function concatSegments( files, output_file )
{
    var list_file = "concat_list.txt";
    fs.writeFileSync( list_file, files.map( f => `file '${f}'` ).join( "\n" ) );
    var cmd = `ffmpeg -y -f concat -safe 0 -i ${list_file} -c copy "${output_file}"`;
    execSync( cmd );
    fs.unlinkSync( list_file );

}

function removeSilenceFromMp4( input_file, output_file, silence_threshold = -35, silence_duration = 0.5 )
{
    var duration = getDuration( input_file );
    var { silence_starts, silence_ends } = detectSilence( input_file, silence_threshold, silence_duration );
    var segments = getNonSilentSegments( duration, silence_starts, silence_ends );
    var temp_dir = "temp_parts";
    var files = cutSegments( input_file, segments, temp_dir );
    concatSegments( files, output_file );
    files.forEach( f => fs.unlinkSync( f ) );
    fs.rmdirSync( temp_dir );

}

// Usage: node remove_silence.js input.mp4 output.mp4
if ( process.argv.length < 4 )
{
    console.log( "Usage: node remove_silence.js input.mp4 output.mp4" );
    process.exit( 1 );
}
removeSilenceFromMp4( process.argv[ 2 ], process.argv[ 3 ] );

