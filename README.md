# react-teleporter

[![License](https://img.shields.io/npm/l/react-teleporter.svg)](https://github.com/gregberge/react-teleporter/blob/main/LICENSE)
[![npm package](https://img.shields.io/npm/v/react-teleporter/latest.svg)](https://www.npmjs.com/package/react-teleporter)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/react-teleporter)](https://bundlephobia.com/package/react-teleporter)
[![CI](https://github.com/gregberge/react-teleporter/actions/workflows/ci.yml/badge.svg)](https://github.com/gregberge/react-teleporter/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/gregberge/react-teleporter/branch/main/graph/badge.svg)](https://codecov.io/gh/gregberge/react-teleporter)

Teleport React components in the same React tree.

👉 [**Read how to use it to create scalable layouts**](https://gregberge.com/blog/react-scalable-layout)

👉 [**Checkout the demo on CodeSandbox**](https://codesandbox.io/s/react-teleporter-demo-ryklv)

```bash
npm install react-teleporter
```

## Example

```js
import { createTeleporter } from "react-teleporter";

const StatusBar = createTeleporter();

function Header() {
  return (
    <header>
      <StatusBar.Target />
    </header>
  );
}

function Page() {
  return (
    <main>
      {/* Teleport "Loading..." into the header */}
      <StatusBar.Source>Loading...</StatusBar.Source>
    </main>
  );
}

function App() {
  return (
    <div>
      <Header />
      <Page />
    </div>
  );
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
const Teleporter = createTeleporter();

function CustomTarget() {
  const targetRef = Teleporter.useTargetRef();
  return <div ref={targetRef} />;
}
```

### Use multiple sources

By default only one `Source` is allowed to be injected into a `Target`. Sometimes you may want to inject multiple sources into a single target. Create teleporter with `{ multiSources: true }` option.

```js
const Teleporter = createTeleporter({ multiSources: true })

<Teleporter.Source multiple>
  <a href="#">A link</a>
</Teleporter.Source>

<Teleporter.Source multiple>
  <a href="#">Another link</a>
</Teleporter.Source>

// The target will contains the two links
```

### Use function as children

Useful for having access to the `Target` element. E.g., to dispatch an event through the `Target` when something happens in the `Source`.

```js
const forwardEvent = element => event => element.dispatch(new Event(event.type, event));

<Source>
  {element => <div onClick={forwardEvent(element)}></div>}
</Source>
```

## API

### createTeleporter

`createTeleporter` is the only method exposed by this package. It returns an object containing a `Target`, a `Source` and a `useTargetRef` to create a custom target.

```js
import { createTeleporter } from "react-teleporter";

const Teleporter = createTeleporter();
```
