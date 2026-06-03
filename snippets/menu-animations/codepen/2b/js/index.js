var input = document.getElementsByTagName('input')[0];
var label = document.getElementsByTagName('label')[0];
var autoToggle = setInterval(function () {
  input.checked = !input.checked;
}, 3000);
label.onclick = function (e) {return clearInterval(autoToggle);};
input.checked = !input.checked;

var settings = {
  debug: false };


var gui = new dat.GUI();
gui.add(settings, 'debug').onChange(function () {
  if (settings.debug) {
    document.body.classList.add('enable-debug');
    document.all.icon.viewBox.baseVal.y = 0;
    document.all.icon.viewBox.baseVal.width = 128;
    document.all.icon.viewBox.baseVal.height = 64;
  } else {
    document.body.classList.remove('enable-debug');
    document.all.icon.viewBox.baseVal.y = 16;
    document.all.icon.viewBox.baseVal.width = 32;
    document.all.icon.viewBox.baseVal.height = 32;
  }
});
gui.close();