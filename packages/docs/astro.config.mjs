// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: 'My Docs',
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/withastro/starlight' }],
      sidebar: [
        {
          label: 'Guide',
          slug: 'guides/example'
        },
        {
          label: 'Array',
          autogenerate: { directory: 'functions/array' }
        },
        {
          label: 'Async',
          autogenerate: { directory: 'functions/async' }
        },
        {
          label: 'Guard',
          autogenerate: { directory: 'functions/guard' }
        }
      ]
    })
  ]
});
