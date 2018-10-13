import { Scene, Physics, GameObjects, Math as PMath } from 'phaser'
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
  angleOffset: number;
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
  pathVec: PMath.Vector2;
  angleOffset: number;
  
  constructor({ scene, x, y, height, width, hp, damage, money, texture, frame, angleOffset, name }: EnemyProps) {
    super(scene, x, y, texture, frame);
    
    this.scene = scene;
    this.name = name;
    this.hp = hp;
    this.healthBar = new HealthBar(scene, hp, x-height, y+width);
    this.damage = damage;
    this.speed = SPEED;
    this.money = money;
    this.pathT = 0;
    this.pathVec = new PMath.Vector2();
    this.angleOffset = angleOffset;

    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);
  }

  update(this: Enemy & GameObjects.GameObject, time: number, delta: number): void {
    this.pathT += this.speed * delta;
    this.scene.path.getPoint(this.pathT, this.pathVec);
    const angle = PMath.RadToDeg(PMath.Angle.Between(this.x, this.y, this.pathVec.x, this.pathVec.y)) - this.angleOffset;
    this.setAngle(angle);
    this.setPosition(this.pathVec.x, this.pathVec.y);
    this.healthBar.setTo({ x: this.x - this.height, y: this.y + this.width }, this.hp);
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
