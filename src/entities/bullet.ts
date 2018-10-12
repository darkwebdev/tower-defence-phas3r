import { GameObjects, Scene } from 'phaser'
import Enemy from './enemy';

const WIDTH = 4;
const HEIGHT = 4;
const COLOR = 0xff0000;
const ALPHA = 1;
const SPEED = 300;
const DAMAGE = 5;

export default class Bullet extends GameObjects.Rectangle {
  scene: Scene;
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number = SPEED;
  damage: number = DAMAGE;
  target: GameObjects.GameObject;
  onHit: (bullet: Bullet, enemyHit: Enemy) => void;
  onLost: () => void;

  constructor(scene, x, y) {
    super(scene, x, y, WIDTH, HEIGHT, COLOR, ALPHA);

    console.log('NEW BULLET', x, y)

    this.scene = scene;
    this.x = x;
    this.y = y;
    
    this.init();
  }
  
  init(this: Bullet & GameObjects.Rectangle) {
    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);
  }

  setTarget(this: Bullet & GameObjects.Rectangle, target: GameObjects.GameObject): void {
    this.target = target;

    this.collider = this.scene.physics.add.overlap(
      this,
      this.target,
      (bullet, enemyHit) => this.onHit(bullet, enemyHit),
      undefined,
      this
    );

    this.scene.physics.moveToObject(this, this.target, this.speed);
  }

  update(this: Bullet & GameObjects.Rectangle, time: number, delta: number): void {
    if (
      this.y < 0 || this.x < 0 ||
      this.y > this.scene.sys.canvas.height || this.x > this.scene.sys.canvas.width
    ) {
      console.log('bullet gets out of the screen')
      this.onLost();
    }
  }

  destroy(this: Bullet & GameObjects.Rectangle): void {
    // console.log('/BULLET', this.key)
    if (this.collider.active) this.collider.destroy();
    this.scene.physics.world.disable(this);
    this.setVisible(false);
  }
}
