import * as React from 'react'
import { Dispatch } from 'redux'
import { Scenes } from 'phaser'
import { State } from '../store'
import { addTower, hideControl, restartGame, resumeGame, showMenu, showControl, startNewWave } from '../actions'
import { TowerTypes } from '../entities/tower';
import config from '../config';
import Menu from './menu'
import Control from './control'
import Status from './status'
import './styles.less'

type Props = {
  state: State;
  dispatch: Dispatch;
  scene: Scenes.ScenePlugin;
}

const towers = config.towers;
const UI: React.SFC<Props> = ({ state, dispatch, scene }: Props) => (
  <React.Fragment>
    <Menu
      hidden={!state.menuVisible}
      onReturn={() => { dispatch(resumeGame(scene)) }}
      onRestart={() => { dispatch(restartGame(scene)) }}
    />
    
    <Status
      money={state.money}
      hp={state.hp}
    />
    
    <Control
      hidden={!state.panelVisible}
      onMenuButtonClick={() => { dispatch(showMenu(scene)) }}
      
      onHideButtonClick={() => { dispatch(hideControl()) }}
      onShowButtonClick={() => { dispatch(showControl()) }}

      isBulletTowerDisabled={state.money < towers[TowerTypes.TOWER_BULLET].price}
      bulletTowerPrice={towers[TowerTypes.TOWER_BULLET].price}
      onBulletTowerButtonClick={() => { dispatch(addTower(scene, TowerTypes.TOWER_BULLET)) }}

      isLaserTowerDisabled={state.money < towers[TowerTypes.TOWER_LASER].price}
      laserTowerPrice={towers[TowerTypes.TOWER_LASER].price}
      onLaserTowerButtonClick={() => { dispatch(addTower(scene, TowerTypes.TOWER_LASER)) }}
      
      onNewWaveClick={()=> { dispatch(startNewWave(scene)) }}
    />
  </React.Fragment>
);

export default UI;
