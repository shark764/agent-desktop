/**
*
* Button
*
*/

import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import Radium from 'radium';

import Icon from 'components/Icon';

export class Button extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      mouseOver: false,
    };
  }

  render() {
    const cursor = this.props.disabled ? 'default' : 'pointer';
    const isIcon = !!this.props.iconName;
    let backgroundColor;
    let backgroundColorHover;
    let backgroundColorActive;
    let focusBorder;
    let boxSizing;
    let border;
    let borderRadius = '3px';
    let color = '#FFFFFF';
    let fontSize = '13px';
    let fontWeight = 'bold';
    let padding = '9px 17px';
    if (this.props.type === 'primaryBlueBig' || this.props.type === 'primaryBlue') {
      if (this.props.type === 'primaryBlueBig') {
        borderRadius = '8px';
        fontSize = '16px';
        padding = '14px 28px';
      }
      if (this.props.disabled) {
        backgroundColor = '#8BE1F4';
      } else {
        backgroundColor = '#23cdf4';
        backgroundColorHover = '#1FB8DC';
        backgroundColorActive = '#14778D';
      }
    } else if (this.props.type === 'primaryRed') {
      if (this.props.disabled) {
        backgroundColor = '#F99CAC';
      } else {
        backgroundColor = '#FE4565';
        backgroundColorHover = '#E43D5A';
        backgroundColorActive = '#CB3750';
      }
    } else if (this.props.type === 'secondary') {
      backgroundColor = '#FFFFFF';
      backgroundColorHover = '#F3F3F3';
      backgroundColorActive = '#E4E4E4';
      focusBorder = {
        boxShadow: '0 0 6px 1px rgba(0, 0, 0, 0.12)',
        border: 'solid 1px #23CEF5',
      };
      border = '1px solid #979797';
      color = '#4B4B4B';
      fontWeight = '';
      borderRadius = '2px';
      if (this.props.disabled) {
        border = '1px solid #C5C5C5';
        color = '#C5C5C5';
      }
    }
    if (isIcon) {
      boxSizing = 'borderBox';
      padding = 'auto';
    }

    const styles = {
      base: {
        borderRadius,
        backgroundColor: !this.props.clear && backgroundColor,
        fontSize,
        fontWeight,
        fontStyle: 'normal',
        fontStretch: 'normal',
        color,
        padding,
        cursor,
        boxSizing,
        outline: 'none',
        ':hover': {
          backgroundColor: !this.props.clear && backgroundColorHover,
        },
        ':active': {
          backgroundColor: !this.props.clear && backgroundColorActive,
        },
      },
    };

    // To prevent warning from: https://github.com/FormidableLabs/radium/issues/95
    if (Array.isArray(this.props.style)) {
      this.props.style.forEach((style) => {
        if (style.borderTop || style.borderRight || style.borderBottom || style.borderLeft || this.props.clear) {
          border = undefined;
          focusBorder = undefined;
        }
      });
    } else if (this.props.style) {
      if (this.props.style.borderTop || this.props.style.borderRight || this.props.style.borderBottom || this.props.style.borderLeft || this.props.clear) {
        border = undefined;
        focusBorder = undefined;
      }
    }

    if (border) {
      styles.base.border = border;
    }
    if (focusBorder) {
      styles.base[':focus'] = focusBorder;
    }

    let inner;
    if (!this.props.mouseOverText || !this.state.mouseOver) {
      if (isIcon) {
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
        style={[styles.base, this.props.style]}
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
  clear: PropTypes.bool,
  iconName: PropTypes.string,
  children: PropTypes.element,
  tabIndex: PropTypes.number,
  type: PropTypes.oneOf(['primaryBlue', 'primaryBlueBig', 'primaryRed', 'secondary']).isRequired,
  style: PropTypes.object,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  id: PropTypes.string.isRequired,
};

Button.defaultProps = {
  tabIndex: 0,
};

export default Radium(Button);
