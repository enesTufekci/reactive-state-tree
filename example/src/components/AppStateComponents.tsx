import * as React from 'react';
import { useAppStateRoot, useAppStateSelect } from '../state/AppState';

export const Root: React.FC = () => {
  const [rootState, setRootState] = useAppStateRoot();
  const initialState = React.useRef(rootState!);

  const handleReset = () => {
    setRootState(initialState.current);
  };

  return (
    <div>
      <h1>Root state</h1>
      <pre>{JSON.stringify(rootState)}</pre>
      <button onClick={handleReset}>Reset</button>
    </div>
  );
};

export const Counter: React.FC = () => {
  const [count, setCount] = useAppStateSelect('count');
  const handleIncrement = () => {
    setCount(count => count + 1);
  };

  return (
    <div>
      <p>
        Count: <strong>{count}</strong>
      </p>
      <button onClick={handleIncrement}>Increment</button>
    </div>
  );
};

export const Input: React.FC = () => {
  const [query, setQuery] = useAppStateSelect('query');
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

export const SubState: React.FC = () => {
  const [substate] = useAppStateSelect('subState');
  return (
    <div>
      <pre>{JSON.stringify(substate)}</pre>
    </div>
  );
};

export const AppStateComponents = () => {
  return (
    <>
      <Root />
      <SubState />
      <Counter />
      <Input />
    </>
  );
};
