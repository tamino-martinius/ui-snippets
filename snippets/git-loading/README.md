# Simple CodePen like Template which supports postCSS and TypeScript to build UI Snippets

Use this Template to quickly build UI snippets.

## Features

- [TypeScript](https://www.typescriptlang.org) (compiling directly to ES5)
- [postCSS](http://postcss.org) with several plugins:
  - [import](https://github.com/postcss/postcss-import)
  - [nesting](https://www.npmjs.com/package/postcss-nesting)
  - [custom properties](https://github.com/postcss/postcss-custom-properties)
  - [each](https://github.com/outpunk/postcss-each)
  - [cssnext](https://github.com/MoOx/postcss-cssnext)
  - [autoprefixer](https://github.com/postcss/autoprefixer)
- [Webpack](https://webpack.js.org)
- [EditorConfig](http://editorconfig.org/)
- Linting
  - [TSLint](https://palantir.github.io/tslint): general rules
  - [Stylint](https://stylelint.io): CSS rules
- VS Code Extensions
  - [VS Code TSLint extension](https://marketplace.visualstudio.com/items?itemName=eg2.tslint)
  - [stylelint](https://marketplace.visualstudio.com/items?itemName=shinnn.stylelint)
  - [stylefmt](https://marketplace.visualstudio.com/items?itemName=mrmlnc.vscode-stylefmt)

## Getting Started

### Install

- Clone repository
  - `git clone https://github.com/tamino-martinius/ui-snippets-template`
  - or go to [GitHub](https://github.com/tamino-martinius/ui-snippets-template) and download as zip
- Rename and enter folder
- install packages `npm install`
  Node.js `>= 8.10` suggested for module syntax and `async` / `await` without TypeScript

### Open the project with your Text Editor

Tip for VS Code Users:
Add `code` command to your Terminal by pressing cmd + shift + p and search for `Shell Command: Install 'code' command to PATH`.

Now you can open the project using this command:

```bash
code .
```

### Use without TypeScript

Rename `/src/index.ts` to `/src/index.js` before starting the Server.

### Use without PostCSS

Just don't use the additional postCSS features.

### Start development server with Hot Reloading

```bash
npm run start
```

### Build for production

```bash
npm run build
```

### Deploy to github pages

```bash
npm run deploy
```

### Create Epic UI snippets
