const path = require( "path" );
const fs = require( "fs" );

function loadHTMLContent( topic_id, callback )
{
    var docs_dir = path.join( __dirname, "src", "docs" );
    var file_path = path.join( docs_dir, topic_id + ".html" );

    fs.readFile( file_path, "utf8", function( err, data )
    {
        if ( err )
        {
            console.log( err );
            callback( "" );

        }
        else
        {
            callback( data );

        }

    } );

}

module.exports = {
    loadHTMLContent: loadHTMLContent
};
