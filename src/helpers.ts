import * as React from 'react';
import { StateTree } from './StateTree';

type UseSelectState<T> = <K extends keyof T>(
  path: K,
  condition?: (p: T[K]) => boolean
) => [T[K] | null, (n: T[K] | ((n: T[K]) => T[K])) => void];

type Updater<T> = T | ((state: T) => T);

export const createSelectStateHook = <T>(
  Context: React.Context<StateTree<T>>
) => {
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

  return useSelectState;
};

export const createRootStateHook = <T>(
  Context: React.Context<StateTree<T>>
) => {
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

  return useRootState;
};
