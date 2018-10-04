import { GameObjects, Scene, Scenes } from 'phaser';
import Button from '../ui/button'

export default class SceneMenu extends Scene {
  text: GameObjects.Text;

  constructor(config: Scenes.Settings.Config) {
    super({
      key: 'scene-menu',
      active: true
    });
  }

  create(this: Scene & SceneMenu) {
    this.createTitle();
    this.createButtons();
  }
  
  createButtons(this: SceneMenu & Scene) {
    const resumeButton = this.add.existing(new Button({scene: this, x: 256, y: 16, text: 'Resume game'}));
    resumeButton.once('pointerup', () => {
      // this.scene.resume('sceneA');
      console.log('RESUME')
      this.scene.switch('scene-game');
    });

    const restartButton = this.add.existing(new Button({scene: this, x: 256, y: 64, text: 'Restart'}));
    restartButton.once('pointerup', () => {
      console.log('RESTART');
      this.scene.stop('scene-game');
      this.scene.start('scene-game');
      this.scene.switch('scene-game');
    });

    this.input.keyboard.on('keydown', event => {
      switch(event.code) {
        case 'Escape':
          console.log('RESUME');
          // this.scene.pause();
          // this.scene.resume('scene-game');
          // this.scene.sendToBack();
          break;
      }
    });
  }

  createTitle(this: SceneMenu & Scene) {
    const textStyle = {};

    this.text = this.add.text(16, 16, 'Menu', textStyle);
  }
}
