import { GameObjects, Scene } from 'phaser'
import Enemy from '../enemy'
import Tower from '.';

const FPS = 60;

type Props = {
  scene: Scene,
  x: number,
  y: number,
  key?: string,
}

export default class LaserTower extends Tower {
  key: string;
  radius: number;
  dps: number;
  laser: GameObjects.Graphics;
  target: Enemy;

  constructor({ scene, x, y, key = 'bullet-tower' }: Props) {
    super({ scene, x, y, key });

    this.laser = scene.add.graphics({ lineStyle: { width: 2, color: 0xFF0000 } });
    this.key = key;
    this.radius = 200;
    this.dps = 10;

    this.init();
  }

  init(this: LaserTower & GameObjects.Sprite) {
  }

  update(this: LaserTower & GameObjects.Sprite, time: number, delta: number) {
    super.update(time, delta);

    this.laser.clear();

    if (this.target && this.target.active) {
      console.log('LASER on', this.target.key)
      this.laser.lineBetween(this.x, this.y, this.target.x, this.target.y);
      this.target.onHit(this.dps / FPS);
    }
  }

  shoot(this: LaserTower & GameObjects.Sprite, enemy: Enemy & GameObjects.GameObject) {
    console.log('Engaging the enemy', this.key, enemy.key)
    this.target = enemy;
  }
}
