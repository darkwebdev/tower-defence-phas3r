import { render } from 'react-dom'
import { AUTO, Game, Scene } from 'phaser'
import SceneGame, { SCENE_KEY } from './scene/scene-game'
import UI from './ui'
import Store, { State } from './store'
import reducer from './reducer'
import { ActionTypes, showMenu } from './actions';

let scene: Scene;

const store = Store(reducer);
store.subscribe(renderUI);

const game = new Game({
  type: AUTO,
  width: 640,
  height: 640,
  render: {
    pixelArt: true
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 0 }
    }
  },
  scene: [ SceneGame ],
  callbacks: {
    postBoot() {
      scene = game.scene.getScene(SCENE_KEY);
      
      renderUI();
      
      scene.events.on(ActionTypes.SHOW_MENU, () => {
        store.dispatch(showMenu(scene.scene));
      });
      
      [
        ActionTypes.HP_UPDATED,
        ActionTypes.MONEY_UPDATED,
      ].forEach(type => {
        scene.events.on(type, payload => {
          store.dispatch({ type, payload });
        })
      })
    }
  }
});

//game.scene.add(SCENE_KEY, SceneGame);

function renderUI() {
  const state: State = store.getState();
  console.log('RENDER UI', state)
  
  render(
    UI({ state, dispatch: store.dispatch, scene: scene.scene }),
    document.querySelector('.ui')
  );
}
