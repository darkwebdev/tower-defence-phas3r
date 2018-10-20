import * as React from 'react'
import './styles.less'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'ui-tower-control': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

type Props = {
  hidden: boolean;
  
  level: number;
  damage: number;
  sellPrice: number;

  isUpgradeDisabled: boolean;
  upgradePrice: number;
  onUpgradeButtonClick: () => void;
  onSellButtonClick: () => void;
}

const TowerControl: React.SFC<Props> = (p: Props) =>
  <ui-tower-control hidden={p.hidden}>
    <span>Tower lvl {p.level}</span>
    <span>Damage: {p.damage}</span>
    <button disabled={p.isUpgradeDisabled} onClick={p.onUpgradeButtonClick}>Upgrade ${p.upgradePrice}</button>
    <button onClick={p.onSellButtonClick}>Sell ${p.sellPrice}</button>
  </ui-tower-control>

export default TowerControl;
