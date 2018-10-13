import {GameObjects, Math as PMath, Scene} from 'phaser'
import Enemy from '../enemy'

export const enum TowerTypes {
  TOWER_BULLET = 'tower-bullet',
  TOWER_LASER = 'tower-laser',
}

export type TowerProps = {
  scene: Scene;
  x: number;
  y: number;
  height?: number;
  width?: number;
  radius: number;
  dps: number;
  price: number;
  baseTexture: string;
  gunTexture: string;
  baseFrame?: string;
  gunFrame?: string;
  angleOffset: number;
  name: string;
}

type EnemyWithDistance = {
  enemy: Enemy & GameObjects.Sprite,
  distance: number
}

abstract class Tower extends GameObjects.GameObject{
  scene: Scene;
  base: GameObjects.Sprite;
  gun: GameObjects.Sprite;
  radius: number;
  dps: number;
  price: number;
  name: string;
  angleOffset: number = 0;
  
  constructor({ scene, x, y, baseTexture, gunTexture, baseFrame, gunFrame, radius, price, dps, name, angleOffset }: TowerProps) {
    super(scene, name);
    
    this.scene = scene;
    this.radius = radius;
    this.dps = dps;
    this.price = price;
    this.name = name;
    this.angleOffset = angleOffset;

    this.base = this.scene.add.sprite(x, y, baseTexture, baseFrame);
    this.gun = this.scene.add.sprite(x, y, gunTexture, gunFrame);
    this.gun.setDepth(1);
    
    this.scene.physics.world.enable(this.base);

    this.init();
  }
  
  init() {
    // will be overloaded by children
  }

  update(time: number, delta: number) {
    const enemies: GameObjects.GameObject[] = this.scene.enemies.getChildren().filter(e => e.active);

    const closestEnemyWithDistance: EnemyWithDistance | undefined = this.closestEnemy(enemies);
    
    if (closestEnemyWithDistance) {
      this.turnTo(closestEnemyWithDistance.enemy);
      
      if (closestEnemyWithDistance.distance < this.radius) {
        // console.log('shoot', closestEnemyWithDistance.enemy.key, closestEnemyWithDistance.distance, this.radius)
        this.shoot(closestEnemyWithDistance.enemy);
      }
    }
  }
  
  turnTo(enemy: Enemy) {
    const angle = PMath.RadToDeg(PMath.Angle.BetweenPoints(this.gun, enemy.sprite)) - this.angleOffset;
    this.gun.setAngle(angle);
    // console.log('turnTo', this.angle, this.gun.angle, this.gun.x, this.gun.y, enemy.x, enemy.y)
  }

  shoot(enemy: Enemy) {}

  closestEnemy(enemies: Enemy[]) {
    return enemies.reduce((
      closestEnemyWithDistance: EnemyWithDistance | undefined,
      currentEnemy: Enemy) => {
        const currentEnemyWithDistance = {
          enemy: currentEnemy,
          distance: PMath.Distance.Between(this.base.x, this.base.y, currentEnemy.sprite.x, currentEnemy.sprite.y)
        };
  
        if (!closestEnemyWithDistance) return currentEnemyWithDistance;
  
        return currentEnemyWithDistance.distance < closestEnemyWithDistance.distance ? currentEnemyWithDistance : closestEnemyWithDistance;
      }, undefined);
  }
}

export default Tower;
