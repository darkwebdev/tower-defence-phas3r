import {GameObjects, Scene} from 'phaser'
import Enemy from './enemy';

type Props = {
  scene: Scene,
  x: number,
  y: number,
  speed?: number,
  damage?: number,
  target: GameObjects.GameObject,
  key?: string,
}

export default class Bullet extends GameObjects.Image {
  scene: Scene;
  x: number;
  y: number;
  speed: number;
  damage; number;
  target: GameObjects.GameObject;
  onHit: (bullet: Bullet, enemyHit: Enemy) => void;
  onLost: () => void;
  key: string;
  
  constructor(scene, x, y, key = 'bullet') {
    super(scene, x, y, key);
    
    // console.log('NEW BULLET', x, y, key)
    
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.speed = 100;
    this.damage = 5;
    this.key = key;

    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);
  }
  
  setTarget(this: Bullet & GameObjects.Image, target: GameObjects.GameObject): void {
    this.target = target;
    
    this.collider = this.scene.physics.add.overlap(
      this,
      this.target,
      (bullet, enemyHit) => this.onHit(bullet, enemyHit),
      undefined,
      this
    );
    
    // this.setActive(true);
    this.setPosition(this.x, this.y);
    console.log('MOVE BULLET', this.x, this.y, this.target.key, this.speed)
    this.scene.physics.moveToObject(this, this.target, this.speed);
  }

  update(this: Bullet & GameObjects.Image, time: number, delta: number): void {
    if (
      this.y < 0 || this.x < 0 ||
      this.y > this.scene.sys.canvas.height || this.x > this.scene.sys.canvas.width
    ) {
      console.log('bullet gets out of the screen')
      this.onLost();
    }
  }
  
  destroy(this: Bullet & GameObjects.Image): void {
    console.log('/BULLET', this.key)
    this.collider.destroy();
    this.scene.physics.world.disable(this);
    // this.scene.remove(this);
  }
}
