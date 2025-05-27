/**
 * @type {import('lint-staged').Configuration}
 */
export default {
  "packages/lib/src/**/*.ts": () => [
    "nr build:lib",
    "nr gen:function-docs",
    "nr gen:registry",
    "git add packages/lib/js",
    "git add packages/docs/src/content/docs/functions",
    "git add registry.json",
  ], // function = only run once, not per-file
  "packages/lib/src/**/*.example.ts": "tsx",
};
