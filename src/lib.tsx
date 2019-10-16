import * as React from 'react';

import { StateTree, createStateTree } from './StateTree';
import { createStateManager, UseSelectState } from './helpers';

interface StateBranchI<T, K extends keyof T> {
  Provider: React.FC<{ initialState?: T[K] }>;
  useSelectState: UseSelectState<T[K]>;
  useRootState: (
    condition?: (state: T[K]) => boolean
  ) => [T[K] | null, (n: T[K]) => void];
  useOnChange: <L extends keyof T[K]>(
    key: L,
    condition: ((key: T[K][L] | null) => boolean) | undefined,
    cb: VoidFunction
  ) => void;
  createBranch: <L extends keyof T[K]>(key: L) => StateBranchI<T[K], L>;
}

interface StateTreeI<T> {
  Provider: React.FC<{ initialState?: T }>;
  useSelectState: UseSelectState<T>;
  useRootState: (
    condition?: (state: T) => boolean
  ) => [T | null, (n: T) => void];
  useOnChange: <K extends keyof T>(
    key: K,
    condition: ((key: T[K] | null) => boolean) | undefined,
    cb: VoidFunction
  ) => void;
  createBranch: <K extends keyof T>(key: K) => StateBranchI<T, K>;
}

export const createBranch = <
  T extends { [key: string]: any },
  K extends keyof T
>(
  Context: React.Context<StateTree<T>>,
  key: K
): StateBranchI<T, K> => {
  const InnerContext = React.createContext<StateTree<T[K]>>(null as any);

  const Provider: React.FC<{ initialState?: T[K] }> = ({
    initialState = {},
    children,
  }) => {
    const rootStateTree = React.useContext(Context);

    const stateTree = React.useRef(
      createStateTree({ ...rootStateTree.getValue()[key], ...initialState })
    );

    React.useEffect(() => {
      const subscription = stateTree.current.subscribe(nextState => {
        rootStateTree.next({ ...rootStateTree.getValue(), [key]: nextState });
      });
      // TODO: check circular update causing problems
      const rootSubscription = rootStateTree.subscribe(nextState => {
        stateTree.current.next(nextState[key]);
      });

      return () => {
        subscription.unsubscribe();
        rootSubscription.unsubscribe();
      };
    }, [rootStateTree]);

    const value = React.useRef(stateTree.current);

    return (
      <InnerContext.Provider value={value.current}>
        {children}
      </InnerContext.Provider>
    );
  };

  return {
    ...createStateManager(InnerContext, Provider),
    createBranch: <L extends keyof T[K]>(key: L) =>
      createBranch(InnerContext, key),
  };
};

export function createState<T extends {}>(defaultState: T): StateTreeI<T> {
  const Context = React.createContext<StateTree<T>>(null as any);

  const Provider: React.FC<{ initialState?: T }> = ({
    children,
    initialState = {},
  }) => {
    const value = React.useRef(
      createStateTree({ ...defaultState, ...initialState })
    );
    return (
      <Context.Provider value={value.current}>{children}</Context.Provider>
    );
  };

  return {
    ...createStateManager(Context, Provider),
    createBranch: <K extends keyof T>(key: K) => createBranch(Context, key),
  };
}
