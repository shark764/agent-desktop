/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/**
*
* ButtonMenu
*
*/

/*
 * IMPLEMENTATION NOTE: To create a split button, you need to pass in an array of objects,
 * with each object being just a list of properties necessary to generate the button in
 * both default as well as split mode.
 *
 * ALSO, you must add a property called "isMainBtn" and set it to true for the button you
 * want to have display as the main, full-color one with the dropdown arrow.
 * ex:
      buttonConfig = [
       {
         id: 'cancelEmail',
         type: 'primaryRed',
         text: messages.cancel,
         onClick: this.onEmailCancelReply,
         style: { marginRight: '8px' },
       },
       {
         id: 'sendEmail',
         type: 'primaryRed',
         text: messages.send,
         onClick: () => this.sendEmail(),
         isMainBtn: true,
       },
     ];

     <ButtonMenu buttonConfig={buttonConfig} />
  */
import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';

import Button from 'components/Button';
import ButtonMenuItem from 'components/ButtonMenuItem';

import { buttonConfigPropTypes } from 'components/ButtonLayout';

const styles = {
  buttonContainer: {
    position: 'relative',
    zIndex: 10,
  },
  subMenu: {
    listStyle: 'none',
    margin: 0,
    padding: '0',
    border: '1px solid #E4E4E4',
    borderRadius: '3px',
    boxShadow: '0 0 3px 1px rgba(0,0,0,0.08)',
    position: 'absolute',
    right: 0,
    backgroundColor: '#FFFFFF',
    minWidth: '200px',
  },
  subBtn: {
    padding: '10px 7px',
    margin: '0',
    fontSize: '14px',
    lineHeight: '17px',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: '#DEF8FE',
    },
  },
  dropdownArrow: {
    borderLeft: '1px #FFFFFF solid',
    ':focus': {
      boxShadow: 'none',
    },
    padding: '0 10px',
    margin: '0 0 0 10px',
  },
  hasToggle: {
    padding: '9px 0px 9px 17px',
  },
  outerClickMask: {
    position: 'fixed',
    top: '0px',
    left: '0px',
    height: '100vh',
    width: '100vw',
    zIndex: 2,
  },
};

class ButtonMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showSubMenu: false,
    };
  }

  hideSubMenu = () => {
    this.setState({
      showSubMenu: false,
    });
  };

  renderSubMenu(subButtons, hideShowSubMenu) {
    if (hideShowSubMenu) {
      return (
        <span style={styles.buttonContainer}>
          <ul style={styles.subMenu}>
            {subButtons.map((subBtn) =>
              (<ButtonMenuItem
                key={subBtn.id}
                id={`submenu-${subBtn.id}`}
                customStyles={[styles.subBtn, subBtn.style && subBtn.style, 7]}
                isSelected={subBtn.isSelected}
                clickCallback={subBtn.onClick}
                hideSubMenu={this.hideSubMenu}
                text={subBtn.text}
                disabled={subBtn.disabled}
              />)
            )}
          </ul>
        </span>
      );
    }

    return undefined;
  }

  renderSubMenuToggleArrow(buttonId, hasSubButtons) {
    if (hasSubButtons) {
      return (
        <i
          className="fa fa-caret-down"
          style={styles.dropdownArrow}
          key={`${buttonId}-toggle-icon`}
        />
      );
    }

    return undefined;
  }

  renderButtons(buttons) {
    if (buttons) {
      return (
        <span style={styles.buttonContainer}>
          {this.state.showSubMenu &&
            <div
              style={styles.outerClickMask}
              onClick={() => {
                this.setState({
                  showSubMenu: false,
                });
              }}
            />}
          <Button
            id={this.props.id}
            key={this.props.id}
            type={this.props.type}
            text={this.props.text}
            onClick={() => {
              this.setState({
                showSubMenu: !this.state.showSubMenu,
              });
            }}
            hasSubButtons={!!buttons}
            style={styles.hasToggle}
          >
            {this.renderSubMenuToggleArrow(this.props.id, !!buttons)}
          </Button>
          {this.renderSubMenu(buttons, this.state.showSubMenu)}
        </span>
      );
    } else {
      throw new Error(`buttons not found in config ${this.props.buttonConfig}`);
    }
  }

  render() {
    return (
      <div>
        {this.renderButtons(this.props.buttonConfig)}
      </div>
    );
  }
}

ButtonMenu.propTypes = {
  buttonConfig: PropTypes.arrayOf(PropTypes.shape(buttonConfigPropTypes))
    .isRequired,
  id: PropTypes.string.isRequired,
  type: PropTypes.string,
  text: PropTypes.any,
};

export default Radium(ButtonMenu);
