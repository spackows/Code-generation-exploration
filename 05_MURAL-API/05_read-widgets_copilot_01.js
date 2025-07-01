var https = require( "https" );

var g_mural_access_token = "";
var g_mural_id = "";

function readWidgets( callback )
{
    var options = {
        hostname: "api.mural.co",
        path: "/api/public/v1/murals/" + g_mural_id + "/widgets",
        method: "GET",
        headers: {
            "Authorization": "Bearer " + g_mural_access_token,
            "Content-Type": "application/json"
        }
    };

    var req = https.request( options, function( res )
    {
        var data = "";

        res.on( "data", function( chunk )
        {
            data += chunk;

        } );

        res.on( "end", function()
        {
            if ( res.statusCode !== 200 )
            {
                callback( "HTTP error: " + res.statusCode, null );
                return;
            }
            try
            {
                var json = JSON.parse( data );
                var widgets = json.widgets || [];
                callback( null, widgets );

            }
            catch ( err )
            {
                callback( "JSON parse error: " + err.message, null );

            }

        } );

    } );

    req.on( "error", function( err )
    {
        callback( "Request error: " + err.message, null );

    } );

    req.end();

}

readWidgets( function( err, widgets )
{
    if ( err )
    {
        console.log( "Error:", err );
        return;
    }
    console.log( widgets );

} );