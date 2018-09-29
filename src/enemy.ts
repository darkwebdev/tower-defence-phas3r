import { Scene, Physics, GameObjects } from 'phaser'
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

const SPEED: number = 20;

export default class Enemy extends GameObjects.Sprite {
  scene: Scene;
  collider: Physics.Arcade.Collider;
  hp: number;
  healthBar: HealthBar;
  damage: number;
  speed: number;
  key: string;
  
  constructor({ scene, x, y, height = 30, width = 30, hp = 100, damage = 10, key = 'generic enemy' }: Props) {
    super(scene, x, y, key);
    
    this.scene = scene;
    this.hp = hp;
    this.healthBar = new HealthBar(scene, hp, x-height, y+width);
    this.damage = damage;
    this.speed = SPEED;
    this.key = key;

    this.scene.physics.world.enable(this);
  }

  update(this: Enemy & GameObjects.GameObject): void {
    console.log('ENEMY UPDATE')
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
