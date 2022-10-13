# Mdtx

[![NPM Version](https://img.shields.io/npm/v/mdtx.svg?style=flat)]()

Inspired by generative programming and weed :). So I was learning Elm language at home usually in the evening and now I am missing all this generative stuff from Elm libs in TS.

## What is generated now?

- when you add **Markdown** files with gray matter it will generate typings for those

## Installation

```sh
$ npm i mdtx
```

## How to use

Init mdtx to provide input and output

```sh
$ mdtx --init
```

Then use `mdtx` to watch files and generate new file on every markdown/static file change

```sh
mdtx
```

## Examples

Check example folder, generated content looks like this. It is a one big tree of safely typed md files.

```ts
export const htmlContent = {
  'basics/HowToStart.md': {
    content: '\n# Hello world\n',
    data: {
      title: 'How to start',
    },
    excerpt: '',
  },
  'Changelog.md': {
    content: '\n## 0.0.1\n\nFirst mdtx version\n',
    data: {
      link: 'changelog',
      title: 'Changelog',
      order: 99,
    },
    excerpt: '',
  },
} as const;
```

## Roadmap

- [ ] next js plugin
- [ ] gatsby plugin
- [ ] tree building
- [ ] summary building
- [ ] other language generation
