/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/**
*
* Button
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';
import { FormattedMessage } from 'react-intl';

import Icon from 'components/Icon';

export const possibleTypes = ['primaryBlue', 'primaryBlueBig', 'primaryRed', 'secondary'];

const styles = {
  base: {
    borderRadius: '3px',
    borderWidth: '0px',
    backgroundColor: '#23cdf4',
    fontSize: '13px',
    fontWeight: 'bold',
    fontStyle: 'normal',
    fontStretch: 'normal',
    color: '#FFFFFF',
    padding: '9px 17px',
    cursor: 'pointer',
    boxSizing: undefined,
    outline: 'none',
  },
  primaryBlue: {
    backgroundColor: '#23cdf4',
    ':hover': {
      backgroundColor: '#1FB8DC',
    },
    ':active': {
      backgroundColor: '#14778D',
    },
    disabled: {
      backgroundColor: '#8BE1F4',
    },
  },
  primaryBlueBig: {
    backgroundColor: '#23cdf4',
    borderRadius: '8px',
    fontSize: '16px',
    padding: '14px 28px',
    ':hover': {
      backgroundColor: '#1FB8DC',
    },
    ':active': {
      backgroundColor: '#14778D',
    },
    disabled: {
      backgroundColor: '#8BE1F4',
    },
  },
  primaryRed: {
    backgroundColor: '#FE4565',
    ':hover': {
      backgroundColor: '#E43D5A',
    },
    ':active': {
      backgroundColor: '#CB3750',
    },
    disabled: {
      backgroundColor: '#F99CAC',
    },
  },
  secondary: {
    backgroundColor: '#FFFFFF',
    borderTop: '1px solid #979797',
    borderRight: '1px solid #979797',
    borderBottom: '1px solid #979797',
    borderLeft: '1px solid #979797',
    color: '#4B4B4B',
    fontWeight: '',
    borderRadius: '2px',
    ':focus': {
      boxShadow: '0 0 6px 1px rgba(0, 0, 0, 0.12)',
      borderTop: 'solid 1px #23CEF5',
      borderRight: 'solid 1px #23CEF5',
      borderBottom: 'solid 1px #23CEF5',
      borderLeft: 'solid 1px #23CEF5',
    },
    ':hover': {
      backgroundColor: '#F3F3F3',
    },
    ':active': {
      backgroundColor: '#E4E4E4',
    },
    disabled: {
      borderTop: '1px solid #C5C5C5',
      borderRight: '1px solid #C5C5C5',
      borderBottom: '1px solid #C5C5C5',
      borderLeft: '1px solid #C5C5C5',
      color: '#C5C5C5',
    },
  },
  disabled: {
    ':hover': {
      backgroundColor: undefined,
    },
    ':active': {
      backgroundColor: undefined,
    },
    cursor: 'default',
  },
  clear: {
    borderTop: 'none',
    borderRight: 'none',
    borderBottom: 'none',
    borderLeft: 'none',
    backgroundColor: 'none',
    ':hover': {
      backgroundColor: undefined,
    },
    ':active': {
      backgroundColor: undefined,
    },
  },
  isIcon: {
    boxSizing: 'borderBox',
    padding: 'auto',
  },
};

class Button extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      mouseOver: false,
    };
  }

  render() {
    let inner;
    if (!this.props.mouseOverText || !this.state.mouseOver) {
      if (this.props.iconName) {
        inner = <Icon name={this.props.iconName} />;
      } else if (typeof this.props.text === 'object') {
        inner = <FormattedMessage {...this.props.text} />;
      } else if (typeof this.props.text === 'string') {
        inner = this.props.text;
      } else {
        inner = this.props.children;
      }
    } else {
      inner = <FormattedMessage {...this.props.mouseOverText} />;
    }

    return (
      <button
        id={this.props.id}
        type="button"
        style={[
          styles.base,
          styles[this.props.type],
          this.props.disabled && styles[this.props.type].disabled,
          this.props.disabled && styles.disabled,
          this.props.iconName && styles.isIcon,
          this.props.clear && styles.clear,
          this.props.style,
        ]}
        tabIndex={this.props.tabIndex}
        onClick={this.props.onClick}
        disabled={this.props.disabled}
        onMouseEnter={() => this.setState({ mouseOver: true })}
        onMouseLeave={() => this.setState({ mouseOver: false })}
      >
        {inner}
      </button>
    );
  }
}

Button.propTypes = {
  text: PropTypes.any,
  mouseOverText: PropTypes.object,
  iconName: PropTypes.string,
  children: PropTypes.element,
  tabIndex: PropTypes.number,
  type: PropTypes.oneOf(possibleTypes).isRequired,
  style: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),
  clear: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  id: PropTypes.string.isRequired,
};

Button.defaultProps = {
  tabIndex: 0,
};

export default Radium(Button);
