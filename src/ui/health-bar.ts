import { GameObjects, Math as PhaserMath } from 'phaser';

const BORDER_THICKNESS = 1;
const BORDER_COLOR = 0x000000;
const BG_COLOR = 0xffffff;
const LOW_HP_COLOR = 0xff0000;
const NORMAL_HP_COLOR = 0x00ff00;

export default class HealthBar extends GameObjects.GameObject {
  bar: GameObjects.Graphics;
  value: number;
  maxValue: number;
  x: number;
  y: number;
  
  width = 50;
  height = 5;

  constructor(scene, maxValue, x, y) {
    super(scene, 'health-bar');
    
    // console.log('HEALTH', x, y)
    
    this.bar = new GameObjects.Graphics(scene);

    this.maxValue = maxValue;
    this.setTo({ x, y }, maxValue);
    this.draw();

    scene.add.existing(this.bar);
  }

  setTo(this: HealthBar & GameObjects.GameObject, { x, y }: PhaserMath.Vector2, value: number) {
    this.x = x - this.width/2;
    this.y = y;
    
    if (value) {
      this.value = value < 0 ? 0 : value;
      this.draw();
    }
  }

  update(this: HealthBar & GameObjects.GameObject) {}
  
  draw(this: HealthBar & GameObjects.GameObject) {
    this.bar.clear();

    this.bar.fillStyle(BORDER_COLOR);
    this.bar.fillRect(this.x, this.y, this.width, this.height);

    this.bar.fillStyle(BG_COLOR);
    const innerX = this.x + BORDER_THICKNESS;
    const innerY = this.y + BORDER_THICKNESS;
    const innerHeight = this.height - BORDER_THICKNESS*2;
    const innerWidth = this.width - BORDER_THICKNESS*2;
    this.bar.fillRect(innerX, innerY, innerWidth, innerHeight);

    this.bar.fillStyle(this.value < 30 ? LOW_HP_COLOR : NORMAL_HP_COLOR);
    const hpWidth = Math.floor((innerWidth / this.maxValue) * this.value);
    this.bar.fillRect(innerX, innerY, hpWidth, innerHeight);
  }
  
  destroy(this: HealthBar & GameObjects.GameObject) {
    this.bar.destroy();
  }
}
