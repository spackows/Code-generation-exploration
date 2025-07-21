
const g_express    = require( "express"    );
const g_underscore = require( "underscore" );

const g_toc     = require( "./my_toc.js"     );
const g_content = require( "./my_content.js" );
const g_samples = require( "./my_samples.js" );

var g_app = g_express();
g_app.use( g_express.static( __dirname + "/public" ) );
g_app.set( "view engine", "ejs" );


const PORT = 8080;
g_app.listen( 8080, function()
{
    console.log( "[server] Server running" );

} );

const g_default_topic_id = "read-widgets";


g_app.get( '/', function( request, response )
{
    //console.log( "[server] / ..." );
    //console.log( "[server] / query:\n"   + JSON.stringify( request.query,   null, 3 ) );
    
    var topic_id = ( request && request.query && request.query.topic_id ) ? request.query.topic_id.toString() : "";

	if( !g_content.validTopicID( topic_id ) )
	{
		topic_id = g_default_topic_id;
	}
    
    var topic_html  = "";
    var samples_html = "";
    
    var taskComplete = g_underscore.after( 2, function()
    {
        response.render( "pages/main", { "topic_html" : topic_html, "samples_html" : samples_html } ); 
        
    } );
    
	g_content.loadHTMLContent( topic_id, function( result )
    {
       topic_html = result;
       taskComplete();
		
    } );
    
    g_samples.loadSampleContent( topic_id, function( result )
    {
        samples_html = result;
        taskComplete();
        
    } );
	
} );


g_app.get( '/toc', function( request, response )
{
    //console.log( "[server] /toc ..." );
    //console.log( "[server] /toc query:\n" + JSON.stringify( request.query,   null, 3 ) );
    
    var topic_id = ( request && request.query && request.query.topic_id ) ? request.query.topic_id.toString() : "";
	
	g_toc.loadTOC( function( topic_ids_arr )
    {
		response.status( 200 ).send( { "topic_ids_arr" : topic_ids_arr } );
		
    } );
    
} );




