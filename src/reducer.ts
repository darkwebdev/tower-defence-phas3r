import { AnyAction } from 'redux';
import { State, initialState } from './store';
import { ActionTypes } from './actions';

export default function (state: State, action: AnyAction): State {
  console.log('REDUCING', action)
  
  switch(action.type) {
    case ActionTypes.MONEY_UPDATED:
      return { ...state, money: action.payload };
    
    case ActionTypes.HP_UPDATED:
      return { ...state, hp: action.payload };
      
    case ActionTypes.SHOW_MENU:
      return { ...state, gamePaused: true, menuVisible: true };

    case ActionTypes.HIDE_PANEL:
      return { ...state, panelVisible: false };

    case ActionTypes.SHOW_PANEL:
      return { ...state, panelVisible: true };

    case ActionTypes.RESUME:
      return { ...state, gamePaused: false, menuVisible: false };

    case ActionTypes.RESTART:
      return initialState;

    default:
      return state;
  }
};
