REM Sample 2: Create a stylish sticky note in a mural
REM The following curl command calls the MURAL API to create a
REM sticky note in a mural with the identidier <your-mural-id>.
REM The data passed to this API call has all the required 
REM fields: "x", "y", and "shape".  Also, a message in HTML 
REM format is included: "<b>Here</b> is a <u>sticky note</u>".  
REM Finally, the background color and font of the sticky note 
REM appearance are customized.  Everything else about the 
REM sticky note is left to the default behavior.
REM 

curl -H "accept: application/json" 
     -H "content-type: application/json" 
     -H "authorization: bearer <your-auth-token>" 
     "https://app.mural.co/api/public/v1/murals/<your-mural-id>/widgets/sticky-note" 
     --data "{ \"x\" : 200, 
               \"y\" : 110, 
               \"shape\" : \"rectangle\", 
               \"htmlText\" : \"<b>Here</b> is a <u>sticky note</u>\",
               \"style\"    : { \"backgroundColor\" : \"#CCCCFF\",
                                \"font\" : \"blambot-pro\",
                                \"fontSize\" : 50 } }"
