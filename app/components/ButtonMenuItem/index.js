/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/**
*
* ButtonMenuItem
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';
import { FormattedMessage } from 'react-intl';

import checkStatus from 'assets/icons/check_status.png';

const styles = {
  selectedOption: {
    cursor: 'not-allowed',
    pointerEvents: 'none',
    opacity: '.65',
    backgroundImage: `url(${checkStatus})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '90% center',
    backgroundColor: '#fff',
    // since there is a default hover color we're using for the dropdowns,
    // we need to explicitly override that in order to prevent
    // it from displaying.
    ':hover': {
      backgroundColor: '#fff',
    },
    backgroundSize: '20px',
    padding: '7px 25% 7px 10px',
  },
  disabledOption: {
    cursor: 'not-allowed',
    pointerEvents: 'none',
    opacity: '.65',
  },
};

export class ButtonMenuItem extends React.Component {
  executeOnClick = () => {
    this.props.clickCallback();
    this.props.hideSubMenu();
  };

  render() {
    return (
      <li
        key={this.props.id}
        style={[
          this.props.customStyles,
          this.props.isSelected && styles.selectedOption,
          this.props.disabled && styles.disabledOption,
        ]}
        id={`button-submenu-listitem-${this.props.id}`}
        onClick={this.executeOnClick}
      >
        <FormattedMessage {...this.props.text} />
      </li>
    );
  }
}

ButtonMenuItem.propTypes = {
  id: PropTypes.string.isRequired,
  customStyles: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  isSelected: PropTypes.bool,
  text: PropTypes.any,
  clickCallback: PropTypes.func,
  hideSubMenu: PropTypes.func,
  disabled: PropTypes.bool,
};

export default Radium(ButtonMenuItem);
