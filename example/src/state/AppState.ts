import { createState } from '../../../.';

export interface SubState {
  subCount: number;
  subQuery: string;
  subSubState: {
    subSubQuery: string;
    subSubCount: number;
  };
}

export interface AppState {
  count: number;
  query: string;
  subState: SubState;
}

export const AppState = createState<AppState>({
  count: 0,
  query: '',
  subState: {
    subCount: 0,
    subQuery: '1234',
    subSubState: {
      subSubQuery: '',
      subSubCount: 0,
    },
  },
});
