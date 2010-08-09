ASDA Card Login Fix
===================

If you have an ASDA credit card, you may experience problems [logging in to the web site](https://www.santandercards.co.uk/eservice/authentication/asda).  This happens in modern browsers like Safari, Firefox and Chrome.

When a friend showed me this, I took a closer look.  It turns out that there is an error in the JavaScript validation routines.

In order to work around this, I made this chrome extension to disable the validation in use.  Whilst I tried to correct the original error, I was unable to do so because of the way that Chrome isolates extensions from web pages (this is a good thing—please don't get me wrong).

I have little doubt that other similar Santander-hosted credit cards are affected.  However, because of the embedded GUID, you would have to make one of these extensions per-credit-card-type.

Caveat
------

This is my code, which is completely unaffiliated with ASDA, Santander or anybody else.  Use at your own risk.

I encourage you to [read the code](script.js) to understand what it does.

Bug Detail
----------

The bug itself is interesting.  It's a combination of bad JavaScript combined with modern browsers changing assumptions.

The problem starts in [validation.js](https://www.santandercards.co.uk/eservice/content/asda/validation.js).  Here's an extract.

<pre>
var pattern = new Object();

pattern.alpha        = /^[a-zA-Z\/i]+$/;
text.alpha           = " should only contain letters";

pattern.alphanumeric = /^[0-9a-zA-Z\s]+$|^$/;
text.alphanumeric    = " should only contain letters, numbers and space";

function validate(thisform,errorMessages,errorIndex)
{
  // …
  var el = thisform.elements;

  // …

  for(var i=0; i&lt;el.length; i++)
  with(el[i])
	{


    var eldatatype=el[i].datatype;
    var elminlength=el[i].minimumlength;
    var elmaxlength=el[i].maximumlength;
    var elmandatory=el[i].mandatory;
    var eldesc=el[i].description;
    var elminvalue=el[i].minimumvalue;
    var elmaxvalue=el[i].maximumvalue;
    var elleadingzero=el[i].leadingzero;
    if (!eldatatype) continue;
    var elpattern = pattern[eldatatype];
    // …
</pre>

The clear intent in that last line is to access the `pattern` global defined above.  Except that's not what happens.

The `with` statement at the beginning of the loop alters the lookup scope for JavaScript properties to include `el[i]`.  So, all the available properties on that element (including attributes) become available as plain variables.  In HTML5, the `input` element grew [a `pattern` attribute](http://www.w3.org/TR/html5/author/common-input-element-attributes.html#the-pattern-attribute).  So, the code above is *really* accessing the attribute of the input element rather than the global variable it expects to.

The fix is simple: delete the unecessary `with(el[i])` line.  Of course, that's not so easy to do from a sandbox, so I took an alternative route.
