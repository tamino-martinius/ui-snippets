var input = document.getElementsByTagName('input')[0];
var label = document.getElementsByTagName('label')[0];
var blur = document.all.gooey.children[0];

// auto toggle until manual interaction
var autoToggle = setInterval(function () {
  input.checked = !input.checked;
}, 3000);
input.onchange = function (e) {return settings.open = input.checked;};
label.onclick = function (e) {return clearInterval(autoToggle);};

// adjust values
var settings = {
  debug: false,
  outerTime: 1000,
  middleTime: 750,
  transitionTime: 750,
  strokeSize: 3.5,
  gooeySize: 2 };


var applyChanges = function applyChanges() {
  if (settings.debug) {
    document.body.classList.add('enable-debug');
  } else {
    document.body.classList.remove('enable-debug');
  }
  var paths = document.getElementsByTagName('path');var _iteratorNormalCompletion = true;var _didIteratorError = false;var _iteratorError = undefined;try {
    for (var _iterator = paths[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {var path = _step.value;
      path.style.transitionDuration = '0ms';
      path.style.strokeWidth = settings.strokeSize + 'px';
    }} catch (err) {_didIteratorError = true;_iteratorError = err;} finally {try {if (!_iteratorNormalCompletion && _iterator.return) {_iterator.return();}} finally {if (_didIteratorError) {throw _iteratorError;}}}
  blur.setStdDeviation(settings.gooeySize, settings.gooeySize);
  setTimeout(function () {var _iteratorNormalCompletion2 = true;var _didIteratorError2 = false;var _iteratorError2 = undefined;try {
      for (var _iterator2 = document.getElementsByTagName('path')[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {var path = _step2.value;
        path.style.transitionDuration = settings.outerTime + 'ms, ' + settings.transitionTime + 'ms';
      }} catch (err) {_didIteratorError2 = true;_iteratorError2 = err;} finally {try {if (!_iteratorNormalCompletion2 && _iterator2.return) {_iterator2.return();}} finally {if (_didIteratorError2) {throw _iteratorError2;}}}
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