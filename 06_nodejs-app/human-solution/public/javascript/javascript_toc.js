
function loadTOC()
{
	$.ajax( { url      : "./toc",
              type     : "GET",
              dataType : "json",
			  complete : function( result )
                         {
							 var topic_ids_arr = ( ( "responseJSON" in result )
												   &&  result["responseJSON"]
											       &&  ( "topic_ids_arr" in result["responseJSON"] )
											       &&  result["responseJSON"]["topic_ids_arr"]
											       &&  Array.isArray( result["responseJSON"]["topic_ids_arr"] ) ) ?
											       result["responseJSON"]["topic_ids_arr"] :
												   [];
												   
                             populateTOC( topic_ids_arr );
                                                                                       
                         }
                         
            } );

}


function populateTOC( topic_ids_arr )
{
	if( topic_ids_arr.length < 1 )
	{
        document.getElementsByTagName( "nav" )[0].innerHTML = "<p>No topics to display</p>";
		return;
	}
	
	var html = "<ul>";
	var topic_id = "";
	for( var i = 0; i < topic_ids_arr.length; i++ )
	{
		topic_id = topic_ids_arr[i].toString().replace( /[^a-z0-9\-\_]/ig, "" );
		html += "<li><a href='./?topic_id=" + topic_id + "'>" + topic_id + "</a></li>";
	}
	html += "</ul>";
	
    document.getElementsByTagName( "nav" )[0].innerHTML = html;
}



