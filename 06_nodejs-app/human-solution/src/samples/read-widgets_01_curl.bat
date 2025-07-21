REM Sample 1: Print all widgets in a mural
REM The following curl command calls the MURAL API to read all 
REM widgets in a mural with the identidier <your-mural-id>.
REM 

curl -H "accept: application/json" 
     -H "authorization: bearer <your-auth-token>" 
     "https://app.mural.co/api/public/v1/murals/<your-mural-id>/widgets"
