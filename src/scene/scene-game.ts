import { Curves, GameObjects, Math as PMath, Physics, Scene, Tilemaps } from 'phaser'
import Enemy, { EnemyProps } from '../entities/enemy'
import BulletTower from '../entities/tower/tower-bullet'
import LaserTower from '../entities/tower/tower-laser'
import { ActionTypes } from '../store/actions';
import Tower, { TowerProps, TowerTypes } from '../entities/tower';
import { Config } from '../config';
import attachEvents from './events';

export const SCENE_KEY = 'scene-game';
const ENEMIES_INTERVAL_MS = 2000;

export default class SceneGame extends Scene {
  hp: number = 0;
  money: number = 0;
  gameOver: boolean = false;
  home: Physics.Arcade.Image;
  enemies: GameObjects.Group;
  towers: GameObjects.Group;
  waveSize: number;
  enemySpawnVector2: PMath.Vector2;
  path: Curves.Path;
  tilemap: Tilemaps.Tilemap;
  coverageArea: GameObjects.Arc;
  ghostTower: GameObjects.Sprite;
  grid: GameObjects.Graphics;
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

    this.tilemap = this.make.tilemap({ key: 'level1', tileHeight: 20, tileWidth: 20 });
    
    this.createPath();
    this.createHome();
    
    this.createTowers();
    this.createEnemies();

    attachEvents(this);
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
      const { dps, price, radius, baseTexture, baseFrame, gunTexture, gunFrame, angleOffset }: TowerProps = this.config.towers[TowerTypes.TOWER_BULLET];
      const x = t.x + this.tilemap.tileWidth/2;
      const y = t.y - this.tilemap.tileHeight/2;
      const tower = new BulletTower({ scene: this, x, y, baseTexture, baseFrame, gunTexture, gunFrame, angleOffset, dps, price, radius, name: t.name });
      this.towers.add(tower);
      console.log('New bullet tower spawned')
    });

    const laserTowers: any[] = this.tilemap.filterObjects('towers', (t => t.name === 'Laser tower'));
    laserTowers.forEach(t => {
      const { dps, price, radius, baseTexture, baseFrame, gunTexture, gunFrame, angleOffset }: TowerProps = this.config.towers[TowerTypes.TOWER_LASER];
      const x = t.x + this.tilemap.tileWidth/2;
      const y = t.y - this.tilemap.tileHeight/2;
      const tower = new LaserTower({ scene: this, x, y, baseTexture, baseFrame, gunTexture, gunFrame, angleOffset, dps, price, radius, name: t.name });
      this.towers.add(tower);
      console.log('New laser tower spawned')
    });
  }

  createEnemies(this: SceneGame & Scene) {
    const enemies = this.tilemap.createFromObjects('enemies', 'enemy', {});
    this.enemySpawnVector2 = enemies[0];

    this.spawnWave();
  }
  
  spawnWave(this: SceneGame & Scene) {
    this.time.addEvent({
      delay: ENEMIES_INTERVAL_MS,
      callback: () => this.spawnEnemy(this.enemySpawnVector2),
      callbackScope: this,
      repeat: this.waveSize-1
    });  
  }
  
  spawnEnemy({ x, y }: PMath.Vector2) {
    const enemy = new Enemy(<EnemyProps>{ ...this.config.enemies.default, scene: this, x, y, name: `enemy-${this.enemies.children.size}` });
    this.enemies.add(enemy);
    this.waveSize *= 2;
    console.log('New enemy spawned', enemy.name, this.waveSize)
  }
  
  createPath(this: SceneGame & Scene) {
    const tileset: Tilemaps.Tileset = this.tilemap.addTilesetImage('td', 'tiles');
    this.tilemap.createStaticLayer('terrain', tileset, 0, 0);

    this.path = this.add.path(96, -32);
    this.path.lineTo(96, 164);
    this.path.lineTo(480, 164);
    this.path.lineTo(480, 544);

    const graphics = this.add.graphics();
    graphics.lineStyle(3, 0xffffff, 1);
    this.path.draw(graphics);
  }
  
  onEnemySpawn(this: Scene & SceneGame, enemy: Enemy) {
    console.log('Enemy spawned', enemy.name)
    enemy.collider = this.physics.add.overlap(
      enemy,
      this.home,
      this.onEnemyEnter,
      undefined,
      this
    );
  }
  
  onEnemyEnter(enemy: Enemy) {
    this.changeHp(-enemy.damage);

    console.log('Enemy is inside!', enemy.name, this.hp);

    enemy.onEnterHome();
    this.enemies.remove(<any>enemy, true, true);
  }

  enterAddTowerMode(this: SceneGame & Scene, type: TowerTypes) {
    this.grid = this.add.graphics();
    drawGrid(this.grid, this.tilemap);
    
    showCoverageAreas(this.towers);
    
    const { radius, baseTexture, baseFrame }: TowerProps = this.config.towers[type];

    this.ghostTower = this.add
      .sprite(0, 0, baseTexture, baseFrame)
      .setAlpha(0.5);
    
    this.coverageArea = this.add
      .circle(0, 0, radius, 0x00ff00, 0.2)
      .setStrokeStyle(1, 0x00ff00)
      .setVisible(true);

    this.input.on('pointermove', (point: PMath.Vector2) => this.highlightTileAt(point));
    this.input.on('pointerdown', (point: PMath.Vector2) => this.placeTowerAt(point, type));
  }
  
  placeTowerAt(this: SceneGame & Scene, { x, y }: PMath.Vector2, type: TowerTypes) {
    const tile: Tilemaps.Tile = this.tilemap.getTileAtWorldXY(x, y);
    
    if (!tile || !this.isBuildableTile(tile)) return;
    
    const towerX = tile.pixelX + this.tilemap.tileWidth/2;
    const towerY = tile.pixelY + this.tilemap.tileHeight/2;
    const name = `tower-${this.towers.children.size}`;
    
    const TowerClass = {
      [TowerTypes.TOWER_BULLET]: BulletTower,
      [TowerTypes.TOWER_LASER]: LaserTower,
    }[type];
    
    const { dps, price, radius, baseTexture, baseFrame, gunTexture, gunFrame, angleOffset }: TowerProps = this.config.towers[type];
    
    if (this.money < price) {
      console.log('NOT ENOUGH $ to build a tower!')
      return;
    }
    
    const tower = new TowerClass({ scene: this, x: towerX, y: towerY, baseTexture, baseFrame, gunTexture, gunFrame, angleOffset, dps, price, radius, name });
    this.towers.add(tower);
    this.changeMoney(-tower.price);

    this.grid.destroy();
    hideCoverageAreas(this.towers);
    this.coverageArea.setVisible(false);
    console.log('New tower spawned', tower, this.hp)
    
    this.events.emit(ActionTypes.TOWER_ADDED);
  }

  highlightTileAt(this: SceneGame & Scene, { x, y }: PMath.Vector2) {
    const tile: Tilemaps.Tile = this.tilemap.getTileAtWorldXY(x, y);
    const tileWidth = this.tilemap.tileWidth;
    const tileHeight = this.tilemap.tileHeight;

    if (tile) {
      const color = this.isBuildableTile(tile) ? 0x00ff00 : 0xff0000;

      const tileCenterX = tile.pixelX + tileWidth/2;
      const tileCenterY = tile.pixelY + tileHeight/2;
      
      this.ghostTower.setPosition(tileCenterX, tileCenterY);
      
      this.coverageArea
        .setPosition(tileCenterX, tileCenterY)
        .setFillStyle(color, 0.2)
        .setStrokeStyle(1, color);
    }
  }
  
  selectTower(this: SceneGame & Scene, tower: Tower) {
    tower.showCoverage();
  }
  
  deselectAllTowers(this: SceneGame & Scene) {
    this.towers.getChildren().forEach((tower: Tower) => {
      tower.hideCoverage();
    })
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
    this.input.off('pointerdown', this.placeBulletTowerAt, this);
    this.input.off('pointerdown', this.placeLaserTowerAt, this);
    
    this.ghostTower.destroy();
  }
  
  changeHp(this: SceneGame & Scene, delta: number) {
    this.hp += delta;
    this.events.emit(ActionTypes.HP_UPDATED, this.hp);
  }
  changeMoney(this: SceneGame & Scene, delta: number) {
    this.money += delta;
    this.events.emit(ActionTypes.MONEY_UPDATED, this.money);
  }
}

function drawGrid(graphics: GameObjects.Graphics, { width, height, tileWidth, tileHeight }: Tilemaps.Tilemap) {
  graphics.lineStyle(1, 0xeeeeee, 0.5);
  
  for (let i = 0; i < height; i++) {
    graphics.moveTo(0, i * tileHeight);
    graphics.lineTo(width*tileWidth, i * tileHeight);
  }
  
  for(let j = 0; j < width; j++) {
    graphics.moveTo(j * tileWidth, 0);
    graphics.lineTo(j * tileHeight, height*tileHeight);
  }
  
  graphics.strokePath();
}

function showCoverageAreas(towers: GameObjects.Group) {
  towers.getChildren().forEach((t: Tower) => {
    t.coverageArea.setVisible(true);
  });
}

function hideCoverageAreas(towers: GameObjects.Group) {
  towers.getChildren().forEach((t: Tower) => {
    t.coverageArea.setVisible(false);
  });
}
