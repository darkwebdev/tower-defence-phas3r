import { Scene, GameObjects } from 'phaser'

type Props = {
  scene: Scene;
  x: number;
  y: number;
  text: string;
}

const defaultStyle = {
  font: '18px monospace',
  fill: '#000000',
  padding: { x: 20, y: 10 },
  backgroundColor: '#ffffff'
};

const hoverStyle = {
  ...defaultStyle,
  backgroundColor: '#dddddd'
};

const activeStyle = {
  ...defaultStyle,
  backgroundColor: '#dddddd',
  fill: '#333333'
};

export default class Button extends GameObjects.Text {
  text: string;
  style: object;
  
  constructor({ scene, x, y, text }: Props) {
    super(scene, x, y, text, defaultStyle);
    
    this.text = text;
    
    this.init();
  }
  
  init(this: Button & GameObjects.Text) {
    this.resetStyle();
    this.setInteractive({useHandCursor: true});
    this.on('pointerover', this.onHover);
    this.on('pointerout', this.resetStyle);
    this.on('pointerdown', this.onActive);
    this.on('pointerup', this.resetStyle);
  }

  resetStyle(this: Button & GameObjects.Text) {
    this.style = defaultStyle;
  }
  
  onHover(this: Button & GameObjects.Text) {
    this.style = hoverStyle;
  }

  onActive(this: Button & GameObjects.Text) {
    this.style = activeStyle;
  }
} 
