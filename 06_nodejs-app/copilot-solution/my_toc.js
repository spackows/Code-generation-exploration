const path = require( "path" );
const fs = require( "fs" );

function getTOC( callback )
{
    var docs_dir = path.join( __dirname, "src", "docs" );
    fs.readdir( docs_dir, function( err, files )
    {
        if ( err )
        {
            console.log( err );
            callback( [] );
            return;

        }

        var base_names = files.map( function( file )
        {
            return path.parse( file ).name;

        } );

        callback( base_names );

    } );

}

module.exports = {
    getTOC: getTOC
};
