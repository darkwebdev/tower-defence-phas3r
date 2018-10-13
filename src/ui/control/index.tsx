import * as React from 'react'
import './styles.less'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'ui-control': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

type Props = {
  hidden: boolean;
  onMenuButtonClick: () => void;
  
  isBulletTowerDisabled: boolean;
  bulletTowerPrice: number;
  onBulletTowerButtonClick: () => void;

  isLaserTowerDisabled: boolean;
  laserTowerPrice: number;
  onLaserTowerButtonClick: () => void;
  
  onNewWaveClick: () => void;
  
  onHideButtonClick: () => void;
  onShowButtonClick: () => void;
}

export default class Control extends React.Component<Props> {
  
  render() {
    const p = this.props;
    
    return (
      <ui-control hidden={p.hidden}>
        <button hidden={p.hidden} onClick={p.onMenuButtonClick}>Menu</button>
        
        <button hidden={p.hidden} disabled={p.isBulletTowerDisabled} onClick={p.onBulletTowerButtonClick}>Bullet Tower ${p.bulletTowerPrice}</button>
        <button hidden={p.hidden} disabled={p.isLaserTowerDisabled} onClick={p.onLaserTowerButtonClick}>Laser Tower ${p.laserTowerPrice}</button>
        
        <button hidden={p.hidden} onClick={p.onNewWaveClick}>New wave</button>
        
        <button hidden={p.hidden} onClick={p.onHideButtonClick}>Hide</button>
        <button hidden={!p.hidden} onClick={p.onShowButtonClick}>Show</button>
      </ui-control>
    );
  }
}
