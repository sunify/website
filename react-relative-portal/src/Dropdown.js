import React from 'react';
import RelativePortal from 'react-relative-portal';

export default class Hint extends React.Component {

  static propTypes = {
    children: React.PropTypes.any,
    position: React.PropTypes.oneOf(['left', 'right']),
  };

  state = {
    show: false,
  };

  render() {
    const { children, position = 'left' } = this.props;
    const { show } = this.state;
    const portalProps = position === 'left' ? {} : { right: 0 };

    return (
      <div style={styles.container}>
        <button onClick={() => setTimeout(() => this.setState({ show: !show }))}>
          Show content
        </button>

        <RelativePortal
          component="div"
          top={5}
          onOutClick={show ? (() => this.setState({ show: false })) : null}
          {...portalProps}
        >
          {show &&
            <div style={styles.dropdown}>
              {children}
            </div>
          }
        </RelativePortal>
      </div>
    );
  }

}

const styles = {
  container: {
    display: 'inline-block',
  },
  dropdown: {
    padding: 5,
    backgroundColor: '#FFF',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
  },
};
