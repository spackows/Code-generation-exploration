// Sample 1: Create a simple sticky note in a mural
// The following Node.js code calls the MURAL API to create a
// simple sticky note in a mural with the identidier <your-mural-id>.
// The data passed to this API call has all the required fields:
// "x", "y", and "shape".  The message "Here is a sticky note" is 
// also included in plain text.  Everything else about the sticky 
// note is left to the default behavior.  After the sticky note is 
// successfully created,the ID of the created widget is printed.
// 

const axios = require( "axios" );

const auth_token = "<your-auth-token>";
const mural_id   = "<your-mural-id>";

var headers = { "Accept" : "application/json",
                "Content-type" : "application/json",
                "Authorization" : "Bearer " + auth_token };

var url = "https://app.mural.co/api/public/v1/murals/" + g_mural_id + "/widgets/sticky-note";

var data = { "x"     : x, 
             "y"     : y, 
             "shape" : "rectangle",
             "text"  : "Here is a sticky note" };
	
axios.post( url, data, { "headers" : headers } ).then( function( response )
{
    var widget_id = response["data"]["value"]["id"];
		
    console.log( "Success\nwidget id: " + widget_id );

} ).catch( function( error )
{
    console.log( error.message );
    
} );
