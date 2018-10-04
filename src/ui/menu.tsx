import * as React from 'react'
import './menu.less'

type Props = {
  hidden?: boolean;
  onReturn: () => void;
  onRestart: () => void;
  onOptions?: () => void;
  onExit?: () => void;
}

export default class Menu extends React.Component<Props> {
  public static defaultProps: Partial<Props> = {
    hidden: true
  };

  private myRef: React.RefObject<HTMLElement> = React.createRef();
  
  componentDidMount() {
    this.myRef.current.focus();
  }

  componentDidUpdate() {
    this.myRef.current.focus();
  }
  
  returnOnEsc(event: any) {
    if (event.key === 'Escape') {
      this.props.onReturn();
    }
  }
  
  render() {
    const { hidden, onReturn, onRestart } = this.props;
    
    return (
      <menu
        hidden={hidden}
        onKeyDown={this.returnOnEsc.bind(this)}
        tabIndex={0}
        ref={this.myRef}
      >
        <button onClick={onReturn}>Return to game</button>
        <button onClick={onRestart}>Restart</button>
        <button disabled>Options</button>
        <button disabled>Exit</button>
      </menu>
    );
  }
}
