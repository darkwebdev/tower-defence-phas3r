import { GameObjects, Physics, Scene, Tilemaps, Time, Curves, Input } from 'phaser'
import Enemy from '../entities/enemy'
import BulletTower from '../entities/tower/tower-bullet'
import LaserTower from '../entities/tower/tower-laser'
import { ActionTypes } from '../actions';

const FONT = '18px monospace';
const TEXT_PADDING = { x: 20, y: 10 };
const TEXT_COLOR = '#ffffff';
const TEXT_BG = '#000000';

export const SCENE_KEY = 'scene-game';

export default class SceneGame extends Scene {
  text: GameObjects.Text;
  textPool: GameObjects.Text;
  hp: number;
  gameOver: boolean;
  home: Physics.Arcade.Image;
  enemies: GameObjects.Group;
  towers: GameObjects.Group;
  enemyRespawn: Time.TimerEvent;
  waveSize: number;
  path: Curves.Path;
  tilemap: Tilemaps.Tilemap;
  
  constructor() {
    console.log('Called:', 'constructor', arguments);
    super({
      key: SCENE_KEY,
      active: false,
      // plugins: [ 'Input', 'Loader', 'Time' ]
    });
  }

  preload(this: Scene & SceneGame) {
    this.load.image('tiles', 'map/td.png');
    this.load.tilemapTiledJSON('level1', 'map/td-map.json');
    this.load.image('enemy', 'images/enemy.png');
    this.load.image('bullet', 'images/bullet.png');
  }

  init(this: Scene & SceneGame) {
    this.enemies = this.add.group({
      runChildUpdate: true,
      createCallback: this.onEnemySpawn.bind(this),
    });
    
    this.towers = this.add.group({
      runChildUpdate: true
    });
    
    this.waveSize = 2;
  }
  
  create(this: Scene & SceneGame) {
    this.tilemap = this.make.tilemap({ key: 'level1', tileHeight: 20, tileWidth: 20 });
    
    this.createPath();
    this.createHome();
    
    this.createTowers();
    this.createEnemies();

    this.createText();
    this.attachKeyHandlers();
    this.attachEventHandlers();
  }

  update(time: number, delta: number) {
    if (this.gameOver) return;

    this.enemies.getChildren().forEach(e => {
      if (e.hp <= 0) {
        this.enemies.remove(<any>e, true, true); // possible race condition?
      }
    });
    
    if (this.hp <= 0) {
      this.gameOver = true;
    }
  }
  
  createHome(this: SceneGame & Scene) {
    const homes: GameObjects.Sprite[] = this.tilemap.createFromObjects('allies', 'home', {});
    const homeTemplate = homes[0];
    this.home = this.physics.add
      .image(homeTemplate.x, homeTemplate.y, 'enemy')
      .setSize(homeTemplate.width,homeTemplate.height);

    this.hp = 100;
  }
  
  createTowers(this: SceneGame & Scene) {
    const bulletTowers: GameObjects.Sprite[] = this.tilemap.createFromObjects('towers', 'Bullet tower', {});
    bulletTowers.forEach(({ x, y }) => {
      const tower = new BulletTower({ scene: this, x, y, key: `tower-${this.towers.children.size}` });
      this.towers.add(tower);
      console.log('New bullet tower spawned', tower.key)
    });

    const laserTowers: GameObjects.Sprite[] = this.tilemap.createFromObjects('towers', 'Laser tower', {});
    laserTowers.forEach(({ x, y }) => {
      const tower = new LaserTower({ scene: this, x, y, key: `tower-${this.towers.children.size}` });
      this.towers.add(tower);
      console.log('New laser tower spawned', tower.key)
    });
  }

  createEnemies(this: SceneGame & Scene) {
    const enemies = this.tilemap.createFromObjects('enemies', 'enemy', {});
    const enemyTemplate: GameObjects.Sprite = enemies[0];

    this.enemyRespawn = this.time.addEvent({
      delay: 5000,
      callback: () => this.spawnEnemy(enemyTemplate),
      callbackScope: this,
      repeat: this.waveSize-1
    });
  }
  
  spawnEnemy({ x, y, width, height }: GameObjects.Sprite): void {
    const enemy = new Enemy({ scene: this, x, y, key: `enemy-${this.enemies.children.size}` });
    this.enemies.add(enemy);
    console.log('New enemy spawned', enemy.key)
  }
  
  createPath(this: SceneGame & Scene) {
    const tileset: Tilemaps.Tileset = this.tilemap.addTilesetImage('td', 'tiles');
    this.tilemap.createStaticLayer("terrain", tileset, 0, 0);

    this.path = this.add.path(96, -32);
    this.path.lineTo(96, 164);
    this.path.lineTo(480, 164);
    this.path.lineTo(480, 544);

    const graphics = this.add.graphics();
    graphics.lineStyle(3, 0xffffff, 1);
    this.path.draw(graphics);
  }
  
  createText(this: SceneGame & Scene) {
    const textStyle = {
      font: FONT,
      fill: TEXT_BG,
      padding: TEXT_PADDING,
      backgroundColor: TEXT_COLOR
    };
    this.text = this.add
      .text(16, 16, 'Enemy is coming!', textStyle)
      .setScrollFactor(0);

    this.textPool = this.add
      .text(16, 64, 'Bullet pool', textStyle)
      .setScrollFactor(0);
  }

  onEnemySpawn(this: Scene & SceneGame, enemy: Enemy): void {
    console.log('Enemy spawned', enemy.key)
    enemy.collider = this.physics.add.overlap(
      enemy,
      this.home,
      this.onEnemyEnter,
      undefined,
      this
    );
  }
  
  onEnemyEnter(enemy: Enemy): void {
    this.hp -= enemy.damage;

    console.log('Enemy is inside!', enemy.key, this.hp);
    this.text.setText('Enemy inside. HP: ' + this.hp);

    enemy.onEnterHome();
    this.enemies.remove(<any>enemy, true, true);
  }

  activateAddTowerMode(this: SceneGame & Scene) {
    const tileWidth = this.tilemap.tileWidth;
    const tileHeight = this.tilemap.tileHeight;
    
    const marker = this.add.graphics();
    marker.lineStyle(3, 0xff0000, 1);
    marker.strokeRect(0, 0, tileWidth, tileHeight);

    this.input.on('pointermove', (pointer: Input.Pointer) => {
      const tile: Tilemaps.Tile = this.tilemap.getTileAtWorldXY(pointer.x, pointer.y);

      if (tile) {
        marker.x = tile.pixelX;
        marker.y = tile.pixelY;
      }
    });

    this.input.on('pointerdown', (pointer: Input.Pointer) => {
      const x = marker.x + tileWidth/2;
      const y = marker.y + tileHeight/2;
      const tower = new BulletTower({ scene: this, x, y, key: `tower-${this.towers.children.size}` });
      this.towers.add(tower);
      console.log('New bullet tower spawned', tower.key)
    })
  }
  
  attachEventHandlers(this: SceneGame & Scene) {
    this.events.on('add-tower', () => {
      console.log('Entering add-tower mode...')
      this.activateAddTowerMode();
    })
  }
  
  attachKeyHandlers(this: SceneGame & Scene) {
    this.input.keyboard.on('keydown', event => {
      switch(event.code) {
        case 'Escape':
          console.log('ESC');
          this.events.emit(ActionTypes.SHOW_MENU);
          break;
      }
    });
  }
}

