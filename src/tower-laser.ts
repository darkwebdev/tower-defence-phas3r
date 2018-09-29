import {GameObjects, Scene, Geom} from 'phaser'
import Enemy from './enemy'
import Tower, { TowerType } from './tower';

type Props = {
  scene: Scene,
  x: number,
  y: number,
  key?: string,
}

export default class LaserTower extends Tower {
  scene: Scene;
  key: string;
  radius: number;
  dps: number;
  laserGraphics: GameObjects.Graphics;
  laserLine: Geom.Line;
  target: Enemy;

  constructor({ scene, x, y, key = 'bullet-tower' }: Props) {
    super({ scene, x, y, key });

    this.scene = scene;
    this.key = key;

    this.init();
  }

  init(this: LaserTower & GameObjects.Sprite) {
    this.radius = 200;
    this.dps = 50;
    this.laserGraphics = this.scene.add.graphics({lineStyle: {width: 2, color: 0xFF0000}});
  }

  update(this: LaserTower & GameObjects.Sprite, time: number, delta: number) {
    super.update(time, delta);

    this.laserGraphics.clear();

    if (this.target && this.target.active) {
      console.log('LASER on', this.target)
      this.laserGraphics.lineBetween(this.x, this.y, this.target.x, this.target.y);
      this.target.onHit(this.dps / 60);
    }
  }

  shoot(this: LaserTower & GameObjects.Sprite, enemy: Enemy & GameObjects.GameObject) {
    console.log('Engaging the enemy', this.key, enemy.key)
    this.target = enemy;
  }
}
