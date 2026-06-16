Array.from(document.getElementsByTagName('path')).forEach((path) => {
  console.log(path.getTotalLength());
  const debugPath: HTMLElement = <any>path.cloneNode();
  debugPath.classList.add('line--debug');
  if (path.parentNode) path.parentNode.insertBefore(debugPath.cloneNode(), path);
});
const debugCheckbox: HTMLInputElement = <any>document.getElementById('debug');
debugCheckbox.addEventListener('change', () => {
  if (debugCheckbox.parentElement) {
    if (debugCheckbox.checked) {
      debugCheckbox.parentElement.classList.add('active');
    } else {
      debugCheckbox.parentElement.classList.remove('active');
    }
  }
});
const toggleCheckbox: HTMLInputElement = <any>document.getElementById('menu-or-dots');
toggleCheckbox.addEventListener('click', () => {
  console.log('x');

  if (toggleCheckbox.classList.contains('menu')) {
    Array.from(document.getElementsByClassName('menu')).forEach((elem) => {
      elem.classList.remove('menu');
      elem.classList.add('dots');
    });
  } else {
    Array.from(document.getElementsByClassName('dots')).forEach((elem) => {
      elem.classList.remove('dots');
      elem.classList.add('menu');
    });
  }
});
let currentActive = 0;
const checkboxes: HTMLInputElement[] = <any>document.querySelectorAll('.grid input');
const autoShow = setInterval(() => {
  checkboxes[currentActive % 4].checked = !checkboxes[currentActive % 4].checked;
  if (!checkboxes[currentActive % 4].checked) currentActive += 1;
}, 1000);
const grid = document.querySelector('.grid');
if (grid) {
  grid.addEventListener('click', () => {
    clearInterval(autoShow);
  });
}

// Mark this side-effect file as a module so its top-level bindings stay scoped.
export {};
