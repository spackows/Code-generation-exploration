// Add your JavaScript code here
var g_header_title = "Pretend MURAL API documentation";

function setHeaderTitle()
{
    document.getElementById( "header_title" ).textContent = g_header_title;

}

function populateTOC( toc_arr )
{
    var nav_ul = document.querySelector( "nav ul" );
    if ( nav_ul )
    {
        nav_ul.innerHTML = "";

        toc_arr.forEach( function( topic_id )
        {
            var li = document.createElement( "li" );
            var a = document.createElement( "a" );
            a.href = "/?topic_id=" + encodeURIComponent( topic_id );
            a.textContent = topic_id;
            li.appendChild( a );
            nav_ul.appendChild( li );

        } );

    }

}

function loadTOC()
{
    $.ajax(
    {
        url: "/toc",
        method: "GET",
        dataType: "json",
        success: function( toc_arr )
        {
            populateTOC( toc_arr );

        }

    } );

}

window.addEventListener( "DOMContentLoaded", function()
{
    setHeaderTitle();
    loadTOC();

} );
