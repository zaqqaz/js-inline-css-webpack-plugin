# js-inline-css-webpack-plugin
[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://opensource.org/licenses/mit-license.php)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/Runjuu/js-inline-css-webpack-plugin/pulls)
[![Total downloads](https://img.shields.io/npm/dm/js-inline-css-webpack-plugin.svg)](https://www.npmjs.com/package/js-inline-css-webpack-plugin)
[![npm version](https://badge.fury.io/js/js-inline-css-webpack-plugin.svg)](https://www.npmjs.com/package/js-inline-css-webpack-plugin)

This plugin inspired by **html-inline-css-webpack-plugin** but instead of injecting
directly to the html, it injects css into js (useful for libraries and testing purposes)
like: 
```
document.body.appendChild(nodeWithStyles);
```

Require [mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin).

## Install
#### NPM
```bash
npm i js-inline-css-webpack-plugin -D
```
#### Yarn
```bash
yarn add js-inline-css-webpack-plugin -D
```

## Minimal example
```js
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const JsInlineCssWebpackPlugin = require("js-inline-css-webpack-plugin").default;

module.exports = {
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
    new HtmlWebpackPlugin(),
    new JsInlineCssWebpackPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader"
        ]
      }
    ]
  }
}
```

## Config
```typescript
interface Config {
  filter?(fileName: string): boolean
  leaveCSSFile?: boolean
}
```

### filter(optional)
```typescript
filter?(fileName: string): boolean
```
Return `true` to make current file internal, otherwise ignore current file.
##### example
```typescript
...
  new JsInlineCssWebpackPlugin({
    filter(fileName) {
      return fileName.includes('main');
    },
  }),
...
```

### leaveCSSFile(optional)
if `true`, it will leave CSS files where they are when inlining
