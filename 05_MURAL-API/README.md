# 05_MURAL-API
Objective: Create a node.js script that uses the [MURAL REST API](https://developers.mural.co/public/reference/intro) to read a mural and add a sticky note to a mural

\*This experiment requires using the \#fetch feature in VS Code to include the MURAL API reference documentation in prompts.  
See: [Reference web content](https://code.visualstudio.com/docs/copilot/chat/copilot-chat-context#_reference-web-content)

<p>&nbsp;</p>


## Read a mural
The first script simply reads the contents of a mural.

API endpoint: https://developers.mural.co/public/reference/getmuralwidgets

### Human solution
[05_read-widgets_human.js](05_read-widgets_human.js)

### Copilot solution
Here's a video walking through the evolution of the solution:<br/>
https://youtu.be/_khh8WLnMHQ

Prompts:
1. ```
   Create a node.js function that uses the MURAL REST API to read all the widgets in a mural.
   The function must have the following properties:
   - Function name: readWidgets
   - The only parameter is "callback", a callback function that takes two parameters: an error message
   (if there is one) and an array of widget JSON objects
   ```
2. ```
   Call the function readWidgets and print the array of widget JSON objects
   ```
3. ```
   This implementation prints an empty array even though I know there are widgets in the mural
   ```
4. ```
   In this implementation, the variable json correctly contains the data returned by the MURAL API.
   However, subsequent processing does not extract the array of widgets correctly. Refer to the API
   refernce for the expected structure of the response data:
   #fetch https://developers.mural.co/public/reference/getmuralwidgets
   ```
5. ```
   This implementation is not processing the response data correctly to extract the array of widget JSON objects.
   Here is sample response data:
   {
      "value": [
         {
            "id": "0-1619509853818",
            "height": 150,
            "width": 140,
            "x": 20,
            "y": 148,
            ...
         },
         ...
      ]
   }
   ```
Iterations:
- [05_read-widgets_copilot_01.js](05_read-widgets_copilot_01)
- [05_read-widgets_copilot_02.js](05_read-widgets_copilot_02)
- [05_read-widgets_copilot_03.js](05_read-widgets_copilot_03)
- [05_read-widgets_copilot_04.js](05_read-widgets_copilot_04)

<p>&nbsp;</p>


## Add a sticky note to a mural
The second script creates a new sticky note in a mural.

API endpoint: https://developers.mural.co/public/reference/createstickynote

### Human solution
[05_add-sticky-note_human.js](05_add-sticky-note_human.js)

### Copilot solution
[05_add-sticky-note_copilot.js](05_add-sticky-note_copilot.js)

Here's a video walking through the evolution of the solution:<br/>
https://youtu.be/dieHEqN8fbs

Prompts:
1. ```
   Create a node.js function, called addSticky, that uses the MURAL API to add a sticky note to a mural. The function should have the following parameters:
   - Parameter 1: "x" the x-position of the new sticky note
   - Parameter 2: "y" the y-position of the new sticky note
   - Parameter 3: "txt" the text to put in the sticky note
   The ID of the mural should be in a global variable, called g_mural_id.
   ```
2. ```
   When the sticky note is successfully added, print the ID of the new sticky note
   ```
3. ```
   Is the workspace_id in the header mandatory?
   ```
4. ```
   Why is the workspace_id included in the header?
   ```
5. ```
   Remove workspace_id from the implementation
   ```
6. ```
   Make the API token a global variable
   ```
7. ```
   Call addSticky to place a new sticky note
   ```
8. ```
   Are you certain the url is correct?
   ```
9. ```
   The url is not correct. Use the API documentation for reference to correct
   it #fetch https://developers.mural.co/public/reference/createstickynote
   ```
10. ```
    The endpoint of the url is not correct. Read the API reference to correct
    the endpoint #fetch https://developers.mural.co/public/reference/createstickynote
    ```
11. ```
    The data payload is invalid. Refer to the API reference to include only the
    required fields. #fetch https://developers.mural.co/public/reference/createstickynote
    ```
12. ```
    Are you certain text is a required field? #fetch https://developers.mural.co/public/reference/createstickynote
    ```
13. ```
    Is the "shape" field required?
    ```
14. ```
    You are incorrect. The "shape" field is required. #fetch https://developers.mural.co/public/reference/createstickynote
    ```
15. ```
    What are the two supported values for the "shape" field? #fetch https://developers.mural.co/public/reference/createstickynote
    ```
16. ```
    No, "square" is not a supported value for the "shape" field. Read the API reference again.
    What are the two supported values for the "shape" field? #fetch https://developers.mural.co/public/reference/createstickynote
    ```
17. ```
    The supported values of the "shape" field are: "circle" and "rectangle"
    ```
18. ```
    When the sticky note is successfully added, print only the sticky note id (not the full response)
    ```
19. ```
    "id" is not a field in response.data. Look up the response format in the API
    reference and then correct the implementation to print the sticky note id.
    #fetch https://developers.mural.co/public/reference/createstickynote
    ```
20. ```
    There is no "widgets" field in the response.data. Update the code to print the new sticky note ID, which is returned in the response. Here's a sample response:
    {
       "value": [
          {
             "id": "0-1619509853818",
             "height": 150,
             "width": 140,
             "x": 20,
             "y": 148,
             ...
          },
          ...
       ]
    }
    ```

<p>&nbsp;</p>


## Analysis, remarks

### Initial results surprisingly good

### Yay, in-context learning!

### Asking questions vs giving instructions

### Hallucinations

### Reference information not available to Copilot

### Out-of-date refernce information

<p>&nbsp;</p>

