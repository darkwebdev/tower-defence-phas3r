import { createStore, Reducer, Store } from 'redux';

export type State = {
  gameStarted: boolean;
  gamePaused: boolean;
  menuVisible: boolean;
  panelVisible: boolean;
  money: number;
  hp: number;
}

export const initialState: State = {
  gameStarted: false,
  gamePaused: false,
  menuVisible: false,
  panelVisible: true,
  money: 0,
  hp: 0
};

export default function (reducer: Reducer<State>): Store {
  return createStore(reducer, initialState);
}
