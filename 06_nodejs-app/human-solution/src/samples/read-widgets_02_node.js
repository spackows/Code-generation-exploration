// Sample 2: Print only the first 5 widgets of type sticky notes or text
// The following Node.js code calls the MURAL API to read the first 
// 5 widgets of type "sticky note" or "text" in a mural with the 
// identidier <your-mural-id>.
// 

const axios = require( "axios" );

const auth_token = "<your-auth-token>";
const mural_id   = "<your-mural-id>";

var headers = { "Accept" : "application/json", "Authorization" : "Bearer " + auth_token };

var url = "https://app.mural.co/api/public/v1/murals/" + g_mural_id + "/widgets" +
          "?type=\"sticky notes,texts\"" +
          "&limit=5";
	
axios.get( url, { "headers" : headers } ).then( function( response )
{
    var widgets_arr = response["data"]["value"];
    
    console.log( JSON.stringify( widgets_arr, null, 3 ) );

} ).catch( function( error )
{
    console.log( error.message );
    
} );
