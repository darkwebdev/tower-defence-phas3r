import { Scene, Physics, GameObjects } from 'phaser'
import Enemy from './enemy'

type Props = {
  scene: Scene,
  x: number,
  y: number,
  height?: number,
  width?: number,
  key?: string
}

export default class Tower extends GameObjects.Sprite {
  scene: Scene;
  key: string;
  
  constructor({ scene, x, y, height, width, key = 'generic tower' }: Props) {
    super(scene, x, y, key);
    
    this.scene = scene;
    this.key = key;

    this.scene.physics.world.enable(this);
  }

  update() {
  }
  
  onEnemyNearby(enemy: Enemy) {
    console.log('See the enemy!', this.key, enemy.key)
  }

  shoot(enemy: Enemy) {
    console.log('Engaging the enemy', this.key, enemy.key)
  }
}
