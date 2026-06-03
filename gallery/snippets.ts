export interface Snippet {
  slug: string;
  title: string;
  description: string;
  /** Stars preserved from the original standalone repo (now archived). */
  stars: number;
}

// The canonical list of snippets in the monorepo. Order = display order.
// Each slug must match a folder under snippets/<slug>/ with an index.html.
export const snippets: Snippet[] = [
  {
    slug: 'menu-animations',
    title: 'Menu Animations',
    description:
      'Menu-button toggles that morph between hamburger, cross, dots and back icons — pure-CSS path animation.',
    stars: 176,
  },
  {
    slug: 'checkboxes',
    title: 'Checkboxes',
    description: 'A set of animated, pure-CSS custom checkbox styles.',
    stars: 13,
  },
  {
    slug: 'ascii-generator',
    title: 'ASCII Art Generator',
    description:
      'Turn any image into ASCII art in the browser, with live controls for size, contrast and colour palette.',
    stars: 3,
  },
  {
    slug: 'radiobuttons',
    title: 'Radio Buttons',
    description: 'Animated, pure-CSS custom radio-button styles.',
    stars: 3,
  },
  {
    slug: 'starfield',
    title: 'Starfield',
    description: 'An animated, configurable parallax starfield rendered on a canvas.',
    stars: 0,
  },
  {
    slug: 'git-loading',
    title: 'Git Loading',
    description: 'A loading animation styled after a git commit-graph.',
    stars: 0,
  },
];
