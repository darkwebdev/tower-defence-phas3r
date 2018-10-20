import * as React from 'react'
import { Dispatch } from 'redux'
import { Scenes } from 'phaser'

import { State } from '../store'
import {
  addTower, upgradeTower, sellTower,
  hideControl, restartGame, resumeGame, showMenu, showControl,
  startNewWave
} from '../actions'
import { TowerTypes } from '../entities/tower';
import config from '../config';
import Menu from './menu'
import Control from './control'
import TowerControl from './tower-control'
import Status from './status'
import './styles.less'

type Props = {
  state: State;
  dispatch: Dispatch;
  scene: Scenes.ScenePlugin;
}

const towers = config.towers;
const UI: React.SFC<Props> = ({ state, dispatch, scene }: Props) => {
  const activeTower: any = state.activeTower || {};
  
  return (
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

      <TowerControl
        hidden={!state.towerControlsVisible}
        isUpgradeDisabled={state.money < activeTower.price}

        level={activeTower.level}
        damage={activeTower.dps}
        
        upgradePrice={activeTower.price}
        onUpgradeButtonClick={() => dispatch(upgradeTower(scene, state.activeTower))}
        
        onSellButtonClick={() => dispatch(sellTower(scene, state.activeTower))}
        sellPrice={activeTower.price/2}
      />

    </React.Fragment>
  );
};

export default UI;
