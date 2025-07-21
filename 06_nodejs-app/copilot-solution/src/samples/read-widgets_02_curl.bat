REM Sample 2: Print only the first 5 widgets of type sticky notes or text
REM The following curl command calls the MURAL API to read the first 
REM 5 widgets of type "sticky note" or "text" in a mural with the 
REM identidier <your-mural-id>.
REM 

curl -H "accept: application/json" 
     -H "authorization: bearer <your-auth-token>" 
     "https://app.mural.co/api/public/v1/murals/<your-mural-id>/widgets?type=\"sticky notes,texts\"&limit=5"
