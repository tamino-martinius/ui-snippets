import './style.css';
import { type Snippet, snippets } from './snippets';

// Vite fingerprints + copies every preview it can resolve at build time.
const previewModules = import.meta.glob('../snippets/*/preview.gif', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

const base = import.meta.env.BASE_URL;

function previewFor(slug: string): string | undefined {
  const match = Object.keys(previewModules).find((path) =>
    path.includes(`/snippets/${slug}/preview.gif`),
  );
  return match ? previewModules[match] : undefined;
}

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Record<string, string> = {},
  ...children: (Node | string)[]
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value);
  for (const child of children) {
    node.append(typeof child === 'string' ? document.createTextNode(child) : child);
  }
  return node;
}

function card(snippet: Snippet): HTMLElement {
  const href = `${base}snippets/${snippet.slug}/`;
  const preview = previewFor(snippet.slug);

  const media = el('div', { class: 'card__media' });
  if (preview) {
    media.append(el('img', { src: preview, alt: snippet.title, loading: 'lazy' }));
  } else {
    media.classList.add('card__media--empty');
    media.append(el('span', {}, 'Live demo'));
  }

  return el(
    'a',
    { class: 'card', href },
    media,
    el(
      'div',
      { class: 'card__body' },
      el('h2', { class: 'card__title' }, snippet.title),
      el('p', { class: 'card__desc' }, snippet.description),
    ),
  );
}

const app = el('div', { class: 'page' });

app.append(
  el(
    'header',
    { class: 'masthead' },
    el('h1', {}, 'UI Snippets'),
    el(
      'p',
      { class: 'masthead__sub' },
      'A collection of small, self-contained UI experiments — pure CSS & TypeScript.',
    ),
    el(
      'a',
      { class: 'masthead__repo', href: 'https://github.com/tamino-martinius/ui-snippets' },
      'View source on GitHub →',
    ),
  ),
);

const grid = el('main', { class: 'grid' });
for (const snippet of snippets) grid.append(card(snippet));
app.append(grid);

app.append(
  el(
    'footer',
    { class: 'foot' },
    el('span', {}, `© ${new Date().getFullYear()} Tamino Martinius · MIT`),
  ),
);

document.body.append(app);
