import * as React from 'react'
import { Dispatch } from 'redux'
import { Scenes } from 'phaser'
import Menu from './menu'
import { State } from '../store'
import { resumeGame, restartGame } from '../actions'

type Props = {
  state: State;
  dispatch: Dispatch;
  scene: Scenes.ScenePlugin;
}

const UI: React.SFC<Props> = ({ state, dispatch, scene }: Props) => (
  <Menu
    hidden={!state.menuVisible}
    onReturn={() => { dispatch(resumeGame(scene)) }}
    onRestart={() => { dispatch(restartGame(scene)) }}>
  </Menu>
);

export default UI;
