import { Curves, GameObjects, Math, Physics, Scene, Tilemaps, Time } from 'phaser'
import Enemy, { EnemyProps } from '../entities/enemy'
import BulletTower from '../entities/tower/tower-bullet'
import LaserTower from '../entities/tower/tower-laser'
import { ActionTypes } from '../actions';
import { TowerProps, TowerTypes } from '../entities/tower';
import { Config } from '../config';

export const SCENE_KEY = 'scene-game';

export default class SceneGame extends Scene {
  hp: number = 0;
  money: number = 0;
  gameOver: boolean = false;
  home: Physics.Arcade.Image;
  enemies: GameObjects.Group;
  towers: GameObjects.Group;
  enemyRespawn: Time.TimerEvent;
  waveSize: number;
  path: Curves.Path;
  tilemap: Tilemaps.Tilemap;
  marker: GameObjects.Graphics;
  config: Config;
  
  constructor() {
    super({
      key: SCENE_KEY,
      active: false,
      // plugins: [ 'Input', 'Loader', 'Time' ]
    });
  }

  preload(this: Scene & SceneGame) {
    this.load.image('tiles', 'map/td.png');
    this.load.tilemapTiledJSON('level1', 'map/td-map.json');
    this.load.atlas('buildings', 'images/buildings.png', 'images/buildings.json');
    this.load.atlas('vehicles', 'images/ground_units.png', 'images/ground_units.json');
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
    this.changeMoney(this.config.start.money);
    this.changeHp(this.config.start.hp);

    console.log('$', this.money)
    console.log('hp', this.hp)

    this.tilemap = this.make.tilemap({ key: 'level1', tileHeight: 20, tileWidth: 20 });
    
    this.createPath();
    this.createHome();
    
    this.createTowers();
    this.createEnemies();

    this.attachKeyHandlers();
    this.attachEventHandlers();
  }

  update(time: number, delta: number) {
    if (this.gameOver) return;
    if (this.hp <= 0) {
      this.gameOver = true;
      //todo: emit & pause
    }

    this.enemies.getChildren().forEach((e: Enemy) => {
      if (e.hp <= 0) {
        this.changeMoney(e.money);
        this.enemies.remove(<any>e, true, true); // possible race condition?
      }
    });
  }
  
  createHome(this: SceneGame & Scene) {
    const homes: GameObjects.Sprite[] = this.tilemap.createFromObjects('allies', 'home', {});
    const homeTemplate = homes[0];
    this.home = this.physics.add
      .image(homeTemplate.x, homeTemplate.y, 'enemy')
      .setSize(homeTemplate.width,homeTemplate.height);
  }
  
  createTowers(this: SceneGame & Scene) {
    const bulletTowers: any[] = this.tilemap.filterObjects('towers', (t => t.name === 'Bullet tower'));

    bulletTowers.forEach(t => {
      const { dps, price, radius, baseTexture, baseFrame, gunTexture, gunFrame, angleOffset }: TowerProps = this.config.towers.bullet;
      const x = t.x + this.tilemap.tileWidth/2;
      const y = t.y - this.tilemap.tileHeight/2;
      const tower = new BulletTower({ scene: this, x, y, baseTexture, baseFrame, gunTexture, gunFrame, angleOffset, dps, price, radius, name: t.name });
      this.towers.add(tower);
      console.log('New bullet tower spawned')
    });

    const laserTowers: any[] = this.tilemap.filterObjects('towers', (t => t.name === 'Laser tower'));
    laserTowers.forEach(t => {
      const { dps, price, radius, baseTexture, baseFrame, gunTexture, gunFrame, angleOffset }: TowerProps = this.config.towers.laser;
      const x = t.x + this.tilemap.tileWidth/2;
      const y = t.y - this.tilemap.tileHeight/2;
      const tower = new LaserTower({ scene: this, x, y, baseTexture, baseFrame, gunTexture, gunFrame, angleOffset, dps, price, radius, name: t.name });
      this.towers.add(tower);
      console.log('New laser tower spawned')
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
  
  spawnEnemy({ x, y }: GameObjects.Sprite): void {
    const enemy = new Enemy(<EnemyProps>{ ...this.config.enemies.default, scene: this, x, y, name: `enemy-${this.enemies.children.size}` });
    this.enemies.add(enemy);
    console.log('New enemy spawned', enemy.name)
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
    console.log('Enemy spawned', enemy.name)
    enemy.collider = this.physics.add.overlap(
      enemy,
      this.home,
      this.onEnemyEnter,
      undefined,
      this
    );
  }
  
  onEnemyEnter(enemy: Enemy): void {
    this.changeHp(-enemy.damage);

    console.log('Enemy is inside!', enemy.name, this.hp);

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
    const name = `tower-${this.towers.children.size}`;
    
    const TowerClass = {
      [TowerTypes.TOWER_BULLET]: BulletTower,
      [TowerTypes.TOWER_LASER]: LaserTower,
    }[type];

    const configProp = {
      [TowerTypes.TOWER_BULLET]: 'bullet',
      [TowerTypes.TOWER_LASER]: 'laser',
    }[type];
    
    const { dps, price, radius, baseTexture, baseFrame, gunTexture, gunFrame, angleOffset }: TowerProps = this.config.towers[configProp];
    
    if (this.money < price) {
      console.log('NOT ENOUGH $ to build a tower!')
      return;
    }
    
    const tower = new TowerClass({ scene: this, x: towerX, y: towerY, baseTexture, baseFrame, gunTexture, gunFrame, angleOffset, dps, price, radius, name });
    this.towers.add(tower);
    this.changeMoney(-tower.price);

    console.log('New tower spawned', tower, this.hp)
    
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

    const tileCenterX = tile.pixelX+this.tilemap.tileWidth/2;
    const tileCenterY = tile.pixelY+this.tilemap.tileHeight/2;
    const tower = this.towers.getChildren().some(tower => tower.base.x === tileCenterX && tower.base.y === tileCenterY);
    
    return !tower;
  }

  exitAddTowerMode(this: SceneGame & Scene) {
    console.log('Exiting add-tower mode...')

    this.input.off('pointermove', this.highlightTileAt, this);
    this.input.off('pointerdown', this.putBulletTowerAt, this);
    this.input.off('pointerdown', this.putLaserTowerAt, this);
    
    this.marker.destroy();
  }
  
  changeHp(this: SceneGame & Scene, delta: number) {
    this.hp += delta;
    this.events.emit(ActionTypes.HP_UPDATED, this.hp);
  }
  changeMoney(this: SceneGame & Scene, delta: number) {
    this.money += delta;
    this.events.emit(ActionTypes.MONEY_UPDATED, this.money);
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

