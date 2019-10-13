import * as React from 'react';
import { StateTree, createStateTree } from './StateTree';

type UseSelectState<T> = <K extends keyof T>(
  path: K,
  condition?: (p: T[K]) => boolean
) => [T[K] | null, (n: T[K] | ((n: T[K]) => T[K])) => void];

type Updater<T> = T | ((state: T) => T);

export function createReactiveContext<T extends {}>(initialState: T) {
  const Context = React.createContext({} as StateTree<T>);

  const Provider: React.FC<{ initialState: T }> = ({
    children,
    initialState: initial,
  }) => {
    const value = React.useRef(createStateTree(initial || initialState));
    return (
      <Context.Provider value={value.current}>{children}</Context.Provider>
    );
  };

  const useSelectState: UseSelectState<T> = (path, condition = () => true) => {
    const root = React.useContext(Context);

    const subject = root!.children![path];

    const initialValue = subject ? subject.getValue() : null;

    const [state, setState] = React.useState(initialValue);

    React.useEffect(() => {
      const sub =
        subject &&
        subject.subscribe(nextValue => {
          if (condition(nextValue)) {
            setState(nextValue);
          }
        });
      return () => {
        sub.unsubscribe();
      };
    }, [condition, subject]);

    const update = <K extends keyof T>(updater: Updater<T[K]>) => {
      if (subject && subject.next) {
        if (typeof updater === 'function') {
          subject.next((updater as Function)(state));
        } else {
          subject.next(updater as any);
        }
      } else {
        throw Error(`${path} is not a property of root state!`);
      }
    };

    return [state, update];
  };

  const useRootState = (
    filter: (state: T) => boolean = () => true
  ): [T | null, (n: T) => void] => {
    const root = React.useContext(Context);

    const [state, setState] = React.useState(root.getValue());

    React.useEffect(() => {
      const subscription = root.subscribe(nextState => {
        if (filter(nextState)) {
          setState(nextState);
        }
      });
      return () => {
        subscription.unsubscribe();
      };
    }, [filter, root]);

    const update = (updater: Updater<T>) => {
      if (typeof updater === 'function') {
        root.next((updater as Function)(state));
      } else {
        root.next(updater);
      }
    };

    return [state, update];
  };

  return [Context, Provider, useRootState, useSelectState] as [
    typeof Context,
    typeof Provider,
    typeof useRootState,
    typeof useSelectState
  ];
}
