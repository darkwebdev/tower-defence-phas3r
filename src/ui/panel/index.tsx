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
  onBulletTowerButtonClick: () => void;
  onLaserTowerButtonClick: () => void;
  onHideButtonClick: () => void;
  onShowButtonClick: () => void;
}

export default class Panel extends React.Component<Props> {
  
  render() {
    const {
      onHideButtonClick,
      onShowButtonClick,
      onBulletTowerButtonClick,
      onLaserTowerButtonClick,
      onMenuButtonClick,
      hidden
    } = this.props;
    
    return (
      <ui-panel hidden={hidden}>
        <button hidden={hidden} onClick={onMenuButtonClick}>Menu</button>
        <button hidden={hidden} onClick={onBulletTowerButtonClick}>Bullet Tower</button>
        <button hidden={hidden} onClick={onLaserTowerButtonClick}>Laser Tower</button>
        <button hidden={hidden} onClick={onHideButtonClick}>Hide</button>
        <button hidden={!hidden} onClick={onShowButtonClick}>Show</button>
      </ui-panel>
    );
  }
}
