import { Curves, GameObjects, Physics, Scene, Tilemaps, Time, Math } from 'phaser'
import Enemy from '../entities/enemy'
import BulletTower from '../entities/tower/tower-bullet'
import LaserTower from '../entities/tower/tower-laser'
import { ActionTypes } from '../actions';
import { TowerTypes, TowerProps } from '../entities/tower';

export const SCENE_KEY = 'scene-game';

export default class SceneGame extends Scene {
  hp: number;
  money: number;
  gameOver: boolean;
  home: Physics.Arcade.Image;
  enemies: GameObjects.Group;
  towers: GameObjects.Group;
  enemyRespawn: Time.TimerEvent;
  waveSize: number;
  path: Curves.Path;
  tilemap: Tilemaps.Tilemap;
  marker: GameObjects.Graphics;
  config: object;
  
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
    this.load.json('config', 'config.json');
  }

  init(this: Scene & SceneGame) {
    this.enemies = this.add.group({
      runChildUpdate: true,
      createCallback: this.onEnemySpawn.bind(this),
    });
    
    this.towers = this.add.group({
      runChildUpdate: true
    });
  }
  
  create(this: Scene & SceneGame) {
    this.config = this.cache.json.get('config');
    this.waveSize = this.config.levels[0].waveSize;
    this.money = this.config.start.money;

    this.tilemap = this.make.tilemap({ key: 'level1', tileHeight: 20, tileWidth: 20 });
    
    this.createPath();
    this.createHome();
    
    // this.createTowers();
    this.createEnemies();

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

    enemy.onEnterHome();
    this.enemies.remove(<any>enemy, true, true);
  }

  enterAddTowerMode(this: SceneGame & Scene, type: TowerTypes) {
    this.marker = this.add.graphics();
    
    const onPointerDown = {
      [TowerTypes.TOWER_BULLET]: this.putBulletTowerAt,
      [TowerTypes.TOWER_LASER]: this.putLaserTowerAt,
    }[type];

    this.input.on('pointermove', this.highlightTileAt, this);
    this.input.on('pointerdown', onPointerDown, this);
  }
  
  putTowerAt(this: SceneGame & Scene, { x, y }: Math.Vector2, type: TowerTypes) {
    const tile: Tilemaps.Tile = this.tilemap.getTileAtWorldXY(x, y);
    
    if (!tile || !this.isBuildableTile(tile)) return;
    
    const towerX = tile.pixelX + this.tilemap.tileWidth/2;
    const towerY = tile.pixelY + this.tilemap.tileHeight/2;
    const key = `tower-${this.towers.children.size}`;
    
    const TowerClass = {
      [TowerTypes.TOWER_BULLET]: BulletTower,
      [TowerTypes.TOWER_LASER]: LaserTower,
    }[type];

    const configProp = {
      [TowerTypes.TOWER_BULLET]: 'bullet',
      [TowerTypes.TOWER_LASER]: 'laser',
    }[type];
    
    const { dps, price, radius }: TowerProps = this.config.towers[configProp];
    
    const tower = new TowerClass({ scene: this, x: towerX, y: towerY, key, dps, price, radius });
    this.towers.add(tower);
    
    console.log('New bullet tower spawned', tower.key)
    
    this.events.emit(ActionTypes.TOWER_ADDED);
  }

  putBulletTowerAt(this: SceneGame & Scene, { x, y }: Math.Vector2) {
    this.putTowerAt({ x, y }, TowerTypes.TOWER_BULLET);
  }

  putLaserTowerAt(this: SceneGame & Scene, { x, y }: Math.Vector2) {
    this.putTowerAt({ x, y }, TowerTypes.TOWER_LASER);
  }
  
  highlightTileAt(this: SceneGame & Scene, { x, y }: Math.Vector2) {
    const tile: Tilemaps.Tile = this.tilemap.getTileAtWorldXY(x, y);
    const tileWidth = this.tilemap.tileWidth;
    const tileHeight = this.tilemap.tileHeight;

    if (tile) {
      const color = this.isBuildableTile(tile) ? 0x00ff00 : 0xff0000;

      this.marker.lineStyle(3, color, 1);
      this.marker.strokeRect(0, 0, tileWidth, tileHeight);
      this.marker.x = tile.pixelX;
      this.marker.y = tile.pixelY;
    }
  }
  
  isBuildableTile(this: SceneGame & Scene, tile: Tilemaps.Tile): boolean {
    if (!tile || tile.index !== 2) return false;

    const tileWidth = this.tilemap.tileWidth;
    const tileHeight = this.tilemap.tileHeight;
    const tower = this.towers.getChildren().some(t => t.x === tile.pixelX+tileWidth/2 && t.y === tile.pixelY+tileHeight/2);
    
    return !tower;
  }

  exitAddTowerMode(this: SceneGame & Scene) {
    console.log('Exiting add-tower mode...')

    this.input.off('pointermove', this.highlightTileAt, this);
    this.input.off('pointerdown', this.putBulletTowerAt, this);
    this.input.off('pointerdown', this.putLaserTowerAt, this);
    
    this.marker.destroy();
  }

  attachEventHandlers(this: SceneGame & Scene) {
    this.events.on(ActionTypes.ADD_TOWER, (type: TowerTypes) => {
      console.log('Entering add-tower mode...', type)
      this.enterAddTowerMode(type);
    });

    this.events.on(ActionTypes.TOWER_ADDED, () => {
      console.log('Entering add-tower mode...')
      this.exitAddTowerMode();
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

