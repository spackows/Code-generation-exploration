
const g_fs = require( "fs" );

var exports = module.exports = {};

const g_path = "src/docs/";


exports.loadTOC = function( callback )
{
	try
	{
		var topic_ids_arr = [];
		
		var file_names_arr = g_fs.readdirSync( g_path );
		console.log( "file_names_arr:\n" + JSON.stringify( file_names_arr, null, 3 ) );
		
		for( var i = 0; i < file_names_arr.length; i++ )
		{
			console.log( file_names_arr[i] );
			
			if( !file_names_arr[i].match( /\.html$/ ) )
			{
				continue;
			}
			
			topic_ids_arr.push( file_names_arr[i].replace( /\.html$/, "" ) );
		}
		
		console.log( "topic_ids_arr:\n" + JSON.stringify( topic_ids_arr, null, 3 ) );
		
		callback( topic_ids_arr );
	}
	catch( e )
	{
		console.log( "Loading table of contents failed:\n\n" + e.message );
		callback( [] );
	}
}

