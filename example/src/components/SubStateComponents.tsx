import * as React from 'react';
import { SubState } from '../state/Substate';

export const Root: React.FC = () => {
  const [rootState, setRootState] = SubState.useRootState();
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
  const [count, setCount] = SubState.useSelectState('subCount');
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
  const [query, setQuery] = SubState.useSelectState('subQuery');
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

const Condition: React.FC = () => {
  SubState.useOnChange(
    'subCount',
    subCount => {
      if (subCount) {
        return subCount > 5;
      }
      return false;
    },
    () => alert('hahhaha')
  );
  console.log('render condition');
  return null;
};

export const SubStateComponents = () => {
  return (
    <>
      <Root />
      <Condition></Condition>
      <Counter />
      <Input />
    </>
  );
};
