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
] = createReactiveContext<AppState>({
  count: 0,
  query: '',
  subState: {
    subCount: 0,
    subQuery: '1234',
  },
});

export {
  AppStateContext,
  AppStateProvider,
  useAppStateRoot,
  useAppStateSelect,
};
