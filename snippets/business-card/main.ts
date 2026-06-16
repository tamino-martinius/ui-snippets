import './style.css';
import body from './body.html?raw';

document.body.innerHTML = body;

// Imported after the markup is in the DOM, since the logic queries elements.
import('./logic');
