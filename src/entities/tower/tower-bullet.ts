import {GameObjects, Scene} from 'phaser'
import Enemy from '../enemy'
import Bullet from '../bullet'
import Tower from '.';

type Props = {
  scene: Scene,
  x: number,
  y: number,
  key?: string,
}

const BULLET_POOL_SIZE: number = 5;

export default class BulletTower extends Tower {
  scene: Scene;
  key: string;
  radius: number;
  bullets: GameObjects.Group;
  lastFired: number;
  dps: number;
  
  constructor({ scene, x, y, key = 'bullet-tower' }: Props) {
    super({ scene, x, y });
    
    this.scene = scene;
    this.key = key;
    this.lastFired = 0;
    this.radius = 100;
    this.dps = 10;
    
    this.init();
  }
  
  init(this: BulletTower & GameObjects.Sprite) {
    this.bullets = this.scene.add.group({
      classType: Bullet,
      active: false,
      maxSize: BULLET_POOL_SIZE,
      runChildUpdate: true,
      createCallback: (bullet: Bullet) => {
        // console.log('BULLET CALLBACK')
        bullet.onHit = (bulletHit: Bullet, enemyHit: Enemy) => {
          console.log('HIT', bulletHit.key, enemyHit.key)
          enemyHit.onHit(bulletHit.damage);
          this.bullets.remove(<any>bulletHit, true, true);
          // bulletHit.destroy();
        };
        bullet.onLost = () => {
          // console.log('bullet lost')
          this.bullets.remove(<any>bullet, true, true);
          this.scene.textPool.setText(`Bullets pool: ${this.bullets.getLength()} / ${this.bullets.maxSize}`);
          // bullet.destroy();
        };
        // console.log('/BULLET CALLBACK')
      }
    });
  }

  update(this: BulletTower & GameObjects.Sprite, time: number, delta: number) {
    super.update(time, delta);
    
    this.lastFired ++;
    this.bullets.getChildren().forEach((b: Bullet) => b.update(time, delta));
  }

  shoot(this: BulletTower & GameObjects.Sprite, enemy: Enemy) {
    console.log('Engaging the enemy', this.key, enemy.key)

    // DPS = bps * bullet.damage = (FPS / BULLET_DELAY) * bullet.damage
    //delay = fps / (dps/b.dmg) = (fps*b.dmg) / dps
    const delay = (60 * 5) / this.dps;
    if (this.lastFired > delay) {
      const bullet = this.bullets.create(this.x, this.y, 'bullet-' + this.bullets.children.size);
      if (bullet) {
        console.log('BULLET', this.x, this.y)
        this.lastFired = 0;
        bullet.setTarget(enemy);
      }
      console.log(`Bullets pool: ${this.bullets.getLength()} / ${this.bullets.maxSize}`)
      this.scene.textPool.setText(`Bullets pool: ${this.bullets.getLength()} / ${this.bullets.maxSize}`);
    }
  }
}
