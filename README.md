# Base TS CLI Lib Test

This repo is for prototyping my idea of a shadcn style utility library where code is added into your codebase via a CLI rather than being imported from a package.

The main things I am experimenting with/want to iron out with this repo are:

- Monorepo structure/tooling
- CI Steps
- Publishing the CLI

More findings are below.

## Monorepo Structure & Tooling

I originally setup a prototype using Nx, which has a great DX in regards to initial setup, but (in my experience) becomes far too complicated once you start customizing it, and this project has a lot of non-standard requirements. I understand that using bare package manager workspaces will add in some extra tedium, mainly when creating new packages, I think it is very much worth the exchange of having a much simpler setup.

## CI Steps

### Auto Building JS Functions

To make sure we always generate and commit new JS code, we use husky+lint-staged. Whenever a change to a typescript file in the `lib` package is committed, we run the `build` command and add the output to the commit. Due to some weirdness where the `tsc` seems to finish before files are actually written to disk, we use the `wait-on` package (see the `build` command in the `lib` package.json) to ensure that the command is not considered complete until the new files actually exist.

### Git Stuff

- `cz-conventional-changelog` CLI for making sure commits adhere to the conventional changelog format.
- `bumpp` for bumping versions. This is not automated as you have to manually interact with the CLI, but I am totally fine with that, version bumping is one of those things that can be extremely fiddily and can be a headache to fix when something goes wrong.
  - **IMPORTANT:** This may not be suitable for the actual release as it makes all package versions the same, which could be an issue for managing the CLI versioning.
- Publishing - haven't set this up yet.
