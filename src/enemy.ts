import { Scene, Physics, GameObjects } from 'phaser'

type Props = {
  scene: Scene,
  x: number,
  y: number,
  height?: number,
  width?: number,
  key?: string
}

export default class Enemy extends GameObjects.Sprite {
  scene: Scene;
  collider: Physics.Arcade.Collider;
  key: string;
  
  constructor({ scene, x, y, height, width, key = 'generic enemy' }: Props) {
    super(scene, x, y, key);
    
    this.scene = scene;
    this.key = key;

    this.scene.physics.world.enable(this);
  }

  update() {
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
