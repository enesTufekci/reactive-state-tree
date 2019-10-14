import { createReactiveContext } from '../../../.';

export interface SubState {
  subCount: number;
  subQuery: string;
}

export interface AppState {
  count: number;
  query: string;
  subState: SubState;
}

const [
  AppStateContext,
  AppStateProvider,
  useAppStateRoot,
  useAppStateSelect,
] = createReactiveContext<AppState>(null as any);

export {
  AppStateContext,
  AppStateProvider,
  useAppStateRoot,
  useAppStateSelect,
};
