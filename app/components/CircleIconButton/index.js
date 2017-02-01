/**
*
* CircleIconButton
*
*/

import React, { PropTypes } from 'react';
import Radium from 'radium';

import Icon from 'components/Icon';

class CircleIconButton extends React.Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
    if (props.active === undefined) {
      this.state = {
        active: false,
      };
    }
  }

  onClick() {
    if (typeof this.props.activeOnClick !== 'undefined' && typeof this.props.inactiveOnClick !== 'undefined') {
      if (this.state.active) {
        this.props.activeOnClick();
      } else {
        this.props.inactiveOnClick();
      }
    } else {
      this.props.onClick();
    }
    if (this.props.active === undefined) {
      this.setState({
        active: !this.state.active,
      });
    }
  }

  styles = {
    base: {
      borderRadius: '50%',
      outline: 'none',
      padding: 0,
    },
  };

  render() {
    return (
      <button id={this.props.id} style={[this.styles.base, this.props.style]} onClick={this.onClick}>
        <Icon id={`${this.props.id}-icon'`} name={this.props.name} active={this.props.active !== undefined ? this.props.active : this.state.active} style={[this.styles.base, this.props.style, { margin: 'none' }]} />
      </button>
    );
  }
}

CircleIconButton.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  style: PropTypes.object,
  active: PropTypes.bool,
  onClick: PropTypes.func,
  activeOnClick: PropTypes.func,
  inactiveOnClick: PropTypes.func,
};

export default Radium(CircleIconButton);
