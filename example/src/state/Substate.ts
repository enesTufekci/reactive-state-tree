import { createSubTree } from '../../../.';
import { AppStateContext } from './AppState';

const [
  SubStateContext,
  SubStateProvider,
  useSubStateRoot,
  useSubStateSelect,
] = createSubTree(AppStateContext, 'subState');

export {
  SubStateContext,
  SubStateProvider,
  useSubStateRoot,
  useSubStateSelect,
};
