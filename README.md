# NextJS LMDB Blog

This project is a proof-of-concept starter for a content-based website editor that primarily uses the filesystem for data storage alongside LMDB to fill some of the gaps between that and a full-blown RDBMS. Since most content websites are some variant of a blog, this base should be able to be adapt to many data types.

The primary data source is a tree of directories in the Content Directory, which by default is named `content` and located at the root of the project.

## Getting Started

First, create a user with the `create-user` script:

```bash
npm run create-user
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Test Suite

This project has a Cypress e2e test suite that can run against the development server or the optimized production build via two sets of scripts: `e2e-dev` and `e2e-start` both with `:headless` variants.

`e2e-dev` is helpful for rapid development, while `e2e-start` runs faster and is more reflective of production. Remember to run `build` after any changes for those to apply to `e2e-start`!
