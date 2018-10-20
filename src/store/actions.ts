import { Scenes } from 'phaser'
import { action } from 'typesafe-actions'
import { AnyAction } from 'redux';

import Tower, { TowerTypes } from '../entities/tower';

export const enum ActionTypes {
  SHOW_MENU = 'show-menu',
  HIDE_PANEL = 'hide-panel',
  SHOW_PANEL = 'show-panel',
  RESUME = 'resume',
  RESTART = 'restart',
  SELECT_TOWER = 'select-tower',
  ADD_TOWER = 'add-tower',
  UPGRADE_TOWER = 'upgrade-tower',
  SELL_TOWER = 'sell-tower',
  TOWER_ADDED = 'tower-added',
  MONEY_UPDATED = 'money-updated',
  HP_UPDATED = 'hp-updated',
  NEW_WAVE = 'new-wave',
  SHOW_TOWER_CONTROLS = 'show-tower-controls',
  HIDE_TOWER_CONTROLS = 'hide-tower-controls',
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

export const hideControl = () => action(ActionTypes.HIDE_PANEL);

export const showControl = () => action(ActionTypes.SHOW_PANEL);

export const addTower = (scene: Scenes.ScenePlugin, type: TowerTypes) => {
  console.log('Entering Add-Tower mode...', type)
  
  scene.scene.events.emit(ActionTypes.ADD_TOWER, type);

  return action(ActionTypes.ADD_TOWER);
};

export const startNewWave = (scene: Scenes.ScenePlugin) => {
  console.log('Starting new wave...')

  scene.scene.events.emit(ActionTypes.NEW_WAVE);
  
  return action(ActionTypes.NEW_WAVE);
};

export const upgradeTower = (scene: Scenes.ScenePlugin, tower: Tower) => {
  console.log('Upgrading tower...')

  scene.scene.events.emit(ActionTypes.UPGRADE_TOWER, tower);

  return action(ActionTypes.UPGRADE_TOWER);
};

export const sellTower = (scene: Scenes.ScenePlugin, tower: Tower) => {
  console.log('Selling tower...')

  scene.scene.events.emit(ActionTypes.SELL_TOWER, tower);

  return action(ActionTypes.SELL_TOWER);
};

export const defaultAction = (event: AnyAction) => action(event.type, event.payload);
