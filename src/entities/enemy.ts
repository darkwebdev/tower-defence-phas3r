import { Scene, Physics, GameObjects, Math } from 'phaser'
import HealthBar from '../ui/health-bar'

export type EnemyProps = {
  scene: Scene;
  x: number;
  y: number;
  height: number;
  width: number;
  hp: number;
  damage: number;
  money: number;
  texture: string;
  frame: string;
  name: string;
}

const SPEED: number = 1/10000;

export default class Enemy extends GameObjects.Sprite {
  scene: Scene;
  name: string;
  collider: Physics.Arcade.Collider;
  hp: number;
  healthBar: HealthBar;
  damage: number;
  money: number;
  speed: number;
  pathT: number;
  pathVec: Math.Vector2;
  
  constructor({ scene, x, y, height, width, hp, damage, money, texture, frame, name }: EnemyProps) {
    super(scene, x, y, texture, frame);
    
    this.scene = scene;
    this.name = name;
    this.hp = hp;
    this.healthBar = new HealthBar(scene, hp, x-height, y+width);
    this.damage = damage;
    this.speed = SPEED;
    this.money = money;
    this.pathT = 0;
    this.pathVec = new Math.Vector2();

    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);
  }

  update(this: Enemy & GameObjects.GameObject, time: number, delta: number): void {
    this.pathT += this.speed * delta;
    this.scene.path.getPoint(this.pathT, this.pathVec);
    this.setPosition(this.pathVec.x, this.pathVec.y);
    this.healthBar.setTo({ x: this.x - this.height, y: this.y + this.width }, this.hp);
    // console.log('ENEMY UPDATE', this.pathT, this.pathVec, this.x, this.y)
  }
  
  onHit(this: Enemy & GameObjects.GameObject, damage: number) {
    this.hp -= damage;
    this.healthBar.setTo({ x: this.x - this.height, y: this.y + this.width }, this.hp);
    console.log('hp', this.hp, this.name)
  }
  
  onEnterHome() {
    console.log('I am home', this.name)
  }

  destroy(this: Enemy & GameObjects.GameObject) {
    console.log('/ENEMY', this.name)
    this.collider.destroy();
    this.scene.physics.world.disable(this);
    this.setActive(false);
    this.healthBar.destroy();
    this.setFrame('truck1_destroyed.png')
  }
}
