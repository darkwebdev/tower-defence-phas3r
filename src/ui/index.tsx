import * as React from 'react'
import { Dispatch } from 'redux'
import { Scenes } from 'phaser'
import { State } from '../store'
import { resumeGame, restartGame, showMenu, addTower, hidePanel, showPanel } from '../actions'
import Menu from './menu'
import Panel from './panel'
import './styles.less'

type Props = {
  state: State;
  dispatch: Dispatch;
  scene: Scenes.ScenePlugin;
}

const UI: React.SFC<Props> = ({ state, dispatch, scene }: Props) => (
  <React.Fragment>
    <Menu
      hidden={!state.menuVisible}
      onReturn={() => { dispatch(resumeGame(scene)) }}
      onRestart={() => { dispatch(restartGame(scene)) }}
    />
    
    <Panel
      hidden={!state.panelVisible}
      onMenuButtonClick={() => { dispatch(showMenu(scene)) }}
      onHideButtonClick={() => { dispatch(hidePanel()) }}
      onShowButtonClick={() => { dispatch(showPanel()) }}
      onBulletTowerButtonClick={() => { dispatch(addTower(scene)) }}
    />
  </React.Fragment>
);

export default UI;
