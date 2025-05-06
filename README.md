# Base TS CLI Lib Test

This repo is for prototyping my idea of a shadcn style utility library where code is added into your codebase via a CLI rather than being imported from a package.

The main things I am experimenting with/want to iron out with this repo are:

- Monorepo structure/tooling
- CI Steps

More findings are below.

## Monorepo Structure & Tooling

I originally setup a prototype using Nx, which has a great DX in regards to initial setup, but (in my experience) becomes far too complicated once you start customizing it, and this project has a lot of non-standard requirements. I understand that using bare package manager workspaces will add in some extra tedium, mainly when creating new packages, I think it is very much worth the exchange of having a much simpler setup.

## CI Steps

To make sure we always generate and commit new JS code, we use husky+lint-staged. Whenever a change to a typescript file in the `lib` package is committed, we run the `build` command and add the output to the commit.
