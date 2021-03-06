import { GameObjects } from 'phaser'
import Enemy from '../enemy'
import Bullet from '../bullet'
import Tower, { TowerProps } from '.';

const BULLET_POOL_SIZE: number = 5;

export default class BulletTower extends Tower {
  bullets: GameObjects.Group;
  lastFired: number;

  constructor(props: TowerProps) {
    super(props);

    this.init();
  }

  init() {
    this.lastFired = 0;

    this.bullets = this.scene.add.group({
      classType: Bullet,
      active: false,
      maxSize: BULLET_POOL_SIZE,
      runChildUpdate: true,
      createCallback: (bullet: Bullet) => {
        bullet.onHit = (bulletHit: Bullet, sprite: GameObjects.Sprite) => {
          // console.log('HIT', bulletHit, sprite.name)
          sprite.emit('onHit', bulletHit.damage);
          this.bullets.remove(<any>bulletHit, true, true);
        };
        bullet.onLost = () => {
          this.bullets.remove(<any>bullet, true, true);
          // console.log(`Bullets pool: ${this.bullets.getLength()} / ${this.bullets.maxSize}`);
        };
      }
    });
  }

  update(time: number, delta: number) {
    super.update(time, delta);

    this.lastFired++;
    this.bullets.getChildren().forEach((b: Bullet) => b.update(time, delta));
  }

  shoot(enemy: Enemy) {
    // console.log('Engaging the enemy', this, enemy)

    // DPS = bps * bullet.damage = (FPS / BULLET_DELAY) * bullet.damage
    //delay = fps / (dps/b.dmg) = (fps*b.dmg) / dps
    const delay = (60 * 5) / this.dps;
    
    if (this.lastFired > delay) {
      const bullet = this.bullets.create(this.gun.x, this.gun.y);
      
      if (bullet) {
        this.lastFired = 0;
        bullet.setTarget(enemy);
      }
      // console.log(`Bullets pool: ${this.bullets.getLength()} / ${this.bullets.maxSize}`)
    }
  }

  onDestroy(this: BulletTower & GameObjects.GameObject) {
    console.log('BULLET TOWER DESTROY')
    this.bullets.destroy(true);
  }
}
