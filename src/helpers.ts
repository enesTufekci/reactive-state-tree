import * as React from 'react';
import { StateTree } from './StateTree';

export type UseSelectState<T> = <K extends keyof T>(
  path: K,
  condition?: (p: T[K]) => boolean
) => [T[K] | null, (n: T[K] | ((n: T[K]) => T[K])) => void];

type Updater<T> = T | ((state: T) => T);

export function createSelectStateHook<T>(Context: React.Context<StateTree<T>>) {
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
}

export function createRootStateHook<T>(Context: React.Context<StateTree<T>>) {
  const useRootState = (
    condition: (state: T) => boolean = () => true
  ): [T | null, (n: T) => void] => {
    const root = React.useContext(Context);

    const [state, setState] = React.useState(root.getValue());

    React.useEffect(() => {
      const subscription = root.subscribe(nextState => {
        if (condition(nextState)) {
          setState(nextState);
        }
      });
      return () => {
        subscription.unsubscribe();
      };
    }, [condition, root]);

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
}

type StateProvider<T> = React.FC<{
  initialState?: T;
}>;

const createUseOnChange = <T>(Context: React.Context<StateTree<T>>) => {
  return <K extends keyof T>(
    key: K,
    condition: (key: T[K] | null) => boolean = () => true,
    cb: VoidFunction
  ) => {
    const subject = React.useContext(Context);

    React.useEffect(() => {
      const sub = subject.subscribe(nextValue => {
        if (condition(nextValue[key])) {
          cb();
        }
      });
      return () => {
        sub.unsubscribe();
      };
    }, [cb, condition, key, subject]);
  };
};

const createUseUpdate = <T>(Context: React.Context<StateTree<T>>) => {
  return () => {
    const subject = React.useContext(Context);

    return subject.next;
  };
};

export function createStateManager<T>(
  Context: React.Context<StateTree<T>>,
  Provider: StateProvider<T>
) {
  const useSelectState = createSelectStateHook(Context);
  const useRootState = createRootStateHook(Context);
  const useOnChange = createUseOnChange(Context);
  const useUpdate = createUseUpdate(Context);

  return {
    Provider,
    useSelectState,
    useRootState,
    useOnChange,
    useUpdate,
  };
}
