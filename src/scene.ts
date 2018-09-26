import { GameObjects, Scene, Tilemaps, Time, Physics } from 'phaser';
import Enemy from './enemy';
import Tower from './tower'

export default class TdScene extends Scene {
  text: GameObjects.Text;
  hp: number;
  gameOver: boolean;
  home: Physics.Arcade.Image;
  enemies: GameObjects.Group;
  enemyRespawn: Time.TimerEvent;

  preload(this: Scene): void {
    this.load.image('tiles', '../map/td.png');
    this.load.tilemapTiledJSON('level1', '../map/td-map.json');
    this.load.image('enemy', '../map/enemy.png');
  }

  init(this: Scene): void {
    this.enemies = this.add.group({
      runChildUpdate: true,
      // maxSize: 50
      createCallback: this.onEnemySpawn.bind(this),
    });
  }
  
  create(this: Scene): void {
    const tilemap: Tilemaps.Tilemap = this.make.tilemap({ key: 'level1', tileHeight: 20, tileWidth: 20 });
    const tileset: Tilemaps.Tileset = tilemap.addTilesetImage('td', 'tiles');

    const layerTerrain = tilemap.createStaticLayer("terrain", tileset, 0, 0);

    const enemies = tilemap.createFromObjects('enemies', 'enemy', {});
    console.log(enemies)
    const homes: GameObjects.Sprite[] = tilemap.createFromObjects('allies', 'home', {});

    const enemyTemplate: GameObjects.Sprite = enemies[0];
    
    this.enemyRespawn = this.time.addEvent({
      delay: 2000,
      callback: () => this.spawnEnemy(enemyTemplate),
      callbackScope: this,
      repeat: 5
    });

    const homeTemplate = homes[0];
    this.home = this.physics.add
      .image(homeTemplate.x, homeTemplate.y, 'enemy')
      .setSize(homeTemplate.width,homeTemplate.height);
    
    this.hp = 100;

    this.text = this.add
      .text(16, 16, 'Enemy is coming!', {
        font: "18px monospace",
        fill: "#000000",
        padding: { x: 20, y: 10 },
        backgroundColor: "#ffffff"
      })
      .setScrollFactor(0);
  }

  update(time, delta): void {
    if (this.gameOver) return;

    // this.enemies.forEach(e => e.update);

    if (this.hp <= 0) {
      this.gameOver = true;
    }
  }

  spawnEnemy({ x, y, width, height }: GameObjects.Sprite): void {
    const childrenNum = this.enemies.children.size;
    const enemy = this.enemies.add(new Enemy({ scene: this, x, y, key: String(childrenNum) }));

    console.log('New enemy spawned', childrenNum)
  }
  
  onEnemySpawn(this: Scene, enemy: Enemy): void {
    console.log('Enemy spawned')
    this.physics.moveToObject(enemy, this.home, 100);
    enemy.collider = this.physics.add.overlap(
      enemy,
      this.home,
      this.onEnemyEnter,
      undefined,
      this
    );
  }
  
  onEnemyEnter(enemy: Enemy): void {
    this.hp -= 10;

    console.log('Enemy is inside!', enemy.key, this.hp);
    this.text.setText('Enemy inside. HP: ' + this.hp);

    enemy.onEnterHome();
    this.enemies.remove(<any>enemy, true, true);
  }
}

