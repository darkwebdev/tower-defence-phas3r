import { GameObjects, Physics, Scene, Tilemaps, Time, Curves } from 'phaser';
import Enemy from './enemy';
import BulletTower from './tower-bullet';
import LaserTower from './tower-laser';

export default class TdScene extends Scene {
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

  preload(this: Scene & TdScene): void {
    this.load.image('tiles', 'map/td.png');
    this.load.tilemapTiledJSON('level1', 'map/td-map.json');
    this.load.image('enemy', 'images/enemy.png');
    this.load.image('bullet', 'images/bullet.png');
  }

  init(this: Scene & TdScene): void {
    this.enemies = this.add.group({
      runChildUpdate: true,
      createCallback: this.onEnemySpawn.bind(this),
    });
    
    this.towers = this.add.group({
      runChildUpdate: true
    });
    
    this.waveSize = 2;
  }
  
  create(this: Scene & TdScene): void {
    const tilemap = this.make.tilemap({ key: 'level1', tileHeight: 20, tileWidth: 20 });
    
    this.createPath(tilemap);
    this.createHome(tilemap);
    
    this.createTowers(tilemap);
    this.createEnemies(tilemap);

    this.createText();
  }

  update(time: number, delta: number): void {
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
  
  createHome(this: Scene, tilemap: Tilemaps.Tilemap) {
    const homes: GameObjects.Sprite[] = tilemap.createFromObjects('allies', 'home', {});
    const homeTemplate = homes[0];
    this.home = this.physics.add
      .image(homeTemplate.x, homeTemplate.y, 'enemy')
      .setSize(homeTemplate.width,homeTemplate.height);

    this.hp = 100;
  }
  
  createTowers(this: Scene, tilemap: Tilemaps.Tilemap) {
    const bulletTowers: GameObjects.Sprite[] = tilemap.createFromObjects('towers', 'Bullet tower', {});
    bulletTowers.forEach(({ x, y }) => {
      const tower = new BulletTower({ scene: this, x, y, key: `tower-${this.towers.children.size}` });
      this.towers.add(tower);
      console.log('New bullet tower spawned', tower.key)
    });

    const laserTowers: GameObjects.Sprite[] = tilemap.createFromObjects('towers', 'Laser tower', {});
    laserTowers.forEach(({ x, y }) => {
      const tower = new LaserTower({ scene: this, x, y, key: `tower-${this.towers.children.size}` });
      this.towers.add(tower);
      console.log('New laser tower spawned', tower.key)
    });
  }

  createEnemies(this: Scene, tilemap: Tilemaps.Tilemap) {
    const enemies = tilemap.createFromObjects('enemies', 'enemy', {});
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
  
  createPath(this: Scene, tilemap: Tilemaps.Tilemap) {
    const tileset: Tilemaps.Tileset = tilemap.addTilesetImage('td', 'tiles');
    const layerTerrain = tilemap.createStaticLayer("terrain", tileset, 0, 0);

    this.path = this.add.path(96, -32);
    this.path.lineTo(96, 164);
    this.path.lineTo(480, 164);
    this.path.lineTo(480, 544);

    const graphics = this.add.graphics();
    graphics.lineStyle(3, 0xffffff, 1);
    this.path.draw(graphics);
  }
  
  createText(this: Scene) {
    this.text = this.add
      .text(16, 16, 'Enemy is coming!', {
        font: "18px monospace",
        fill: "#000000",
        padding: { x: 20, y: 10 },
        backgroundColor: "#ffffff"
      })
      .setScrollFactor(0);

    this.textPool = this.add
      .text(16, 64, 'Bullet pool', {
        font: "18px monospace",
        fill: "#000000",
        padding: { x: 20, y: 10 },
        backgroundColor: "#ffffff"
      })
      .setScrollFactor(0);
  }

  onEnemySpawn(this: Scene & TdScene, enemy: Enemy): void {
    console.log('Enemy spawned', enemy.key)
    // this.physics.moveToObject(enemy, this.home, enemy.speed);
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
}

