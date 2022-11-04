# MDtx [![NPM Version](https://img.shields.io/npm/v/mdtx.svg?style=flat)](https://www.npmjs.com/package/mdtx) [![NPM Version](https://img.shields.io/github/checks-status/aexol-studio/mdtx/main)](https://www.npmjs.com/package/mdtx) [![NPM Version](https://img.shields.io/github/last-commit/aexol-studio/mdtx)](https://github.com/aexol-studio/mdtx)

Inspired by generative programming and weed :). So I was learning Elm language at home usually in the evening and now I am missing all this generative stuff from Elm libs in TS.

![Alt Text](sandbox/mdtx-nextjs-example/public/PresentationOfMDtx.gif)

# What is MDtx?

- When you add **Markdown** files with gray matter it will generate typings for those,
- Genereted typings from **Markdowns** can get automatically convert into html structure,
- There is **Next JS Plugin** to work faster with MDtx on NextJS,

# What we serve?

## [![GitHub package.json version (subfolder of monorepo)](https://img.shields.io/github/package-json/v/aexol-studio/mdtx?color=yellow&filename=%2Fpackages%2Fmdtx-cli%2Fpackage.json&label=CLI&style=for-the-badge)](https://github.com/aexol-studio/mdtx) | [![GitHub package.json version (subfolder of monorepo)](https://img.shields.io/github/package-json/v/aexol-studio/mdtx?color=green&filename=%2Fpackages%2Fmdtx-core%2Fpackage.json&label=CORE&style=for-the-badge)](https://github.com/aexol-studio/mdtx/tree/main/packages/mdtx-core) | [![GitHub package.json version (subfolder of monorepo)](https://img.shields.io/github/package-json/v/aexol-studio/mdtx?color=white&filename=%2Fpackages%2Fmdtx-plugin-nextjs%2Fpackage.json&label=NextJS-plugin&style=for-the-badge)](https://github.com/aexol-studio/mdtx/tree/main/packages/mdtx-plugin-nextjs)

## Readme CLI

#### Instaling MDtx

```
npm i mdtx
```

#### Initializing MDtx

```
mdtx init
```

#### After initalize config file mdtx.json apear as that:

```
{
  "in": "./content",
  "out": "./src",
}
```

- in: string - means folder with content, **(default: "./content")**
- out: string - means folder to generate mdtx.ts file, **(default: "./src")**

#### Optionally:

- markdownToHtml: boolean - allow mdtx covert md content to html content. **(default: false)**

#### Watch mode (on "in" path)

```
mdtx
```

#### Build mode (trigger once)

```
mdtx -b
```

#### [Readme CORE](https://github.com/aexol-studio/mdtx/tree/main/sandbox/mdtx-example/Readme.md)

#### [Readme NextJS Plugin](https://github.com/aexol-studio/mdtx/tree/main/sandbox/mdtx-nextjs-example/Readme.md)

## Roadmap

- [x] NextJS plugin
- [ ] Gatsby plugin
- [ ] Tree building
- [ ] Summary building
- [ ] Other language generation
