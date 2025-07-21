
const g_fs = require( "fs" );

var exports = module.exports = {};

const g_path = "src/samples/";
                
const g_language_look_up = { "curl" : "CURL",
                             "node" : "Node.js" };

exports.loadSampleContent = function( topic_id, callback )
{
    var sample_file_names_arr = listRelatedSampleFileNames( topic_id );
    
    var samples_json = readSampleContents( sample_file_names_arr );
    
    var samples_arr = convertToArray( samples_json );
    
    var samples_html = samplesHTML( samples_arr );
    
    callback( samples_html );

}
	

function listRelatedSampleFileNames( topic_id )
{
    try
    {
        console.log( "topic_id: " + topic_id );
        var sample_full_root = g_path + topic_id.replace( /[^a-z0-9\-\_]/ig, "" );
        console.log( "sample_full_root: " + sample_full_root );

        var regex = new RegExp( "^" + topic_id );
        console.log( "regex: " + regex );
        
        var file_names_arr = g_fs.readdirSync( g_path );
        console.log( "file_names_arr:\n" + JSON.stringify( file_names_arr, null, 3 ) );
        
        var sample_file_names_arr = [];
        for( var i = 0; i < file_names_arr.length; i++ )
        {
            console.log( file_names_arr[i] );
            
            if( !file_names_arr[i].match( regex ) )
            {
                continue;
            }
            
            sample_file_names_arr.push( file_names_arr[i] );
        }
        console.log( "sample_file_names_arr:\n" + JSON.stringify( sample_file_names_arr, null, 3 ) );
        
        return sample_file_names_arr;
        
    }
	catch( e )
	{
		console.log( "Listing related samples failed:\n\n" + e.message );
		return [];
	}

}


function readSampleContents( sample_file_names_arr )
{
    try
    {
        var sample_num = "";
        var lang       = "";
        var full_path  = "";
        var content    = "";
        var title      = "";
        var code       = "";
        var samples_json = {};
        
		for( var i = 0; i < sample_file_names_arr.length; i++ )
		{
            console.log( sample_file_names_arr[i] );
            sample_num = sample_file_names_arr[i].replace( /[^\d]*$/, "" ).replace( /^.*\_/, "" );
            lang       = sample_file_names_arr[i].replace( /^.*\_/, "" ).replace( /\..*$/, "" );
            console.log( "sample_num: " + sample_num );
            console.log( "lang: " + lang );
            
            full_path = g_path + sample_file_names_arr[i];
            console.log( full_path );
            
            content = g_fs.readFileSync( full_path, "utf8" );
            console.log( "content:" );
            console.log( content );
            console.log( "---" );
            
            title = getTitle( content );
            console.log( "title: " + title );
            
            code = getCode( content );
            console.log( "code: " + code );
            
            if( !( sample_num in samples_json ) )
            {
                samples_json[ sample_num ] = {};
            }
            
            samples_json[ sample_num ][ lang ] = { "title" : title, "code" : code };
        }
        console.log( "samples_json: " + JSON.stringify( samples_json, null, 0 ) );
        
        return samples_json;
        
    }
	catch( e )
	{
		console.log( "Reading samples failed:\n\n" + e.message );
		return {};
	}
    
}


function convertToArray( samples_json )
{
    try
    {
        var sample_nums_arr = Object.keys( samples_json );
        sample_nums_arr.sort( function( a, b )
        {
            var a_int = parseInt( a );
            var b_int = parseInt( b );
            
            if( a < b )
            {
                return -1;
            }
            
            if( a > b )
            {
                return +1;
            }
            
            return 0;
            
        } );
        console.log( "sample_nums_arr: " + JSON.stringify( sample_nums_arr, null, 0 ) );
        
        var samples_arr = [];
        for( var i = 0; i < sample_nums_arr.length; i++ )
        {
            samples_arr.push( samples_json[ sample_nums_arr[i] ] );
        }
        console.log( "samples_arr: " + JSON.stringify( samples_arr, null, 0 ) );
        
        return samples_arr;
    }
    catch( e )
	{
		console.log( "Converting samples to an array failed:\n\n" + e.message );
		return [];
	}

}


function getTitle( content )
{
    try
    {
        var lines_arr = content.split( /\n+/ );
        
        var title = lines_arr[0].replace( /^.*?\s/, "" ).replace( /\s+$/, "" );
        
        return title.trim();
    }
	catch( e )
	{
		console.log( "Getting title failed:\n\n" + e.message );
		return "";
	}
    
}


function getCode( content )
{
    try
    {
        var lines_arr = content.split( /\n+/ );
        
        while( lines_arr[0].match( /\S/ ) )
        {
            // Remove comments
            lines_arr.shift();
        }
        
        while( !lines_arr[0].match( /\S/ ) )
        {
            // Remove vertical space after comments
            lines_arr.shift();
        }
        
        var code = lines_arr.join( "\n" ).trim();
        
        return code;
    }
	catch( e )
	{
		console.log( "Getting code failed:\n\n" + e.message );
		return "";
	}
    
}


function samplesHTML( samples_arr )
{
    try
    {
        if( samples_arr.length < 1 )
        {
            return "";
        }
        
        var samples_html = "<div id=\"samples_div\">\n" +
                           "<h2>Samples</h2>\n\n";
        
        var sample_json = {};
        var lang_arr = [];
        var title    = "";
        var language = "";
        var lang     = "";
        for( var i = 0; i < samples_arr.length; i++ )
        {
            sample_json = samples_arr[i];
            lang_arr = Object.keys( sample_json );
            title    = sample_json[ lang_arr[0] ]["title"];
            
            samples_html += "<h3>" + title + "</h3>\n" +
                            "<div class=\"sample_div\">\n";
            
            for( var j = 0; j < lang_arr.length; j++ )
            {
                lang = lang_arr[j];
                language = g_language_look_up[ lang ];
                code = sample_json[ lang ]["code"].replace( /\&/g, "&amp;" ).replace( /\</g, "&lt;" );
                
                samples_html += "<h4>" + language + "</h4>\n" +
                                "<pre class=\"sample_pre lang_" + lang + "\">\n" +
                                code + "\n" +
                                "</pre>\n\n";
            }
            
            samples_html += "</div>\n\n";
        }
        
        samples_html += "</div>\n";
        
        console.log( "samples_html:\n" + samples_html );
        
        return samples_html;
        
    }
	catch( e )
	{
		console.log( "Creating samples HTML failed:\n\n" + e.message );
		return "";
	}
}

