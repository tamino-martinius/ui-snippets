const $inputs = document.getElementsByClassName('input');
for (let inputIndex = $inputs.length - 1; inputIndex >= 0; inputIndex--) {
  const $input = $inputs[inputIndex];
  // ...
}
const $checkboxes = document.getElementsByClassName('input--checkbox');
for (let checkboxIndex = $checkboxes.length - 1; checkboxIndex >= 0; checkboxIndex--) {
  const $checkbox = $checkboxes[checkboxIndex];
  // ...
}
setTimeout(() => { /* TODO: prevent this timeout */
  const $preloadElements = document.getElementsByClassName('preload');
  for (let preloadIndex = $preloadElements.length - 1; preloadIndex >= 0; preloadIndex--) {
    const $preload = $preloadElements[preloadIndex];
    $preload.classList.remove('preload');
  }
}, 500);

