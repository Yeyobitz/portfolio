import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';

export default defineConfig({
  output: 'hybrid',
  adapter: netlify(),
  vite: {
    build: {
      cssMinify: true,
      minify: 'esbuild'
    }
  }
});
