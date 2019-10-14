import * as React from 'react';
import { useSubStateRoot, useSubStateSelect } from '../state/Substate';

export const Root: React.FC = () => {
  const [rootState, setRootState] = useSubStateRoot();
  const initialState = React.useRef(rootState!);

  const handleReset = () => {
    setRootState(initialState.current);
  };
  return (
    <div>
      <h1>Root state</h1>
      <pre>{JSON.stringify(rootState)}</pre>
    </div>
  );
};

export const Counter: React.FC = () => {
  const [count, setCount] = useSubStateSelect('subCount');
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
  const [query, setQuery] = useSubStateSelect('subQuery');
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

export const SubStateComponents = () => {
  return (
    <>
      <Root />
      <Counter />
      <Input />
    </>
  );
};
