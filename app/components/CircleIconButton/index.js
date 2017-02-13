/**
*
* CircleIconButton
*
*/

import React, { PropTypes } from 'react';
import Radium from 'radium';

import Icon from 'components/Icon';

class CircleIconButton extends React.Component {
  styles = {
    base: {
      borderRadius: '50%',
      outline: 'none',
      padding: 0,
    },
  };

  render() {
    return (
      <button id={this.props.id} style={[this.styles.base, this.props.style]} onClick={this.props.onClick}>
        <Icon id={`${this.props.id}-icon`} name={this.props.name} active={this.props.active} style={[this.styles.base, this.props.style, { margin: 'none' }]} />
      </button>
    );
  }
}

CircleIconButton.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  style: PropTypes.object,
  active: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};

export default Radium(CircleIconButton);
