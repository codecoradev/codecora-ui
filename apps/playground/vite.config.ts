import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

// GitHub Pages serves a project site under /<repo>, so the Pages workflow builds
// with BASE_PATH=/codecora-ui. Everywhere else the site is at the root.
const base = process.env.BASE_PATH ?? '';
if (base !== '' && !/^\/[^/]/.test(base)) {
  throw new Error(`BASE_PATH must be empty or start with a slash, got "${base}"`);
}

export default defineConfig({
  plugins: [
    sveltekit({
      adapter: adapter({ fallback: '404.html' }),
      paths: { base: base as '' | `/${string}` },
      compilerOptions: { runes: true },
    }),
  ],
});
