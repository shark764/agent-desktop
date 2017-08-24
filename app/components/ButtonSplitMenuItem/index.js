/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/**
*
* ButtonSplitMenuItem
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';
import { FormattedMessage } from 'react-intl';

export class ButtonSplitMenuItem extends React.Component {
  executeOnClick = () => {
    this.props.clickCallback();
    this.props.hideSubMenu();
  }


  render() {
    return (
      <li
        key={this.props.id}
        style={this.props.customStyles}
        id={`button-submenu-listitem-${this.props.id}`}
        onClick={this.executeOnClick}
      >
        <FormattedMessage {...this.props.text} />
      </li>
    )
  }
}

ButtonSplitMenuItem.propTypes = {
  id: PropTypes.string.isRequired,
  customStyles: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  text: PropTypes.any,
  clickCallback: PropTypes.func,
  hideSubMenu: PropTypes.func,
};

export default Radium(ButtonSplitMenuItem);
