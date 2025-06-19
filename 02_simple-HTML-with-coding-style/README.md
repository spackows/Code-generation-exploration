# 02_simple-HTML-with-coding-style

Objective: A simple, one-page web app with a menu-like area on the left and a main area to the right. Someone viewing the web page can drag the menu wider or narrower.

\*This time, coding style guidelines were provided to Copilot.

<p>&nbsp;</p>


## HTML files

### Human mode
I have created web apps that had these elements before, so I had a bit of a head start:
- I already knew a little trick to do the mouse-drag-menu-resize functionality
- I could copy from an older project and refactor what I needed

HTML file: [index_human.html](index_human.html)

Time: < 1 hour

### LLM mode
I used GitHub Copilot chat in Visual Studio Code, with the default model, GPT-4.1.

I specified coding style guidelines in an instructions file: [instructions.md](instructions.md.txt)

See: [Customize AI code generation](https://code.visualstudio.com/docs/copilot/reference/copilot-vscode-features#_customize-ai-code-generation)

I entered three inputs to the chat, accepting the generated code each time.

My chat inputs:
1. Make an html file with a narrow div on the left side, called "left_menu_div" and a main div, called "main_div".
2. Make the divs have a pleasant, spring color palette
3. Add Javascript so a user can drag the edge of the `left_menu_div` to make that div wider and the main_div narrower

Generated HTML file: [index_copilot.html](index_copilot.html)

**Note:** I had to experiment with the instructions file to get the generated output close to the format I wanted.  That took some time.  But that cost would be a one-time cost.  Future projects could use the same `instructions.md` file.

Time: < 1 hour

<p>&nbsp;</p>


## Testing
The HTML files (human and generated) were tested in Firefox.

Video: https://youtu.be/_236XnktxOU

<img src="images/02_simple-HTML-with-coding-style.png" width="600" />

<p>&nbsp;</p>


## Analysis, remarks

### Coding style applied correctly
The coding style specified in the `instructions.md` file were followed correctly.  Nice.

### Naming the coding style instructions file UX problem
The way VS Code handles naming the instructions file is awkward:<br/>
https://youtu.be/ey8TUmNx8VE

In a nutshell: VS Code appends "instructions.md" to the end of the name you specify.  So I have files named `instructions.md.instructions.md`, for example.

### Feature gaps of Copilot in VS Code
- **Parameters obscured** - As far as I can tell, there's no way to specify the decoding method, random seed, temperature, etc.  This makes it impossible to systematically test different prompts and instruction files, and it makes it impossible to reproduce results.  For a production solution, where liability, privacy, and security matter, I can't imagine anyone accepting these shortcomings.
- **Poor logging support** - With generative AI projects, it's important to be able to show your work.  That means collecting logs.  But in VS Code, you have to jump through a few hoops to grab the logs. (See: [Chat history](https://code.visualstudio.com/docs/copilot/chat/copilot-chat#_chat-history)) Also, there are some gaps in what's collected.  For example, nowhere in the logs can I see which model is being used (eg. GPT-4.1 or whatever.)  Complete prompting logs should be automatically saved to your project directory (or to a location you specify.)

### Problems with the generated solution

1. **Unwanted text**

   I didn't specify any text in the HTML, but the generated solution added some.
   
2. **Drag implementation**

   The AI-generated solution used the same basic technique asn my solution to achieve dragging the width: using a dragging div, tracking the mouse movements, and then adjusting the width of the `left_menu_div`.  One minor difference is that the resizing div, `left_menu_resizer`, is inside `left_menu_div`.

   However, a significant difference is that the generated solution sets the width of the `left_menu_div` using a convoluted approach involving variables `g_start_x` and `g_start_width`:
   ```<script>
   var g_is_resizing = false;
   var g_start_x = 0;
   var g_start_width = 0;
   
   document.getElementById( "left_menu_resizer" ).addEventListener( "mousedown", function( e )
   {
       g_is_resizing = true;
       g_start_x = e.clientX;
       g_start_width = document.getElementById( "left_menu_div" ).offsetWidth;
       document.body.style.cursor = "ew-resize";
   
   } );
   
   document.addEventListener( "mousemove", function( e )
   {
       if ( g_is_resizing )
       {
           var new_width = g_start_width + ( e.clientX - g_start_x );
   ```
   In 01_simple-HTML, the AI-generated implementation was fine, even though it was different from the human-written one.  But the AI-generated implementation for 02_simple-HTML-with-coding-style is so bad it causes a bad user experience.
   
4. **Body overflow**

   In the generated solution, there is an unnecessary scroll bar on the body for some reason.

5. **Menu div doesn't go all the way to the bottom**

   When you scroll that scroll bar down, you can see the `left_menu_div` has no pants! (It's cut off.)
   
### Differences in the generated solution that could be problems

1. **Min and max menu div width**
   
   For some reason, in the generated solution, there is a minimum and maximum width set for the `left_menu_div`.  I didn't ask for that in my prompts.  Some might consider this a feature that's obviously needed.  But it's a significant user experience element that I didn't ask for, so I'm considering it a form of hallucination.

2. **Unneeded, extra code**
   
   In the style area, there are style details that add no value and that are sometimes bizarre. In the HTML, there is unnecessary text.  And in the Javascript, there are lines of unnecessary code.  Some might argue it doesn't matter.  But those extra pieces make merges just a bit more complex, they need to be maintained, and that must be understood by someone joining the project.


