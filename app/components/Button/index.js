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
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';

import Icon from 'components/Icon';
import Tooltip from 'components/Tooltip';

export const possibleTypes = [
  'primaryBlue',
  'primaryBlueBig',
  'primaryRed',
  'secondary',
];

const styles = {
  wrapper: {
    display: 'inline',
  },
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
  MitelStyle: {
    backgroundColor: '#00a1f4',
    ':focus': {
      boxShadow: '0 0 1em #61b2dc',
    },
    ':hover': {
      backgroundColor: '#0f7fb9',
    },
    ':active': {
      backgroundColor: '#1a668e',
    },
    disabled: {
      backgroundColor: '#7cb8d8',
    },
  },
  primaryBlue: {
    backgroundColor: '#23cdf4',
    ':focus': {
      boxShadow: '0 0 1em #23cef5',
    },
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
    ':focus': {
      boxShadow: '0 0 1em #23cef5',
    },
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
    ':focus': {
      boxShadow: '0 0 1em #FE4566',
    },
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
  mainBtnDropdownArrow: {
    borderLeft: '1px #FFFFFF solid',
    ':focus': {
      boxShadow: 'none',
    },
    padding: '0 10px',
    marginLeft: '10px',
    marginRight: '-15px',
  },
  dropdownMenuPopoutArrow: {
    borderWidth: '9px',
    borderStyle: 'solid',
    borderColor: '#FFF transparent transparent #FFF',
    borderImage: 'initial',
    transform: 'rotate(45deg)',
    borderRadius: '3px',
    boxShadow: '-6px -6px 6px -5px rgba(0,0,0,0.29)',
    width: '0px',
    height: '0px',
    zIndex: '4',
    position: 'absolute',
    right: '8px',
    top: '32px',
  },
};

export class Button extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mouseOver: false,
    };
  }

  render() {
    let inner;
    let mitelStyle;

    if (window.location.hostname.split('.')[0].indexOf('mitel') !== -1) {
      mitelStyle = true;
    } else {
      mitelStyle = false;
    }

    if (!this.props.mouseOverText || !this.state.mouseOver) {
      if (this.props.iconName) {
        inner = <Icon name={this.props.iconName} />;
      } else if (typeof this.props.text === 'object') {
        if (this.props.hasSubButtons) {
          inner = (
            <span>
              <FormattedMessage {...this.props.text} /> {this.props.children}
            </span>
          );
        } else {
          inner = <FormattedMessage {...this.props.text} />;
        }
      } else if (typeof this.props.text === 'string') {
        inner = this.props.text;
      } else {
        inner = this.props.children;
      }
    } else {
      inner = <FormattedMessage {...this.props.mouseOverText} />;
    }

    let title;
    if (
      typeof this.props.title === 'object' &&
      Object.prototype.hasOwnProperty.call(this.props.title, 'id')
    ) {
      title = this.props.intl.formatMessage(this.props.title);
    } else {
      title = this.props.title;
    }

    return (
      <div
        style={styles.wrapper}
        data-tip
        data-for={this.props.tooltipText.id}
        data-offset={this.props.tooltipOffset}
      >
        <button
          id={this.props.id}
          type="button"
          style={[
            styles.base,
            styles[this.props.type],
            mitelStyle && styles.MitelStyle,
            this.props.disabled && styles[this.props.type].disabled,
            this.props.disabled && styles.disabled,
            this.props.iconName && styles.isIcon,
            this.props.clear && styles.clear,
            this.props.subMenuOpen && { position: 'relative' },
            this.props.style,
          ]}
          tabIndex={this.props.tabIndex}
          onClick={this.props.onClick}
          disabled={this.props.disabled}
          onMouseEnter={() => this.setState({ mouseOver: true })}
          onMouseLeave={() => this.setState({ mouseOver: false })}
          title={title}
        >
          {inner}
          {this.props.hasSubMenu && (
            <i
              style={styles.mainBtnDropdownArrow}
              className="fa fa-caret-down"
              key="fa-caret-down"
            />
          )}
          {this.props.subMenuOpen && (
            <div style={styles.dropdownMenuPopoutArrow} />
          )}
        </button>

        {this.props.tooltipText.id && (
          <Tooltip
            text={this.props.tooltipText}
            id={this.props.tooltipText.id}
          />
        )}
      </div>
    );
  }
}

Button.propTypes = {
  intl: intlShape,
  text: PropTypes.any,
  mouseOverText: PropTypes.object,
  iconName: PropTypes.string,
  children: PropTypes.element,
  tabIndex: PropTypes.number,
  type: PropTypes.oneOf(possibleTypes),
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  clear: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  id: PropTypes.string.isRequired,
  hasSubButtons: PropTypes.bool,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  hasSubMenu: PropTypes.bool,
  subMenuOpen: PropTypes.bool,
  tooltipText: PropTypes.shape({
    id: PropTypes.string,
    defaultMessage: PropTypes.string,
  }),
  tooltipOffset: PropTypes.string,
};

Button.defaultProps = {
  tabIndex: 0,
  tooltipText: {
    id: '',
    defaultMessage: '',
  },
};

export default injectIntl(Radium(Button));
