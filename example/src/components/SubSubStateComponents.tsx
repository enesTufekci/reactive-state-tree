import * as React from 'react';
import { SubSubState } from '../state/SubSubstate';

export const Root: React.FC = () => {
  const [rootState, setRootState] = SubSubState.useRootState();
  const initialState = React.useRef(rootState!);

  const handleReset = () => {
    setRootState(initialState.current);
  };
  console.log('render sub root');
  return (
    <div>
      <h1>Sub Root state</h1>
      <pre>{JSON.stringify(rootState)}</pre>
      <button onClick={handleReset}>Reset</button>
    </div>
  );
};

export const Counter: React.FC = () => {
  const [count, setCount] = SubSubState.useSelectState('subSubCount');
  const handleIncrement = () => {
    setCount(count => count + 1);
  };

  return (
    <div>
      <p>
        Sub Count: <strong>{count}</strong>
      </p>
      <button onClick={handleIncrement}>Increment</button>
    </div>
  );
};

export const Input: React.FC = () => {
  const [query, setQuery] = SubSubState.useSelectState('subSubQuery');
  const handleUpdateQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setQuery(value);
  };
  return (
    <div>
      <input type="text" value={query || ''} onChange={handleUpdateQuery} />
    </div>
  );
};

export const SubSubStateComponents = () => {
  return (
    <>
      <Root />
      <Counter />
      <Input />
    </>
  );
};
