import { createStore, Reducer, Store } from 'redux';

export type State = {
  gameStarted: boolean;
  gamePaused: boolean;
  menuVisible: boolean;
}

export const initialState: State = {
  gameStarted: false,
  gamePaused: false,
  menuVisible: false
};

export default function (reducer: Reducer<State>): Store {
  return createStore(reducer, initialState);
}
