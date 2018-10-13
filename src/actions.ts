import { action } from 'typesafe-actions'
import { Scenes } from 'phaser'
import { TowerTypes } from './entities/tower';
import { Action, AnyAction } from 'redux';

export const enum ActionTypes {
  SHOW_MENU = 'show-menu',
  HIDE_PANEL = 'hide-panel',
  SHOW_PANEL = 'show-panel',
  RESUME = 'resume',
  RESTART = 'restart',
  ADD_TOWER = 'add-tower',
  TOWER_ADDED = 'tower-added',
  MONEY_UPDATED = 'money-updated',
  HP_UPDATED = 'hp-updated',
  NEW_WAVE = 'new-wave',
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
  
  scene.scene.events.emit('add-tower', type);

  return action(ActionTypes.ADD_TOWER);
};

export const startNewWave = (scene: Scenes.ScenePlugin) => {
  console.log('Starting new wave...')

  scene.scene.events.emit('new-wave');
  
  return action(ActionTypes.NEW_WAVE);
};

export const defaultAction = (event: AnyAction) => action(event.type, event.payload);
