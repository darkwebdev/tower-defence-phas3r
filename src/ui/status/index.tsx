import * as React from 'react'
import './styles.less'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'ui-status': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

type Props = {
  money: number;
  hp: number;
}

export default class Status extends React.Component<Props> {
  
  render() {
    const { money, hp } = this.props;
    
    return (
      <ui-status>
        <span>${money}</span>
        <span>HP: {hp}</span>
      </ui-status>
    );
  }
}
