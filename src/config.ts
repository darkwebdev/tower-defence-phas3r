import { TowerProps } from './entities/tower';
import { EnemyProps } from './entities/enemy';

export type Config = {
  levels: any[];
  start: {
    money: number;
    hp: number;
  }
  enemies: {
    [key: string]: Partial<EnemyProps>
  }
  towers: {
    [key: string]: Partial<TowerProps>;
  }
}

const config: Config = require('./config.json');

export default config;
