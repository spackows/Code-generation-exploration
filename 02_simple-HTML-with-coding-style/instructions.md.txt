---
applyTo: '**'
---

# Custom instructions for Copilot

## Project context
This project is a simple web page with css, HTML, and Javascript in one file.

## Indentation
- Style elements are not indented.
- HTML elements are not indented.
- JavaScript code is not indented at the first level, but nested elements should be indented with 4 spaces.

## Coding style for naming
- Use snake_case for variable names.
- Use camelCase for functions names.
- Use snake_case for HTML element IDs.
- Use snake_case for CSS class names.
- Use snake_case for CSS IDs.
- Global Javascript variable names begin with "g_".

## Coding style for braces
- Curly braces must align vertically at the first column for styling css, like this:
#div_name
{
margin: 0;
}
- Curly braces must align vertically at the first column for Javascript.

## Coding style for functions
- Include an empty line at the end of each function, like this:
function myFunction()
{
    var x = 0;

}
and this:
div.addEventListener( "click", function()
{
    console.log( "Clicked!" );

} );
- Sparate parameters with a single space, like this:
function myFunction( parm1, parm2 )
{
    var x = 0;

}
and this:
document.getElementById( "myElement" ).style.color = "red";

## General coding style
- Use double quotes for everything.
