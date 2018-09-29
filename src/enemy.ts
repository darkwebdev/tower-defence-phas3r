import { Scene, Physics, GameObjects } from 'phaser'

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
  damage: number;
  speed: number;
  key: string;
  
  constructor({ scene, x, y, height, width, hp = 50, damage = 10, key = 'generic enemy' }: Props) {
    super(scene, x, y, key);
    
    this.scene = scene;
    this.hp = hp;
    this.damage = damage;
    this.speed = SPEED;
    this.key = key;

    this.scene.physics.world.enable(this);
  }

  update(this: Enemy & GameObjects.GameObject): void {
    // console.log('ENEMY UPDATE')
  }
  
  onHit(damage: number) {
    this.hp -= damage;
    console.log('hp', this.hp, this.key)
  }
  
  onEnterHome() {
    console.log('I am home', this.key)
  }

  destroy() {
    console.log('I am destroyed', this.key)
    this.collider.destroy();
    this.scene.physics.world.disable(this);
  }
}
