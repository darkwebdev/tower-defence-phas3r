import { Action } from 'redux';
import { State, initialState } from './store';
import { ActionTypes } from './actions';

export default function (state: State, action: Action): State {
  console.log('REDUCING', action)
  
  switch(action.type) {
    case ActionTypes.SHOW_MENU:
      return { ...state, gamePaused: true, menuVisible: true };
      break;

    case ActionTypes.HIDE_PANEL:
      return { ...state, panelVisible: false };
      break;

    case ActionTypes.SHOW_PANEL:
      return { ...state, panelVisible: true };
      break;

    case ActionTypes.RESUME:
      return { ...state, gamePaused: false, menuVisible: false };
      break;

    case ActionTypes.RESTART:
      return initialState;
      break;

    default:
      return state;
  }
};
