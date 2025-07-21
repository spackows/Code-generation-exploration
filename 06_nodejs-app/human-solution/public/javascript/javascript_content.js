
function loadContent()
{
	var topic_id = document.getElementById( "topic_id_parm" ).value;
	
	$.ajax( { url      : "./content",
              type     : "GET",
              data     : { "topic_id" : topic_id },
              contentType : "application/json",
              dataType : "json",
			  complete : function( result )
                         {
							 var topic_html = ( ( "responseJSON" in result )
											    &&  result["responseJSON"]
											    &&  ( "topic_html" in result["responseJSON"] )
											    &&  result["responseJSON"]["topic_html"] ) ?
											    result["responseJSON"]["topic_html"] :
											    "";
												   
                             populateContent( topic_html );
                                                                                       
                         }
                         
            } );

}


function populateContent( topic_html )
{
	if( !topic_html )
	{
		document.getElementById( "content_div" ).innerHTML = "<h1>Error</h1><p>No HTML returned for the specified topic ID</p>";
		return;
	}
	
	document.getElementById( "content_div" ).innerHTML = topic_html;
	
}


function addShowDetailsButtons()
{
    var query_parameter_arr = document.getElementsByClassName( "query_parameter" );
    
    var btn;
    
    for( var i = 0; i < query_parameter_arr.length; i++ )
    {
        btn = createShowDetailsButton();
        
        insertShowDetailsButtonBefore( btn, query_parameter_arr[i] );
    }
    
}


function createShowDetailsButton()
{
    var btn = document.createElement( "button" );
    btn.className = "show_hide_btn";
    btn.onclick = function( event ){ showHideParameterDetails( this ); };
    btn.title = "Show details like data type and default behavior";
    btn.innerHTML = "&rsaquo;";

    var btn_div = document.createElement( "div" );
    btn_div.appendChild( btn );
    
    return btn_div;
}


function insertShowDetailsButtonBefore( btn, query_parameter )
{
    var query_parameters_li = query_parameter.parentElement;
    
    query_parameters_li.insertBefore( btn, query_parameter );
}


function showHideParameterDetails( btn )
{
    var query_parameters_li = btn.parentElement.parentElement;
    
    var parm_attr_ul = $( query_parameters_li ).find( ".parm_attr_ul" )[ 0 ];
    
    if( "none" == parm_attr_ul.style.display )
    {
        parm_attr_ul.style.display = "block";
        btn.style.rotate = "90deg";
        btn.title = "Hide details like data type and default behavior";
        return;
    }
    
    parm_attr_ul.style.display = "none";
    btn.style.rotate = "0deg";
    btn.title = "Show details like data type and default behavior";
}


function addLanguagePickerButtons()
{
    var curl_btn;
    var node_btn;
    var samples_div     = document.getElementById( "samples_div" );
    var sample_divs_arr = document.getElementsByClassName( "sample_div" );
    for( var i = 0; i < sample_divs_arr.length; i++ )
    {
        curl_btn = createLanguagePickerButton( "CURL" );
        
        node_btn = createLanguagePickerButton( "Node.js" );
        node_btn.style.borderRight = "none";
        
        samples_div.insertBefore( node_btn, sample_divs_arr[i] );
        samples_div.insertBefore( curl_btn, node_btn );
    }        
    
    selectLanguage( "curl" );
    
}


function createLanguagePickerButton( language )
{
    var lang = language.toLowerCase().substr( 0, 4 );
    
    var btn = document.createElement( "button" );
    btn.className = "language_picker_btn lang_" + lang;
    btn.innerHTML = language;
    btn.onclick = function( event ){ selectLanguage( lang ); };
    
    return btn;
    
}


function selectLanguage( lang )
{
    decorateLanguageButtons( lang );
    
    showHideSamples( lang );
}


function decorateLanguageButtons( lang )
{
    var btn_arr = document.getElementsByClassName( "language_picker_btn" );
    
    for( var i = 0; i < btn_arr.length; i++ )
    {
        if( btn_arr[i].className.replace( /^.*\_/, "" ).toLowerCase() == lang )
        {
            btn_arr[i].style.textDecoration = "underline";
            continue;
        }
        
        btn_arr[i].style.textDecoration = "none";
    }

}


function showHideSamples( lang )
{
    var sample_pre_arr = document.getElementsByClassName( "sample_pre" );
    
    for( var i = 0; i < sample_pre_arr.length; i++ )
    {
        if( sample_pre_arr[i].className.replace( /^.*\_/, "" ).toLowerCase() == lang )
        {
            sample_pre_arr[i].style.display = "block";
            continue;
        }
        
        sample_pre_arr[i].style.display = "none";
    }
    
}



