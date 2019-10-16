import * as React from 'react';
import { AppState } from './state/AppState';
import { SubState } from './state/Substate';
import { SubSubState } from './state/SubSubstate';
import { AppStateComponents } from './components/AppStateComponents';
import { SubStateComponents } from './components/SubStateComponents';
import { SubSubStateComponents } from './components/SubSubStateComponents';

export const App: React.FC = () => {
  const initialState: AppState = {
    count: 0,
    query: '',
    subState: {
      subCount: 0,
      subQuery: '1234',
      subSubState: {
        subSubCount: 0,
        subSubQuery: '',
      },
    },
  };
  return (
    <AppState.Provider>
      <AppStateComponents />
      <SubState.Provider>
        <SubStateComponents />
        <SubSubState.Provider>
          <SubSubStateComponents />
        </SubSubState.Provider>
      </SubState.Provider>
    </AppState.Provider>
  );
};
