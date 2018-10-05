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
  onHideButtonClick: () => void;
  onShowButtonClick: () => void;
}

export default class Panel extends React.Component<Props> {
  
  render() {
    const { onHideButtonClick, onShowButtonClick, onBulletTowerButtonClick, onMenuButtonClick, hidden } = this.props;
    
    return (
      <ui-panel hidden={hidden}>
        <button hidden={hidden} onClick={onMenuButtonClick}>Menu</button>
        <button hidden={hidden} onClick={onBulletTowerButtonClick}>Bullet Tower</button>
        <button hidden={hidden} onClick={onHideButtonClick}>Hide</button>
        <button hidden={!hidden} onClick={onShowButtonClick}>Show</button>
      </ui-panel>
    );
  }
}
