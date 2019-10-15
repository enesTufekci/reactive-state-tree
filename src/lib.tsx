import * as React from 'react';
import { StateTree, createStateTree } from './StateTree';
import { createSelectStateHook, createRootStateHook } from './helpers';

export function createReactiveContext<T extends {}>(defaultState: T) {
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

  const useSelectState = createSelectStateHook(Context);
  const useRootState = createRootStateHook(Context);

  return [Context, Provider, useRootState, useSelectState] as [
    typeof Context,
    typeof Provider,
    typeof useRootState,
    typeof useSelectState
  ];
}

export function createSubTree<T, K extends keyof T>(
  Context: React.Context<StateTree<T>>,
  key: K
) {
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

  const useSelectState = createSelectStateHook(InnerContext);
  const useRootState = createRootStateHook(InnerContext);

  return [InnerContext, Provider, useRootState, useSelectState] as [
    typeof InnerContext,
    typeof Provider,
    typeof useRootState,
    typeof useSelectState
  ];
}
