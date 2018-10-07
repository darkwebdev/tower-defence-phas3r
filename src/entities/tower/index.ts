import {GameObjects, Math as PMath, Scene} from 'phaser'
import Enemy from '../enemy'

export const enum TowerTypes {
  TOWER_BULLET = 'tower-bullet',
  TOWER_LASER = 'tower-laser',
}

type Props = {
  scene: Scene,
  x: number,
  y: number,
  height?: number,
  width?: number,
  radius?: number,
  key?: string,
}

type EnemyWithDistance = {
  enemy: Enemy & GameObjects.Sprite,
  distance: number
}

abstract class Tower extends GameObjects.Sprite {
  scene: Scene;
  key: string;
  radius: number;
  
  constructor({ scene, x, y, key = 'tower' }: Props) {
    super(scene, x, y, key);
    
    this.scene = scene;
    this.key = key;
    
    this.init();

    this.scene.physics.world.enable(this);
  }
  
  init(this: Tower & GameObjects.Sprite) {
  }

  update(this: Tower & GameObjects.Sprite, time: number, delta: number) {
    const enemies: GameObjects.GameObject[] = this.scene.enemies.getChildren().filter(e => e.active);

    const closestEnemyWithDistance: EnemyWithDistance | undefined = this.closestEnemy(enemies);
    
    if (closestEnemyWithDistance && closestEnemyWithDistance.distance < this.radius) {
      // console.log('shoot', closestEnemyWithDistance.enemy, closestEnemyWithDistance.distance)
      this.shoot(closestEnemyWithDistance.enemy);
    }
  }

  shoot(this: Tower & GameObjects.Sprite, enemy: Enemy) {
  }

  closestEnemy(this: Tower & GameObjects.Sprite, enemies: Enemy[]) {
    return enemies.reduce((
      closestEnemyWithDistance: EnemyWithDistance | undefined,
      currentEnemy: Enemy & GameObjects.Sprite) => {
        const currentEnemyWithDistance = {
          enemy: currentEnemy,
          distance: PMath.Distance.Between(this.x, this.y, currentEnemy.x, currentEnemy.y)
        };
  
        if (!closestEnemyWithDistance) return currentEnemyWithDistance;
  
        return currentEnemyWithDistance.distance < closestEnemyWithDistance.distance ? currentEnemyWithDistance : closestEnemyWithDistance;
      }, undefined);
  }
}

export default Tower;
