import { action } from 'typesafe-actions'
import { Scenes } from 'phaser'

export const enum ActionTypes {
  SHOW_MENU = 'show-menu',
  RESUME = 'resume',
  RESTART = 'restart'
}

export const showMenu = (scene: Scenes.ScenePlugin) => {
  console.log('Pausing game...')
  scene.pause();
  
  return action(ActionTypes.SHOW_MENU);
};

export const resumeGame = (scene: Scenes.ScenePlugin) => {
  console.log('Resuming game...')
  scene.resume();
  
  return action(ActionTypes.RESUME);
} ;

export const restartGame = (scene: Scenes.ScenePlugin) => {
  console.log('Restarting game...')
  scene.restart();
  
  return action(ActionTypes.RESTART);
} ;
