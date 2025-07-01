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

<p>&nbsp;</p>

