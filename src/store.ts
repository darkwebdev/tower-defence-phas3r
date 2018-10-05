import { createStore, Reducer, Store } from 'redux';

export type State = {
  gameStarted: boolean;
  gamePaused: boolean;
  menuVisible: boolean;
  panelVisible: boolean;
}

export const initialState: State = {
  gameStarted: false,
  gamePaused: false,
  menuVisible: false,
  panelVisible: true
};

export default function (reducer: Reducer<State>): Store {
  return createStore(reducer, initialState);
}
