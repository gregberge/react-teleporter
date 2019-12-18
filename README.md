# react-teleporter

[![License](https://img.shields.io/npm/l/react-teleporter.svg)](https://github.com/gregberge/react-teleporter/blob/master/LICENSE)
[![npm package](https://img.shields.io/npm/v/react-teleporter/latest.svg)](https://www.npmjs.com/package/react-teleporter)
[![CircleCI](https://circleci.com/gh/gregberge/react-teleporter/tree/master.svg?style=svg)](https://circleci.com/gh/gregberge/react-teleporter/tree/master)
[![codecov](https://codecov.io/gh/gregberge/react-teleporter/branch/master/graph/badge.svg)](https://codecov.io/gh/gregberge/react-teleporter)
![Code style](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)
[![Dependencies](https://img.shields.io/david/gregberge/react-teleporter.svg)](https://david-dm.org/gregberge/react-teleporter)
[![DevDependencies](https://img.shields.io/david/dev/gregberge/react-teleporter.svg)](https://david-dm.org/gregberge/react-teleporter?type=dev)
[![Small size](https://img.badgesize.io/https://unpkg.com/react-teleporter/dist/react-teleporter.min.js?compression=gzip)](https://unpkg.com/react-teleporter/dist/react-teleporter.min.js)

Teleport React components in the same React tree.

👉 [**Read how to use it to create scalable layouts**](https://gregberge.com/blog/react-scalable-layout)

👉 [**Checkout the demo on CodeSandbox**](https://codesandbox.io/s/react-teleporter-demo-ryklv)

```bash
npm install react-teleporter
```

## Example

```js
import { createTeleporter } from 'react-teleporter'

const StatusBar = createTeleporter()

function Header() {
  return (
    <header>
      <StatusBar.Target />
    </header>
  )
}

function Page() {
  return (
    <main>
      {/* Teleport "Loading..." into the header */}
      <StatusBar.Source>Loading...</StatusBar.Source>
    </main>
  )
}

function App() {
  return (
    <div>
      <Header />
      <Page />
    </div>
  )
}
```

## Why?

In complex app, you may have to configure a part of the application from another. If you know [react-helmet](https://github.com/nfl/react-helmet) it is the same philosophy. You want to configure a part of your application from another place.

## Recipes

### Use another target element

Use `as` property on target to specify another tag.

```js
const Teleporter = createTeleporter()

<Teleporter.Target as="footer" />
```

> Be careful of specifying an element with a ref to a DOM element, it uses [React Portals](https://reactjs.org/docs/portals.html) under the hood.

### Use props on target

All props are forwarded to target.

```js
const Teleporter = createTeleporter()

<Teleporter.Target onClick={/* ... */} />
```

### Create a custom target ref

Use `useTargetRef` to create a custom target ref.

```js
const Teleporter = createTeleporter()

function CustomTarget() {
  const targetRef = Teleporter.useTargetRef()
  return <div ref={targetRef} />
}
```

## API

### createTeleporter

`createTeleporter` is the only method exposed by this package. It returns an object containing a `Target`, a `Source` and a `useTargetRef` to create a custom target.

```js
import { createTeleporter } from 'react-teleporter'

const Teleporter = createTeleporter()
```
