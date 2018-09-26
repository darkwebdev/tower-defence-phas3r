import { AUTO, Game } from 'phaser'
import Scene from './scene'

const index = new Game({
  type: AUTO,
  width: 640,
  height: 640,
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
      gravity: { y: 0 }
    }
  },
  scene: Scene
});
