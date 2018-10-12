import { GameObjects } from 'phaser'
import Enemy from '../enemy'
import Tower, { TowerProps } from '.';

const FPS = 60;

export default class LaserTower extends Tower {
  laser: GameObjects.Graphics;
  target: Enemy;

  constructor(props: TowerProps) {
    super(props);

    this.init();
  }

  init(this: LaserTower & GameObjects.Sprite) {
    this.laser = this.scene.add.graphics({ lineStyle: { width: 2, color: 0xFF0000 } });
  }

  update(this: LaserTower & GameObjects.Sprite, time: number, delta: number) {
    this.target = undefined;
    this.laser.clear();
    
    super.update(time, delta);

    if (this.target && this.target.active) {
      // console.log('LASER on', this.x, this.y, this.target.x, this.target.y)
      this.laser.lineBetween(this.gun.x, this.gun.y, this.target.x, this.target.y);
      this.target.onHit(this.dps / FPS);
    }
  }

  shoot(this: LaserTower & GameObjects.Sprite, enemy: Enemy & GameObjects.GameObject) {
    console.log('Engaging the enemy', this.texture, enemy.texture)
    this.target = enemy;
  }
}
