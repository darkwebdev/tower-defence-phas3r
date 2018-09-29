import {GameObjects, Math as PMath, Scene} from 'phaser'
import Enemy from './enemy'
import Bullet from './bullet'

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

const BULLET_POOL_SIZE: number = 5;

export default class Tower extends GameObjects.Sprite {
  scene: Scene;
  key: string;
  radius: number;
  bullets: GameObjects.Group;
  lastFired: number;
  dps: number;
  
  constructor({ scene, x, y, height, width, radius = 100, key = 'tower' }: Props) {
    super(scene, x, y, key);
    
    this.scene = scene;
    this.key = key;
    this.lastFired = 0;
    this.radius = radius;
    this.dps = 100;
    
    this.init();
  }
  
  init(this: Tower & GameObjects.Sprite) {
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

    this.scene.physics.world.enable(this);
  }

  update(this: Tower & GameObjects.Sprite, time: number, delta: number) {
    // console.log('Update tower', this.key)
    this.lastFired ++;
    const enemies: GameObjects.GameObject[] = this.scene.enemies.getChildren().filter(e => e.active);

    const closestEnemyWithDistance: EnemyWithDistance | undefined = this.closestEnemy(enemies);
    
    if (closestEnemyWithDistance && closestEnemyWithDistance.distance < this.radius) {
      // console.log('shoot', closestEnemyWithDistance.enemy, closestEnemyWithDistance.distance)
      this.shoot(closestEnemyWithDistance.enemy);
    }
    
    this.bullets.getChildren().forEach((b: Bullet) => b.update(time, delta));
  }

  shoot(this: Tower & GameObjects.Sprite, enemy: Enemy) {
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
