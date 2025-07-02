
const g_axios = require( "axios" );

const g_auth_token = "";
const g_mural_id   = "";

const g_x = 90;
const g_y = 280;
const g_txt = "This is a sticky";

addSticky( g_x, g_y, g_txt );


function addSticky( x, y, txt )
{
	var func_name = "addSticky";
	
	// https://developers.mural.co/public/reference/createstickynote
	
    var headers = { "Accept"        : "application/json",
					"content-type"  : "application/json",
				    "Authorization" : "Bearer " + g_auth_token };
    
	var url = "https://app.mural.co/api/public/v1/murals/" + g_mural_id + "/widgets/sticky-note";
	
	var data = { "x"     : x, 
			     "y"     : y, 
			     "shape" : "rectangle",  
			     "text"  : txt }
	
	console.log( "url:\n" + url );
	
    g_axios.post( url, data, { "headers" : headers } ).then( function( response )
    {
        //console.log( func_name + " response:\n" + JSON.stringify( Object.keys( response ), null, 3 ) );
        //console.log( func_name + " response[\"status\"]: " + response["status"] );
        //console.log( func_name + " response[\"statusText\"]: " + response["statusText"] );
        //console.log( func_name + " response[\"headers\"]:\n" + JSON.stringify( response["headers"], null, 3 ) );
        //console.log( func_name + " response[\"data\"]:\n" + JSON.stringify( response["data"], null, 3 ) );

        if( ( 201 != response["status"] ) || ( "Created" != response["statusText"] ) )
        {
            var msg = "Adding a sticky note returned an error.\n" +
                      "Status: '" + response["status"] + "'";
            console.log( func_name + ": " + msg );
            return;
        }

        if( !( "data" in response ) || !( "value" in response["data"] ) || !( "id" in response["data"]["value"] ) )
        {
            var msg = "An unexpected result was returned from adding a sticky note";
            console.log( func_name + ": " + msg + "\n" + JSON.stringify( Object.keys( response ), null, 3 ) );
            return;
        }
		
		var widget_id = response["data"]["value"]["id"];
		
		console.log( "Success\nwidget id: " + widget_id );
		

    } ).catch( function( error )
    {
        var msg = "Reading the mural caught an error:\n" + error.message;
        console.log( func_name + ": " + msg + "\n" + error.stack );
        
    } );

}
