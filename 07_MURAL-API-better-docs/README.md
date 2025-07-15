# 07_MURAL-API-better-docs
Objective: Get better results from Copilot by optimizing the MURAL API docs for that use.

<p>&nbsp;</p>


## Background
In [experiment 05](https://github.com/spackows/Code-generation-exploration/tree/main/05_MURAL-API), Copilot struggled to implement correct calls to the MURAL API and to correctly process returned results.
- Required parameters were missed
- Invalid prameter values were specified
- Fields of returned results were not processed correctly
- Questions about the MURAL API weren't answered correctly either

All of these problems happened despite using the [#fetch feature](https://code.visualstudio.com/docs/copilot/chat/copilot-chat-context#_reference-web-content) to reference the MURAL API documentation.

<p>&nbsp;</p>


## Hypothesis: The MURAL API docs aren't optimized for this use case
Take the documentation for the [widgets endpoint](https://developers.mural.co/public/reference/getmuralwidgets), for example.

When I use [a Python script](scrape-html-sample.py) to scrape that page, not much reference information is returned:
```
# Get widgets for a mural
get https://app.mural.co/api/public/{version}/murals/{muralId}/widgets
Returns all of the widgets for a mural. Does not currently include drawings.
**Authorization scope** : `murals:read`
Language
 __Shell __Node __Ruby __PHP __Python
Credentials
OAuth2
OAuth2
Bearer
URL
Base URL
https://app.mural.co/api/public/v1/murals/{muralId}/widgets
```

_No wonder fetching that file didn't help Copilot generate the correct code!_

<p>&nbsp;</p>


## Solution: Optimize API reference for scraping by LLMs
In [experiment 06](https://github.com/spackows/Code-generation-exploration/blob/main/06_nodejs-app/README.md), a simple doc app was created to host rewritten API refernce information for two MURAL API endpoints: `widgets` and `sticky-note`.

When Copilot is instructed to fetch the API reference from the experiment 06 doc app, Copilot was able to generate the correct code.

Here's a video stepping through the experiment: https://youtu.be/iIhgR9R0q_E

<p>&nbsp;</p>


### What's different about the doc app
<table>
<tr>
<th>Attribute</th>
<th>MURAL API docs</th>
<th>Local doc app</th>
</tr>
<tr>
<td valign="top">Info available</td>
<td valign="top"><p>Basic scraping doesn't return much information.</p><p>I assume the bulk of the content is fetched after the main part of the page loads (very common practice.)</p></td>
<td valign="top"><p>Critical information is avaiable immediately, available to basic scraping.</p></td>
</tr>
<tr>
<td valign="top">Noise</td>
<td valign="top"><p>Header, search, and navigation components - none of which are useful to Copilot in this use case - all overwhelm the small amount of reference information that's available.</p></td>
<td valign="top"><p>Components like the header and navigation are pulled after the page loads, not overwlehming reference information in the scraped content.</p></td>
</tr>
<tr>
<td valign="top">Complete</td>
<td valign="top"><p>In a few cases, details (eg. minimum- and maximum supported values or default behavior) were not explicitly documented.</p></td>
<td valign="top"><p>Everything needed to make valid API calls is included, even if that means some "obvious" details are spelled out and conceptual information (like pagination) is explained at a high level, even with links to learn more.</p></td>
</tr>
<tr>
<td valign="top">Succinct</td>
<td valign="top"><p>Including examples of every kind of error output is redundant because the structure is so similar.  LLMs can "get lost in the middle" (even ones with large context windows.)  So keeping the reference information succinct might mean the difference between the model successfully plucking out relevant details and the model passing those details by.</p></td>
<td valign="top"><p>Sample error output is given only once.</p></td>
</tr>
<tr>
<td valign="top">Concrete</td>
<td valign="top"><p>There were no static code samples in the MURAL API reference topic.  And the dynamic code in the try-it isn't available when scraped.</p></td>
<td valign="top"><p>For humans, a concrete example makes understanding the prose explanations much easier.  For LLMs, a concrete example and give the model a stub from which to riff whatever code generation is needed.</p></td>
</tr>
<tr>
<td valign="top">Format</td>
<td valign="top"><p>It's difficult to say how the information is structured, because it's not available when scraped.</p></td>
<td valign="top"><p>There are collapsed elements providing human readers with progressive disclsure, and some information is presented in a tabular-looking style.   However, that is all done with cascading style sheets.  The underlying HTML elements are very simple: headers, paragraphs, lists, and codeblock.  This means converting the scraped HTML to eays-to-navigate text (or Markdown) is simple.</p></td>
</tr>
</table>

<p>&nbsp;</p>


### Prompts

#### Reading widgets (referencing MURAL API docs)
```
Use the node.js library axios to call the MURAL REST API to read all the widgets in a mural and then print the returned array of widgets. 
Refer to the API reference: 
#fetch https://developers.mural.co/public/reference/getmuralwidgets
```

#### Reading widgets (referencing local doc app)
```
Use the node.js library axios to call the MURAL REST API to read all the widgets in a mural and then print the returned array of widgets. 
Refer to the API reference: 
#fetch http://localhost:8080?topic_id=read-widgets
```

#### Create a widget (referencing MURAL API docs)
```
Use the node.js library axios to call the MURAL REST API to create a sticky note with the text "hello, widget!". 
After the widget is successfully added to the mural, print the ID of the sticky note. 
Refer to the API reference: 
#fetch https://developers.mural.co/public/reference/createstickynote
```

#### Create a widget (referencing local doc app)
```
Use the node.js library axios to call the MURAL REST API to create a sticky note with the text "hello, widget!". 
After the widget is successfully added to the mural, print the ID of the sticky note. 
Refer to the API reference for the expected structure of the response data: 
#fetch http://localhost:8080/?topic_id=create-sticky-note
```

<p>&nbsp;</p>

