import * as React from 'react';
import { AppStateProvider, AppState } from './state/AppState';
import { SubStateProvider } from './state/Substate';
import { AppStateComponents } from './components/AppStateComponents';
import { SubStateComponents } from './components/SubStateComponents';

export const App: React.FC = () => {
  const initialState: AppState = {
    count: 0,
    query: '',
    subState: {
      subCount: 0,
      subQuery: '1234',
    },
  };
  return (
    <AppStateProvider>
      <AppStateComponents />
      <SubStateProvider>
        <SubStateComponents />
      </SubStateProvider>
    </AppStateProvider>
  );
};
