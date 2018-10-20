import { AnyAction } from 'redux';
import { State, initialState } from '.';
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

    case ActionTypes.SHOW_TOWER_CONTROLS:
      return { ...state, towerControlsVisible: true, activeTower: action.payload };

    case ActionTypes.HIDE_TOWER_CONTROLS:
      return { ...state, towerControlsVisible: false };
    
    case ActionTypes.SELL_TOWER:
      return { ...state, towerControlsVisible: false };

    case ActionTypes.RESUME:
      return { ...state, gamePaused: false, menuVisible: false };

    case ActionTypes.RESTART:
      return initialState;

    default:
      return state;
  }
};
