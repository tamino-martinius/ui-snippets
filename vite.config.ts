import { existsSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

// Each snippet is a self-contained multi-page entry: snippets/<slug>/index.html
const root = import.meta.dirname;
const snippetsDir = resolve(root, 'snippets');

const slugs = readdirSync(snippetsDir, { withFileTypes: true })
  .filter((d) => d.isDirectory() && existsSync(resolve(snippetsDir, d.name, 'index.html')))
  .map((d) => d.name)
  .sort();

const input: Record<string, string> = { main: resolve(root, 'index.html') };
for (const slug of slugs) input[slug] = resolve(snippetsDir, slug, 'index.html');

export default defineConfig({
  // Project pages live under /ui-snippets/. Override with --base for a custom domain.
  base: process.env.BASE_PATH ?? '/ui-snippets/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: { input },
  },
});
