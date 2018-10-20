import { createStore, Reducer, Store } from 'redux';
import Tower from '../entities/tower';

export type State = {
  gameStarted: boolean;
  gamePaused: boolean;
  menuVisible: boolean;
  panelVisible: boolean;
  towerControlsVisible: boolean;
  activeTower: Tower;
  money: number;
  hp: number;
}

export const initialState: State = {
  gameStarted: false,
  gamePaused: false,
  menuVisible: false,
  panelVisible: true,
  towerControlsVisible: false,
  activeTower: undefined,
  money: 0,
  hp: 0
};

export default function (reducer: Reducer<State>): Store {
  return createStore(reducer, initialState);
}
