
const g_axios = require( "axios" );

const g_auth_token = "";
const g_mural_id   = "";


readWidgets( function( error_str, widgets_json )
{
	if( error_str )
	{
		console.log( error_str );
		return;
	}
	
	console.log( JSON.stringify( widgets_json, null, 3 ) );
	
} );


function readWidgets( callback )
{
	var func_name = "readWidgets";
	
	// https://developers.mural.co/public/reference/getmuralwidgets
	
    var headers = { "Accept"        : "application/json",
				    "Authorization" : "Bearer " + g_auth_token };
    
	var url = "https://app.mural.co/api/public/v1/murals/" + g_mural_id + "/widgets";
	
    g_axios.get( url, { "headers" : headers } ).then( function( response )
    {
        //console.log( func_name + " response:\n" + JSON.stringify( Object.keys( response ), null, 3 ) );
        //console.log( func_name + " response[\"status\"]: " + response["status"] );
        //console.log( func_name + " response[\"statusText\"]: " + response["statusText"] );
        //console.log( func_name + " response[\"headers\"]:\n" + JSON.stringify( response["headers"], null, 3 ) );
        //console.log( func_name + " response[\"data\"]:\n" + JSON.stringify( response["data"], null, 3 ) );

        if( 200 != response["status"] )
        {
            var msg = "Reading the mural returned an error.\n" +
                      "Status: '" + response["status"] + "'";
            console.log( func_name + ": " + msg );
            callback( msg, [] );
            return;
        }

        if( !( "data" in response ) )
        {
            var msg = "An unexpected result was returned from reading the mural";
            console.log( func_name + ": " + msg + "\n" + JSON.stringify( Object.keys( response ), null, 3 ) );
            callback( msg, [] );
            return;
        }
        
        if( !( "value" in response["data"] ) || 
		    !response["data"]["value"]       || 
			!Array.isArray( response["data"]["value"] ) ||
			( response["data"]["value"].length < 1 ) )
        {
            var msg = "No widgets were returned";
            console.log( func_name + ": " + msg + "\n" + JSON.stringify( Object.keys( response ), null, 3 ) );
            callback( msg, [] );
            return;
        }

        callback( "", response["data"]["value"] );

    } ).catch( function( error )
    {
        var msg = "Reading the mural caught an error:\n" + error.message;
        console.log( func_name + ": " + msg + "\n" + error.stack );
        callback( msg, [] );
        
    } );

}


