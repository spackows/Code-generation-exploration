const ffmpeg = require("fluent-ffmpeg");
const ffmpeg_installer = require("@ffmpeg-installer/ffmpeg");
const fs = require("fs");

ffmpeg.setFfmpegPath(ffmpeg_installer.path);

const g_input_file = process.argv[2];
const g_output_file = process.argv[3] || "output_trimmed.mp4";
const g_silence_threshold = "-30dB";
const g_silence_duration = 1;

function detectSilence( input_file, callback )
{
    var command = ffmpeg( input_file )
        .audioFilters( `silencedetect=noise=${g_silence_threshold}:d=${g_silence_duration}` )
        .format( "null" )
        .on( "stderr", function( line )
        {
            if ( line.includes( "silencedetect" ) )
            {
                callback( line );
            }
        } )
        .on( "end", function()
        {
            callback( null, true );
        } )
        .on( "error", function( err )
        {
            console.error( "Error detecting silence:", err );
        } )
        .saveToFile( "/dev/null" );
}

function parseSilence( lines )
{
    var silence_starts = [];
    var silence_ends = [];
    lines.forEach( function( line )
    {
        var start = line.match( /silence_start: ([\d.]+)/ );
        var end = line.match( /silence_end: ([\d.]+)/ );
        if ( start )
        {
            silence_starts.push( parseFloat( start[1] ) );
        }
        if ( end )
        {
            silence_ends.push( parseFloat( end[1] ) );
        }
    } );
    return { silence_starts, silence_ends };

}

function getNonSilentSegments( duration, silence_starts, silence_ends )
{
    var segments = [];
    var prev_end = 0;
    for ( var i = 0; i < silence_starts.length; i++ )
    {
        var start = silence_starts[i];
        var end = silence_ends[i] || duration;
        if ( prev_end < start )
        {
            segments.push( { start: prev_end, end: start } );
        }
        prev_end = end;
    }
    if ( prev_end < duration )
    {
        segments.push( { start: prev_end, end: duration } );
    }
    return segments;

}

function getDuration( input_file, callback )
{
    ffmpeg.ffprobe( input_file, function( err, metadata )
    {
        if ( err )
        {
            callback( 0 );
        }
        else
        {
            callback( metadata.format.duration );
        }
    } );

}

function trimSilence( input_file, output_file )
{
    var silence_lines = [];
    detectSilence( input_file, function( line, done )
    {
        if ( line )
        {
            silence_lines.push( line );
        }
        if ( done )
        {
            getDuration( input_file, function( duration )
            {
                var silence = parseSilence( silence_lines );
                var segments = getNonSilentSegments( duration, silence.silence_starts, silence.silence_ends );
                var filter = segments.map( function( seg )
                {
                    return `between(t,${seg.start},${seg.end})`;
                } ).join( "+" );
                var select_filter = `select='${filter}',setpts=N/FRAME_RATE/TB`;
                ffmpeg( input_file )
                    .videoFilters( select_filter )
                    .audioFilters( `aselect='${filter}',asetpts=N/SR/TB` )
                    .output( output_file )
                    .on( "end", function()
                    {
                        console.log( "Trimmed file saved as", output_file );
                    } )
                    .on( "error", function( err )
                    {
                        console.error( "Error trimming file:", err );
                    } )
                    .run();
            } );
        }
    } );

}

if ( !g_input_file )
{
    console.log( "Usage: node trim_silence_mp4.js input.mp4 [output.mp4]" );
    process.exit( 1 );
}

trimSilence( g_input_file, g_output_file );
