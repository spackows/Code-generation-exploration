const path = require( "path" );
const fs = require( "fs" );

var g_lang_lookup = { "curl" : "CURL", "node" : "Node.js" };

function loadSampleContent( topic_id, callback )
{
    console.log( "loadSampleContent called with topic_id:", topic_id );

    var samples_dir = path.join( __dirname, "src", "samples" );
    console.log( "samples_dir:", samples_dir );

    var matched_files = listSampleFiles( topic_id );
    console.log( "matched_files:", matched_files );

    var results = [];

    if ( matched_files.length === 0 )
    {
        console.log( "No matched files found for topic_id:", topic_id );
        callback( results );
        return;

    }

    matched_files.forEach( function( file )
    {
        var sample = readSampleFile( file );
        console.log( "readSampleFile result for", file, ":", sample );
        results.push( sample );

    } );

    results = sortSamples( results );
    console.log( "Sorted results:", results );

    var sample_html = "<div id=\"samples_div\">\n<h2>Samples</h2>\n";
    results.forEach( function( sample )
    {
        var html = sampleHTML( [ sample ] );
        console.log( "sampleHTML for", sample, ":", html );
        sample_html += html;

    } );
    sample_html += "</div>";

    console.log( "Final sample_html:", sample_html );

    callback( sample_html );

}

function listSampleFiles( topic_id )
{
    var samples_dir = path.join( __dirname, "src", "samples" );
    console.log( "listSampleFiles called with topic_id:", topic_id );
    console.log( "samples_dir:", samples_dir );
    try
    {
        var files = fs.readdirSync( samples_dir );
        console.log( "Files in samples_dir:", files );
        var matched_files = files.filter( function( file )
        {
            // Match files that start with topic_id followed by underscore
            var match = file.startsWith( topic_id + "_" );
            console.log( "Checking file:", file, "match:", match );
            return match;

        } );
        console.log( "Matched files:", matched_files );
        return matched_files;

    }
    catch ( err )
    {
        console.log( "Error reading samples_dir:", err );
        return [];

    }

}

function readSampleFile( file_name )
{
    // Example: <topic_id>_<number>_<lang_id>.<ext>
    // Example: read-widgets_01_js.txt
    var regex = /^(.+?)_(\d+)_([^.]+)\.[^.]+$/;
    var match = file_name.match( regex );
    if ( !match )
    {
        return null;

    }

    var topic_id = match[1];
    var number = match[2];
    var lang_id = match[3];

    var samples_dir = path.join( __dirname, "src", "samples" );
    var file_path = path.join( samples_dir, file_name );
    var contents = "";

    try
    {
        contents = fs.readFileSync( file_path, "utf8" );

    }
    catch ( err )
    {
        console.log( err );
        contents = "";

    }

    var parsed = parseContents( contents );

    return {
        topic_id: topic_id,
        number: number,
        lang_id: lang_id,
        contents: contents,
        title: parsed.sample_title,
        code: parsed.code
    };

}

function parseContents( contents )
{
    var lines = contents.split( "\n" );
    var sample_title = "";
    var code_lines = [];
    var found_blank = false;

    for ( var i = 0; i < lines.length; i++ )
    {
        var line = lines[i];
        if ( !found_blank )
        {
            if ( i === 0 )
            {
                // Remove leading comment characters (//, #, *, REM, ::, etc.) and spaces
                sample_title = line.replace( /^(\s*(REM|::|[#\/\*]+)\s*)/i, "" ).trim();

            }
            if ( line.trim() === "" )
            {
                found_blank = true;

            }
        }
        else
        {
            code_lines.push( line );

        }
    }

    var code = code_lines.join( "\n" ).trim();

    return {
        sample_title: sample_title,
        code: code
    };

}

function sampleHTML( samples_arr )
{
    var html = "";
    samples_arr.forEach( function( sample )
    {
        var lang_name = g_lang_lookup[ sample.lang_id ] || sample.lang_id;
        html += "<h3>" + sample.title + "</h3>\n";
        html += "<div class=\"sample_div\">\n";
        html += "<h4>" + lang_name + "</h4>\n";
        html += "<pre class=\"sample_pre lang_curl\">\n";
        html += sample.code + "\n";
        html += "</pre>\n";
        html += "</div>\n";

    } );

    return html;

}

function sortSamples( samples_arr )
{
    var sorted_arr = samples_arr.slice();
    sorted_arr.sort( function( a, b )
    {
        if ( a.topic_id < b.topic_id )
        {
            return -1;

        }
        if ( a.topic_id > b.topic_id )
        {
            return 1;

        }
        var num_a = parseInt( a.number, 10 );
        var num_b = parseInt( b.number, 10 );
        if ( num_a < num_b )
        {
            return -1;

        }
        if ( num_a > num_b )
        {
            return 1;

        }
        if ( a.lang_id < b.lang_id )
        {
            return -1;

        }
        if ( a.lang_id > b.lang_id )
        {
            return 1;

        }
        return 0;

    } );

    return sorted_arr;

}

module.exports = {
    loadSampleContent: loadSampleContent,
    listSampleFiles: listSampleFiles,
    readSampleFile: readSampleFile,
    parseContents: parseContents,
    sampleHTML: sampleHTML,
    sortSamples: sortSamples
};
