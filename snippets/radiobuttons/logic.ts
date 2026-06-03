const $inputs = document.getElementsByClassName('input');
for (let inputIndex = $inputs.length - 1; inputIndex >= 0; inputIndex--) {
  const $input = $inputs[inputIndex];
  // ...
}
const $radiobuttons = document.getElementsByClassName('input--radio');
for (let radioIndex = $radiobuttons.length - 1; radioIndex >= 0; radioIndex--) {
  const $radio = $radiobuttons[radioIndex];
  // ...
}
setTimeout(() => { /* TODO: prevent this timeout */
  const $preloadElements = document.getElementsByClassName('preload');
  for (let preloadIndex = $preloadElements.length - 1; preloadIndex >= 0; preloadIndex--) {
    const $preload = $preloadElements[preloadIndex];
    $preload.classList.remove('preload');
  }
}, 500);

