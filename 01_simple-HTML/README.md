# 01_simple-HTML

Objective: A simple, one-page web app with two areas: a menu-like area on the left and a main area to the right. Someone viewing the web page will be able to drag the menu wider or narrower.

<p>&nbsp;</p>


## HTML files

### Human mode
I have created web apps that had these elements before, so I had a bit of a head start:
- I already knew a little trick to do the mouse-drag-menu-resize functionality
- I could copy from an older project and refactor what I needed

HTML file: [index_human.html](index_human.html)

Time: < 1 hour

### LLM mode
I used GitHub Copilot chat in Visual Studio Code.  See: [Getting started with Copilot in VS Code](https://code.visualstudio.com/docs/copilot/getting-started)

I ended up entering three inputs to the chat, accepting the generated code each time.

My chat inputs:
1. Make an html file with a narrow div on the left side, called "left_menu_div" and a main div, called "main_div".
2. Make the divs have a pleasant, spring color palette
3. Add Javascript so a user can drag the edge of the left_menu_div to make that div wider and the main_div narrower

Generated HTML file: [index_copilot.html](index_copilot.html)

Time: < 15 min

<p>&nbsp;</p>


## Analysis, remarks

### Things I had to look up
Even though I had done something like this before, I forgot a few things or had to look some things up:
- To choose a palette, I used this web page: https://coolors.co/palettes/trending
- I couldn't remember which cursor style to use, so I looked up the information here: https://www.w3schools.com/cssref/pr_class_cursor.php

### Ways the generated solution was better than the human one

1. **Page title**

   I also didn't bother to add a title to the page, but the generated page had a title.  A different sample will dive into this kind of issue and accessibility.

2. **Dragging when the mouse leaves the page**

   To track the mouse as users drag the width of the menu div, I set an event listener for `mousemove` and `mouseup` on the `body` element:
   ```
   document.body.addEventListener( "mousemove", trackMouse );
   document.body.addEventListener( "mouseup", stopResizing );
   ```
   As a result, when the mouse left the page, dragging stopped and the width stopped changing.
  
   But the generated solution added those listeners onto the document:
   ```
   document.addEventListener( "mousemove", trackMouse );
   document.addEventListener( "mouseup", stopResizing );
   ```
   With this implementation, the dragging continued to work even when the mouse leaves the page, which was a nicer user experience.

### Problems with the generated solution

1. **Body overflow**

   The

2. **Menu div doesn't go all the way to the bottom**

   The 

3. **Min and max menu div width**
   
   The 

### Differences in the generated solution that could be problems

1. **Drag implementation**

   The

2. **Unneeded, extra code**
   
   The

3. **Formatting**

   The



