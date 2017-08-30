/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/**
*
* ButtonSplitMenu
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

     <ButtonSplitMenu buttonConfig={buttonConfig} />
  */
import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';

import Button from 'components/Button';
import ButtonSplitMenuItem from 'components/ButtonSplitMenuItem';

import { buttonConfigPropTypes } from 'components/ButtonLayout';

const styles = {
  buttonContainer: {
    position: 'relative',
    zIndex: 10,
  },
  clickMask: {
    position: 'absolute',
    right: 0,
    height: '34px',
    zIndex: 100,
    top: '-7px',
    width: '25px',
  },
  clickMaskDisabled: {
    cursor: 'default',
  },
  clickMaskEnabled: {
    cursor: 'pointer',
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
    borderRadius: '3px 0 0 3px',
    padding: '9px 0px 9px 17px',
    position: 'relative',
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

class ButtonSplitMenu extends React.Component {
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
              (<ButtonSplitMenuItem
                key={subBtn.id}
                id={`submenu-${subBtn.id}`}
                customStyles={[
                  styles.subBtn,
                  subBtn.style && subBtn.style,
                  subBtn.activeSubButtonStyle && subBtn.activeSubButtonStyle,
                  7,
                ]}
                clickCallback={subBtn.onClick}
                hideSubMenu={this.hideSubMenu}
                text={subBtn.text}
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
    let mainButton = {};

    // create a new array with everything but the main button
    const subButtons = buttons.filter((button) => {
      if (button.isMainBtn) {
        // ...and, when we find the main button, assign it!
        mainButton = button;
      }
      return !button.isMainBtn;
    });

    if (mainButton && subButtons) {
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
            id={`${mainButton.id}-main-button`}
            type={mainButton.type}
            text={mainButton.text}
            disabled={mainButton.disabled}
            onClick={mainButton.onClick}
            key={mainButton.id}
            hasSubButtons={!!subButtons}
            style={styles.hasToggle}
          >
            {this.renderSubMenuToggleArrow(mainButton.id, !!subButtons)}
          </Button>
          <div
            className="button-dropdown-click-mask"
            style={[
              styles.clickMask,
              !mainButton.disabled
                ? styles.clickMaskEnabled
                : styles.clickMaskDisabled,
            ]}
            onClick={() => {
              if (!mainButton.disabled) {
                this.setState({
                  showSubMenu: !this.state.showSubMenu,
                });
              }
            }}
          >
            &nbsp;
          </div>

          {this.renderSubMenu(subButtons, this.state.showSubMenu)}
        </span>
      );
    } else {
      throw new Error(
        `mainButton and subButtons not found in config ${this.props
          .buttonConfig}`
      );
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

ButtonSplitMenu.propTypes = {
  buttonConfig: PropTypes.arrayOf(PropTypes.shape(buttonConfigPropTypes))
    .isRequired,
};

export default Radium(ButtonSplitMenu);
