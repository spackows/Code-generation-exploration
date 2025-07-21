// Sample 1: Print all widgets in a mural
// The following Node.js code calls the MURAL API to read all 
// widgets in a mural with the identidier <your-mural-id>.
// 

const axios = require( "axios" );

const auth_token = "<your-auth-token>";
const mural_id   = "<your-mural-id>";

var headers = { "Accept" : "application/json", "Authorization" : "Bearer " + auth_token };

var url = "https://app.mural.co/api/public/v1/murals/" + g_mural_id + "/widgets";
	
axios.get( url, { "headers" : headers } ).then( function( response )
{
    var widgets_arr = response["data"]["value"];
    
    console.log( JSON.stringify( widgets_arr, null, 3 ) );

} ).catch( function( error )
{
    console.log( error.message );
    
} );
