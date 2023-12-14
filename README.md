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
