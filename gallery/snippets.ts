export interface Snippet {
  slug: string;
  title: string;
  description: string;
}

// The canonical list of snippets in the monorepo. Order = display order.
// Each slug must match a folder under snippets/<slug>/ with an index.html.
export const snippets: Snippet[] = [
  {
    slug: 'business-card',
    title: 'Business Card',
    description:
      'An interactive business card with a gooey, mouse-reactive border and text that flows along the morphing edge — rendered with Konva.',
  },
  {
    slug: 'menu-animations',
    title: 'Menu Animations',
    description:
      'Menu-button toggles that morph between hamburger, cross, dots and back icons — pure-CSS path animation.',
  },
  {
    slug: 'checkboxes',
    title: 'Checkboxes',
    description: 'A set of animated, pure-CSS custom checkbox styles.',
  },
  {
    slug: 'ascii-generator',
    title: 'ASCII Art Generator',
    description:
      'Turn any image into ASCII art in the browser, with live controls for size, contrast and colour palette.',
  },
  {
    slug: 'radiobuttons',
    title: 'Radio Buttons',
    description: 'Animated, pure-CSS custom radio-button styles.',
  },
  {
    slug: 'starfield',
    title: 'Starfield',
    description: 'An animated, configurable parallax starfield rendered on a canvas.',
  },
  {
    slug: 'git-loading',
    title: 'Git Loading',
    description: 'A loading animation styled after a git commit-graph.',
  },
];
