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

When I use [a Python script]() to scrape that page, not much reference information is returned:
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


## Solution: API reference optimized for scraping by LLMs
In [experiment 06](https://github.com/spackows/Code-generation-exploration/blob/main/06_nodejs-app/README.md), a simple doc app was created to host rewritten API refernce information for two MURAL API endpoints: widgets and sticky-note.

When Copilot is instructed to fetch the API reference from that doc app, Copilot was able to generate the correct code.

Here's a video stepping through the experiment: []()

<p>&nbsp;</p>

<p>&nbsp;</p>
