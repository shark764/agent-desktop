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
    this.state = {
      active: false,
    };
  }

  onClick() {
    this.props.onClick();
    this.setState({
      active: !this.state.active,
    });
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
      <button id={this.props.id} style={[this.styles.base, this.props.style]} onClick={this.props.onClick}>
        <Icon id={`${this.props.id}-icon'`} name={this.props.name} active={this.state.active} style={[this.styles.base, this.props.style, { margin: 'none' }]} />
      </button>
    );
  }
}

CircleIconButton.propTypes = {
  name: PropTypes.string.isRequired,
  style: PropTypes.object,
  id: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Radium(CircleIconButton);
