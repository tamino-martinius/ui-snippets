// Vite entry for the snippet. Mirrors the old scripts/render.ts contract:
// load styles, inject the snippet markup, then run the snippet's logic.
import './style.css';
import body from './body.html?raw';

document.body.innerHTML = body;

// Imported after the markup is in the DOM, since the logic queries elements.
import('./logic');
