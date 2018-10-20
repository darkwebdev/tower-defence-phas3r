import { GameObjects, Math as PMath, Scene } from 'phaser'
import Enemy from '../enemy'
import { ActionTypes } from '../../store/actions';

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

abstract class Tower extends GameObjects.GameObject {
  scene: Scene;
  base: GameObjects.Sprite;
  gun: GameObjects.Sprite;
  level: number = 1;
  coverageArea: GameObjects.Arc;
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
    
    this.createCoverageArea();

    this.init();
    this.attachHandlers();
    
    console.log('TOWER', this)
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

  upgrade() {
    this.level += 1;
    this.radius *= 1.5;
    this.dps *= 1.5;
    this.price *= 2;
    this.createCoverageArea().showCoverage();
    console.log('Upgraded tower', this.name, this.radius, this.dps)
  }
  
  createCoverageArea() {
    if (this.coverageArea) {
      this.coverageArea.destroy();
    }
    
    this.coverageArea = this.scene.add
      .circle(this.base.x, this.base.y, this.radius, 0x00ff00, 0.2)
      .setStrokeStyle(1, 0x00ff00)
      .setVisible(false);
    
    return this;
  }
  
  showCoverage() {
    this.coverageArea.setVisible(true);
  }

  hideCoverage() {
    this.coverageArea.setVisible(false);
  }
  
  turnTo(enemy: Enemy) {
    const angle = PMath.RadToDeg(PMath.Angle.BetweenPoints(this.gun, enemy.sprite)) - this.angleOffset;
    this.gun.setAngle(angle);
  }

  shoot(enemy: Enemy) {
    // will be overloaded by children
  }

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

  attachHandlers(this: Tower & GameObjects.GameObject) {
    this.base.setInteractive();
    this.base.on('pointerdown', () => {
      console.log('pointerdown', this)
      this.scene.events.emit(ActionTypes.SELECT_TOWER, this);
    });
  }
  
  remove(this: Tower & GameObjects.GameObject) {
    console.log('TOWER DESTROY')
    this.destroy();
    this.base.destroy();
    this.gun.destroy();
    this.coverageArea.destroy();
    this.onDestroy();
  }
  
  onDestroy(this: Tower & GameObjects.GameObject) {
    // will be overloaded by children
  }
}

export default Tower;
