import { Scene, GameObjects, Input } from 'phaser'
import { ActionTypes } from '../store/actions';
import { TowerTypes } from '../entities/tower';
import Tower from '../entities/tower';

export default function(scene: Scene) {
  scene.events
    .on(ActionTypes.ADD_TOWER, (type: TowerTypes) => {
      scene.enterAddTowerMode(type);
    })
    .on(ActionTypes.TOWER_ADDED, () => {
      scene.exitAddTowerMode();
    })
    .on(ActionTypes.SELECT_TOWER, (tower: Tower) => {
      scene.deselectAllTowers();
      scene.selectTower(tower);
      scene.events.emit(ActionTypes.SHOW_TOWER_CONTROLS, tower);
    })
    .on(ActionTypes.UPGRADE_TOWER, (tower: Tower) => {
      tower.upgrade();
      scene.changeMoney(-tower.price);//todo: upgradePrice
    })
    .on(ActionTypes.SELL_TOWER, (tower: Tower) => {
      scene.deselectAllTowers();
      scene.changeMoney(tower.price/2);//todo: sellPrice
      tower.remove();
    })
    .on(ActionTypes.NEW_WAVE, () => {
      console.log('New wave coming...')
      scene.spawnWave();
    });

  scene.input.keyboard.on('keydown', (event: KeyboardEvent) => {
    switch(event.code) {
      case 'Escape':
        console.log('ESC');
        scene.events.emit(ActionTypes.SHOW_MENU);
        break;
    }
  });

  scene.input
    // .setTopOnly(false)
    .on('gameobjectdown', (pointer: Input.Pointer, gameObject: GameObjects.GameObject) => {
      console.log('click', gameObject)
    });
}
