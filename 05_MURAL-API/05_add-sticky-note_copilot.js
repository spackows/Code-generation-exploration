const axios = require( "axios" );

// Global mural ID variable
var g_mural_id = ""; // Set this to your mural ID

// Global API token variable
var g_api_token = ""; // Set your MURAL API token here

/**
 * Adds a sticky note to a mural using the MURAL API.
 * @param {number} x - The x-position of the sticky note.
 * @param {number} y - The y-position of the sticky note.
 * @param {string} txt - The text for the sticky note.
 */
function addSticky( x, y, txt )
{
    var url = "https://app.mural.co/api/public/v1/murals/" + g_mural_id + "/widgets/sticky-note";

    var data = {
        "x": x,
        "y": y,
        "text": txt,
        "shape": "rectangle"
    };

    var headers = {
        "Authorization": "Bearer " + g_api_token,
        "Content-Type": "application/json"
    };

    axios.post( url, data, { headers: headers } )
        .then( function( response )
        {
            if ( response.data && Array.isArray( response.data.value ) && response.data.value.length > 0 )
            {
                //console.log( response.data.value[0].id );
				console.log( response.data.value.id );
            }

        } )
        .catch( function( error )
        {
            console.error( "Error adding sticky note:", error.response ? error.response.data : error.message );

        } );

}

addSticky( 100, 150, "Hello from Copilot!" );