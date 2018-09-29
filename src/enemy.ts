import { Scene, Physics, GameObjects, Math } from 'phaser'
import HealthBar from './health-bar'

type Props = {
  scene: Scene,
  x: number,
  y: number,
  height?: number,
  width?: number,
  hp?: number,
  damage?: number,
  key?: string
}

const SPEED: number = 1/10000;

export default class Enemy extends GameObjects.Sprite {
  scene: Scene;
  collider: Physics.Arcade.Collider;
  hp: number;
  healthBar: HealthBar;
  damage: number;
  speed: number;
  key: string;
  pathT: number;
  pathVec: Math.Vector2;
  
  constructor({ scene, x, y, height = 30, width = 30, hp = 100, damage = 10, key = 'generic enemy' }: Props) {
    super(scene, x, y, key);
    
    this.scene = scene;
    this.hp = hp;
    this.healthBar = new HealthBar(scene, hp, x-height, y+width);
    this.damage = damage;
    this.speed = SPEED;
    this.key = key;
    this.pathT = 0;
    this.pathVec = new Math.Vector2();

    this.scene.physics.world.enable(this);
  }

  update(this: Enemy & GameObjects.GameObject, time: number, delta: number): void {
    this.pathT += this.speed * delta;
    this.scene.path.getPoint(this.pathT, this.pathVec);
    this.setPosition(this.pathVec.x, this.pathVec.y);
    // console.log('ENEMY UPDATE', this.pathT, this.pathVec, this.x, this.y)
  }
  
  onHit(this: Enemy & GameObjects.GameObject, damage: number) {
    this.hp -= damage;
    this.healthBar.setTo(this.hp, this.x - this.height, this.y + this.width);
    console.log('hp', this.hp, this.key)
  }
  
  onEnterHome() {
    console.log('I am home', this.key)
  }

  destroy(this: Enemy & GameObjects.GameObject) {
    console.log('/ENEMY', this.key)
    this.collider.destroy();
    this.scene.physics.world.disable(this);
    this.setActive(false);
    this.healthBar.destroy();
  }
}
