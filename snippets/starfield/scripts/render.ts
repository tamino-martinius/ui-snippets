// If you don't need HMR:
// Modify the Boilerplate at public/index.html
// and require style and body directly

// Load style
import '../src/index.css'

// Render HTML body
const body = require('../src/index.html');
document.body.innerHTML = body;
