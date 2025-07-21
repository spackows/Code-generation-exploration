REM Sample 1: Create a simple sticky note in a mural
REM The following curl command calls the MURAL API to create a
REM simple sticky note in a mural with the identidier <your-mural-id>.
REM The data passed to this API call has all the required fields:
REM "x", "y", and "shape".  The message "Here is a sticky note" is 
REM also included in plain text.  Everything else about the sticky 
REM note is left to the default behavior.
REM 

curl -H "accept: application/json" 
     -H "content-type: application/json" 
     -H "authorization: bearer <your-auth-token>" 
     "https://app.mural.co/api/public/v1/murals/<your-mural-id>/widgets/sticky-note" 
     --data "{ \"x\"     : 120, 
               \"y\"     : 80, 
               \"shape\" : \"rectangle\", 
               \"text\"  : \"Here is a sticky note\" }"
