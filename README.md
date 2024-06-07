# Memory Game @next 🚀

[Live demo](https://scred666.github.io/demos/memory-game-next/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for
type checking. In editors, we
need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)
to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented
a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more
performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
    1) Run `Extensions: Show Built-in Extensions` from VSCode's command palette
    2) Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
yarn install
#or
npm install
```

### Compile and Hot-Reload for Development

```sh
yarn run serve
#or
npm run serve
```

### Type-Check, Compile and Minify for Production

```sh
yarn run build
#or
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
yarn run test:unit
#or
npm run test:unit
```

### See Coverage Report

```sh
yarn run test:unit --coverage
#or
npm run test:unit --coverage
```

### Lint with [ESLint](https://eslint.org/)

```sh
yarn run lint
#or
npm run lint
```
