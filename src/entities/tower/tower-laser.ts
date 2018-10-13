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

  init() {
    this.laser = this.scene.add.graphics({ lineStyle: { width: 2, color: 0xFF0000 } });
  }

  update(time: number, delta: number) {
    this.target = undefined;
    this.laser.clear();
    
    super.update(time, delta);

    if (this.target && this.target.sprite.active) {
      // console.log('LASER on', this.x, this.y, this.target.x, this.target.y)
      this.laser.lineBetween(this.gun.x, this.gun.y, this.target.sprite.x, this.target.sprite.y);
      this.target.onHit(this.dps / FPS);
    }
  }

  shoot(this: LaserTower & GameObjects.Sprite, enemy: Enemy & GameObjects.GameObject) {
    // console.log('Engaging the enemy', this.name, enemy.name)
    this.target = enemy;
  }
}
