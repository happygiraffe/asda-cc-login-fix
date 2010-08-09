/*
 * So, the muppets that wrote this website didn't see HTML5 coming.  They
 * rely on a global variable called "pattern".  They then use
 * (unnecessarily) the with statement to bring the context of an element
 * into scope.  When that element happens to be a password field, it's
 * already got a pattern attribute.
 * http://www.w3.org/TR/html5/author/common-input-element-attributes.html#the-pattern-attribute
 *
 * Where's the "file bug" link on the web site?  I don't see it.
 */

// A version of the loginSubmit() function without any validation.
// Unfortunately, because I can't replace any portion of the page's
// JavaScript environment, only bits of the DOM, I have to copy&paste
// bits of the original source to make this version.
function nonValidatingLogin() {
  var accountTextBox = document.getElementById("accountNumber");  
  var accountValue = accountTextBox.value.replace(/[\s-]/g, '');

  var signInForm = document.getElementById("signInForm");     
  signInForm.j_username.value = accountValue + ":" +
      '858bf8e0-43e4-47ca-b44e-e8459e1fc903' + ":" + 'asda'; 
  signInForm.action = "j_security_check";
  signInForm.method = "post";

  // console.log('j_username=%s', signInForm.j_username.value);
  // console.log('signInForm=%o', signInForm);

  signInForm.submit();
  return false;
}

var submitLink = document.getElementById('Image2').parentNode;
var expected = 'loginSubmit();return false;';
if (submitLink.getAttribute('onclick') === expected) {
  submitLink.removeAttribute('onclick');
  submitLink.addEventListener('click', nonValidatingLogin, false);
  document.getElementById('serversideError').innerHTML =
      '<div style="background-color:yellow">Validation disabled by Dominic.</div>';
}
