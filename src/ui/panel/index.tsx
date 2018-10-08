import * as React from 'react'
import './styles.less'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'ui-panel': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

type Props = {
  hidden: boolean;
  onMenuButtonClick: () => void;
  bulletTowerPrice: number;
  onBulletTowerButtonClick: () => void;
  laserTowerPrice: number;
  onLaserTowerButtonClick: () => void;
  onHideButtonClick: () => void;
  onShowButtonClick: () => void;
}

export default class Panel extends React.Component<Props> {
  
  render() {
    const p = this.props;
    
    return (
      <ui-panel hidden={p.hidden}>
        <button hidden={p.hidden} onClick={p.onMenuButtonClick}>Menu</button>
        <button hidden={p.hidden} onClick={p.onBulletTowerButtonClick}>Bullet Tower ${p.bulletTowerPrice}</button>
        <button hidden={p.hidden} onClick={p.onLaserTowerButtonClick}>Laser Tower ${p.laserTowerPrice}</button>
        <button hidden={p.hidden} onClick={p.onHideButtonClick}>Hide</button>
        <button hidden={!p.hidden} onClick={p.onShowButtonClick}>Show</button>
      </ui-panel>
    );
  }
}
