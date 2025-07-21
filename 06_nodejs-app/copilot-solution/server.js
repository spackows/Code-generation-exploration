const express = require( "express" );
const path = require( "path" );
const fs = require( "fs" );

const app = express();

const g_default_topic_id = "read-widgets";

const { loadHTMLContent } = require( "./my_content.js" );
const { loadSampleContent } = require( "./my_samples.js" );
const { getTOC } = require( "./my_toc.js" );

app.set( "view engine", "ejs" );
app.set( "views", path.join( __dirname, "views" ) );

app.use( express.static( path.join( __dirname, "public" ) ) );

app.get( "/", function( req, res )
{
    var topic_id = req.query.topic_id;

    if ( !topic_id )
    {
        topic_id = g_default_topic_id;

    }

    loadHTMLContent( topic_id, function( article_html )
    {
        loadSampleContent( topic_id, function( sample_html )
        {
            res.render( "main", {
                article_html: article_html + sample_html
            } );

        } );

    } );

} );

app.get( "/toc", function( req, res )
{
    getTOC( function( base_names )
    {
        res.json( base_names );

    } );

} );

const PORT = 8080;
app.listen( PORT, function()
{
    console.log( "Server running on port " + PORT );

} );
