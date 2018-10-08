import { TowerProps } from './entities/tower';

export type Config = {
  levels: any[];
  start: {
    money: number;
    hp: number;
  }
  towers: {
    bullet: Partial<TowerProps>;
    laser: Partial<TowerProps>;
  }
}

const config: Config = require('./config.json');

export default config;
