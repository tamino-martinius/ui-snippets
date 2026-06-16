setTimeout(() => {
  document.getElementsByClassName('loading')[0].classList.add('active');
}, 0);

// Mark this side-effect file as a module so its top-level bindings stay scoped.
export {};
