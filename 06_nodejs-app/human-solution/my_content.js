
const g_fs = require( "fs" );

var exports = module.exports = {};

const g_path = "src/docs/";


                

exports.validTopicID = function( topic_id, callback )
{
	var topic_full_path = g_path + topic_id.replace( /[^a-z0-9\-\_]/ig, "" ) + ".html";
	
	if( g_fs.existsSync( topic_full_path ) )
	{
		return true;
	}
	
	return false;
}


exports.loadHTMLContent = function( topic_id, callback )
{
	try
	{
		console.log( "topic_id: " + topic_id );
		var topic_full_path = g_path + topic_id.replace( /[^a-z0-9\-\_]/ig, "" ) + ".html";
		console.log( "topic_full_path: " + topic_full_path );
		
		var content = g_fs.readFileSync( topic_full_path, "utf8" );
		console.log( "content:" );
		console.log( content );
		console.log( "---" );
		
		callback( content );
	}
	catch( e )
	{
		console.log( "Reading topic source failed:\n\n" + e.message );
		callback( "<h1>Error</h1><p>Reading the topic source failed</p>" );
	}

}
	
