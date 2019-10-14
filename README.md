# Reactive State Tree

A partially global state management that doesn't require optimisation.

## Motivation

State management is hard, especially if a state effects multiple components which are in seperate branch of the component tree. Using `Context Api` in this scenario requires lots of optimisations with `useRef`, `useCallback` etc. and of course their deps needs to be managed. This library provides as clean as possible api without dealing with this overhead.

## How to use

### Installation

```
npm install reactive-state-tree
```

or

```
yarn add reactive-state-tree
```

### Usage

Create a state tree

```jsx
// state.js
import { createReactiveContext } from 'reactive-state-tree';

// The api returns tuple instead of object to make it easy to rename
const [Context, Provider, useRootState, useSelector] = createReactiveContext({
  count: 1,
  query: '',
});

export { Context, Provider, useRootState, useSelector };
```

Place the provider in component tree.

```jsx
// App.js
import React from 'react';
import { Counter, Input, Root } from './components';

const App = () => {
  <Provider>
    <Root />
    <Counter />
    <Input />
  </Provider>;
};
```

Access the state via hooks exposed by the state

```jsx
// components.js
import React from 'react';
import { useSelector, useRoot } from './state';

export const Counter = () => {
  const [count, setCount] = useSelector('count');

  const handleIncrement = () => setCount(count => count + 1);
  const handleDecrement = () => setCount(count => count - 1);

  return (
    <div>
      <label>Count: {count}</label>
      <button onClick={handleIncrement}>Inc</button>
      <button onClick={handleDecrement}>Dec</button>
    </div>
  );
};

export const Input = () => {
  const [query, setQuery] = useSelector('query');

  const handleUpdate = e => setQuery(e.target.value);

  return (
    <div>
      <label>Query: {count}</label>
      <input onChange={handleUpdate} value={query} />
    </div>
  );
};

export const Root = () => {
  const [rootState, setRootStae] = useRoot();

  const initialState = React.useRef(rootState);

  const handleReset = () => setRootState(initialState.current);

  return (
    <div>
      <pre>{JSON.stringify(rootState)}</pre>
      <button onClick={handleReset}>Reset</button>
    </div>
  );
};
```

So what is the catch? Same thing can be achieved by using `useState` hook. Not really, this example shows the most basic usa case. Please check the examples below.

### Examples

- [Shopping Cart](https://codesandbox.io/embed/lingering-wood-ncm3y?fontsize=14)

More examples are coming...

### API Reference

| Api         | Params                                                                                                                                                             | Description                                                                       |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------- |
| Provider    | initialState                                                                                                                                                       | Provider                                                                          |
| Context     | `none`                                                                                                                                                             | Context                                                                           |
| useRoot     | `none`                                                                                                                                                             | Hook returns a tuple with root state and root state updater like `React.useState` |
| useSelector | `key: string` (key of the given state), `condition`: callback function takes state and returns boolean, based on returned boolean the state will be updated or not | Hook returns a tuple with root state and root state updater like `React.useState` |

### Planned Features

- `Compostion api` which will provide create another state tree by using other state trees.
- `Dev tool`, will help to track changes and exlore states.
- `map api`, will allow to use mapped value directly from the state

### Contribution

This project 100% open to any kind of contribution.
