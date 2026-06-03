const input = document.getElementsByTagName('input')[0];
const label = document.getElementsByTagName('label')[0];
const blur = document.all.gooey.children[0]

// auto toggle until manual interaction
const autoToggle = setInterval(() => {
  input.checked = !input.checked;
}, 3000);
input.onchange = (e) => (settings.open = input.checked);
label.onclick = (e) => clearInterval(autoToggle);

// adjust values
const settings = {
  debug: false,
  outerTime: 1000,
  middleTime: 750,
  transitionTime: 750,
  strokeSize: 3.5,
  gooeySize: 2,
};

const applyChanges = function() {
  if (settings.debug) {
    document.body.classList.add('enable-debug');
  } else {
    document.body.classList.remove('enable-debug');
  }
  const paths = document.getElementsByTagName('path');
  for (const path of paths) {
    path.style.transitionDuration = '0ms';
    path.style.strokeWidth = settings.strokeSize + 'px';
  }
  blur.setStdDeviation(settings.gooeySize, settings.gooeySize);
  setTimeout(() => {
    for (const path of document.getElementsByTagName('path')) {
      path.style.transitionDuration = settings.outerTime + 'ms, ' + settings.transitionTime + 'ms';
    }
    document.all.middle.style.transitionDuration = settings.middleTime + 'ms';
  }, 0);
};

var gui = new dat.GUI();
gui.add(settings, "debug").onChange(applyChanges);
gui.add(settings, "outerTime", 50, 2000, 1).onChange(applyChanges);
gui.add(settings, "middleTime", 50, 2000, 1).onChange(applyChanges);
gui.add(settings, "transitionTime", 50, 2000, 1).onChange(applyChanges);
gui.add(settings, "strokeSize", 0.5, 5, 0.1).onChange(applyChanges);
gui.add(settings, "gooeySize", 1, 10, 0.1).onChange(applyChanges);

gui.close();
