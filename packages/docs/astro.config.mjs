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
          label: 'Installation',
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
          label: 'Function',
          autogenerate: { directory: 'functions/function' }
        },
        {
          label: 'Guard',
          autogenerate: { directory: 'functions/guard' }
        }
      ]
    })
  ]
});
