import { action } from 'typesafe-actions'
import { Scenes } from 'phaser'

export const enum ActionTypes {
  SHOW_MENU = 'show-menu',
  HIDE_PANEL = 'hide-panel',
  SHOW_PANEL = 'show-panel',
  RESUME = 'resume',
  RESTART = 'restart',
  ADD_TOWER = 'add-tower',
}

export const showMenu = (scene: Scenes.ScenePlugin) => {
  scene.pause();
  
  return action(ActionTypes.SHOW_MENU);
};

export const resumeGame = (scene: Scenes.ScenePlugin) => {
  scene.resume();
  
  return action(ActionTypes.RESUME);
};

export const restartGame = (scene: Scenes.ScenePlugin) => {
  scene.restart();
  
  return action(ActionTypes.RESTART);
};

export const hidePanel = () => action(ActionTypes.HIDE_PANEL);

export const showPanel = () => action(ActionTypes.SHOW_PANEL);

export const addTower = (scene: Scenes.ScenePlugin) => {
  console.log('Entering Add-Tower mode...')
  
  scene.scene.events.emit('add-tower');

  return action(ActionTypes.ADD_TOWER);
};
