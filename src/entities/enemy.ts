import { Scene, Physics, GameObjects, Math as PMath } from 'phaser'
import HealthBar from '../ui/health-bar'

export type EnemyProps = {
  scene: Scene;
  x: number;
  y: number;
  height: number;
  width: number;
  hp: number;
  damage: number;
  money: number;
  texture: string;
  frame: string;
  angleOffset: number;
  name: string;
}

const SPEED: number = 1/10000;

export default class Enemy extends GameObjects.GameObject {
  scene: Scene;
  name: string;
  position: PMath.Vector2;
  hp: number;
  damage: number;
  money: number;
  speed: number;
  pathT: number;
  pathVec: PMath.Vector2;
  angleOffset: number;
  healthBar: HealthBar;
  collider: Physics.Arcade.Collider;
  sprite: GameObjects.Sprite;
  
  constructor({ scene, x, y, height, width, hp, damage, money, texture, frame, angleOffset, name }: EnemyProps) {
    super(scene);
    
    this.scene = scene;
    this.name = name;
    this.hp = hp;
    this.damage = damage;
    this.speed = SPEED;
    this.money = money;
    this.pathT = 0;
    this.pathVec = new PMath.Vector2();
    this.angleOffset = angleOffset;
    this.sprite = new GameObjects.Sprite(scene, x, y, texture, frame);
    this.healthBar = new HealthBar(scene, hp, x, y + this.sprite.height/2);
    this.sprite.on('onHit', damage => this.onHit(damage));

    console.log('ENEMY', this)
    
    this.scene.add.existing(this.sprite);
    this.scene.physics.world.enable(this.sprite);
  }

  update(time: number, delta: number): void {
    this.pathT += this.speed * delta;
    this.scene.path.getPoint(this.pathT, this.pathVec);
    const angle = PMath.RadToDeg(PMath.Angle.Between(this.sprite.x, this.sprite.y, this.pathVec.x, this.pathVec.y)) - this.angleOffset;
    this.sprite.setAngle(angle);
    this.sprite.setPosition(this.pathVec.x, this.pathVec.y);
    this.updateHealthBar();
  }

  updateHealthBar() {
    this.healthBar.setTo({ x: this.sprite.x, y: this.sprite.y + this.sprite.height/2 }, this.hp);
  }
  
  onHit(damage: number) {
    this.hp -= damage;
    this.updateHealthBar();
    // console.log('hp', this.hp, this.name)
  }
  
  addCollider(subject: GameObjects.GameObject, onOverlap: (enemy: Enemy) => void) {
    this.collider = this.scene.physics.add.overlap(
      this.sprite,
      subject,
      onOverlap.bind(this.scene, this)
    );
  }
  
  onEnterHome() {
    console.log('I am home', this.name)
  }

  destroy() {
    console.log('/ENEMY', this.name)
    this.collider.destroy();
    this.scene.physics.world.disable(this.sprite);
    this.sprite.setActive(false);
    this.healthBar.destroy();
    this.sprite.setFrame('truck1_destroyed.png');
  }
}
