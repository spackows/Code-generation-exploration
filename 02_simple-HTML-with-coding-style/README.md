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

Video: *working...*

<p>&nbsp;</p>


## Analysis, remarks

Frustration: No way to specify random seed or temperature, etc.

### Ways the generated solution was better than the human one

### Problems with the generated solution

### Differences in the generated solution that could be problems


