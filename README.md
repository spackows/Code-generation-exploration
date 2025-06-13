# Code generation exploration
A dive into using large language models (LLMs) to generate code.

Using little projects to explore issues:
- How much time is saved by using LLMs?
- What mistakes do LLMs make?
- What type of work do LLMs do well?

<p>&nbsp;</p>


## Projects
<table>
<tr>
<th>Project</th>
<th>AI tools</th>
<th>Notes</th>
</tr>
<tr><!-- 01_simple-HTML -->
<td valign="top">
<p><a href="01_simple-HTML/README.md">01_simple-HTML</a></p>
<img src="01_simple-HTML/images/01_simple-HTML.gif" width="200" alt="Example">
</td>
<td valign="top">
<p><b>GitHub Copilot</b></p>
<ul>
<li>In Visual Studio Code</li>
<li>Chat "Ask" mode</li>
<li>Default model, GPT-4.1</li>
<li>See: <a href="https://code.visualstudio.com/docs/copilot/getting-started">Getting started with Copilot in VS Code</a></li>
</ul>
</td>
<td valign="top">
<p>A simple web page with a menu-like area on the left and a main area to the right. 
Users can drag the menu wider or narrower.</p>
<ul>
<li>There's a bit of a trick to the menu resize functionality</li>
<li>UX style choices include colors and mouse pointer</li>
<li>Coding style choices include formating, naming conventions</li>
<li>Architectural choices include HTML elements, how to break up JavaScript functionality</li>
</ul>
</td>
</tr>
<tr><!-- 02_simple-HTML-with-coding-style -->
<td valign="top">
<p><a href="02_simple-HTML-with-coding-style/README.md">02_simple-HTML-with-coding-style</a></p>
<img src="02_simple-HTML-with-coding-style/images/02_simple-HTML-with-coding-style.png" width="200" alt="Example">
</td>
<td valign="top">
<p>Same as above</p>
</td>
<td valign="top">
<p>Same, simple web page as <code>01_simple-HTML</code>.  Same three prompts.</p>
<p>But this time, coding style is specified in an <code>instructions.md</code> file. See: <a href="https://code.visualstudio.com/docs/copilot/reference/copilot-vscode-features#_customize-ai-code-generation">Customize AI code generation</a></p>
<p>The HTML page content and user experience need to be correct, as before. <b>AND</b> the coding style of the CSS, HTML, and Javascript must conform to the instructions.</p>
</td>
</tr>
</table>
