export interface Snippet {
  slug: string;
  title: string;
  description: string;
  /** Stars preserved from the original standalone repo (archived). */
  stars: number;
}

// The canonical list of snippets in the monorepo. Order = display order.
// Each slug must match a folder under snippets/<slug>/ with an index.html.
export const snippets: Snippet[] = [
  {
    slug: 'menu-animations',
    title: 'Menu Animations',
    description:
      'Menu-button toggles that morph between hamburger, cross, dots and back icons — pure CSS path animation.',
    stars: 176,
  },
];
