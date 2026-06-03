const input = document.getElementsByTagName('input')[0];
const label = document.getElementsByTagName('label')[0];
const autoToggle = setInterval(() => {
  input.checked = !input.checked;
}, 3000);
label.onclick = (e) => clearInterval(autoToggle);
input.checked = !input.checked;

const settings = {
  debug: false,
};

const gui = new dat.GUI();
gui.add(settings, 'debug').onChange(function() {
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