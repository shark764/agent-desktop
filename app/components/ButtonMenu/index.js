/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/**
*
* ButtonMenu
*
*/

/*
 * IMPLEMENTATION NOTE: To create a button with a submenu (as we do in the toolbar), you need to pass in an object via a prop called "menuItems". It will contain the values necessary to generate things
 like buttons, toggle switches, or any other element you'd like to put into the menu (at the time of this comment, we're only doing buttons and a toggle).
 *
EXAMPLE:

 const menuItems = {
   buttonConfig: [
     {
       id: 'test-id-1',
       type: 'primaryRed',
       text: {
         id: 'app.containers.EmailContentArea.send',
         defaultMessage: 'Send',
       },
       onClick: mockFunc,
       disabled: false,
       style: {
         marginRight: '8px',
       },
     },
     {
       id: 'test-id-2',
       type: 'primaryBlue',
       text: {
         id: 'app.containers.EmailContentArea.send',
         defaultMessage: 'Send',
       },
       onClick: mockFunc,
       disabled: false,
       style: {
         marginRight: '8px',
       },
     },
   ],
   wrapupToggleConfig: {
     toggleId: 'toggle-test-id',
     icons: false,
     onChange: mockFunc,
     toggleDisabled: false,
     checked: true,
   },
 };

   <ButtonMenu
    menuItems={menuItems}
    id="buttonMenuId"
    type="primaryBlue"
    text="test text"
  />
  */
import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';
import Toggle from 'react-toggle';
import { FormattedMessage } from 'react-intl';

import Button from 'components/Button';
import ButtonMenuItem from 'components/ButtonMenuItem';

import { menuItemsPropTypes } from 'components/ButtonLayout';

import messages from './messages';

const styles = {
  menuContainer: {
    backgroundColor: '#fff',
    margin: '0 3px 0',
    zIndex: 10,
    position: 'absolute',
    right: 0,
    width: '170px',
    padding: '15px',
    border: '1px solid #E4E4E4',
    borderRadius: '3px',
    boxShadow: '0 0 3px 1px rgba(0,0,0,0.08)',
  },
  toggleWrapupLabel: {
    marginRight: '5px',
    float: 'left',
  },
  toggleWrapup: {
    float: 'right',
  },
  menuButtons: {
    listStyle: 'none',
    margin: 0,
    width: '100%',
    padding: '0',
  },
  indivMenuBtn: {
    padding: '7px 10px',
    margin: '15px 0 0',
    fontSize: '14px',
    lineHeight: '17px',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: '#f3f3f3',
    },
    border: '1px solid #E0E0E0',
    textAlign: 'center',
    width: '100%',
    color: '#6D6C6D',
  },
  mainBtnDropdownArrow: {
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
    zIndex: '3',
    position: 'absolute',
    right: '2px',
    top: 0,
  },
  buttonSection: {
    textAlign: 'right',
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

  renderSubMenu(subButtons, hideShowSubMenu, wrapupToggle) {
    if (hideShowSubMenu) {
      return (
        <div style={styles.menuContainer}>
          <div style={styles.dropdownMenuPopoutArrow} />
          {wrapupToggle &&
            <div>
              <label htmlFor="wrapupToggle" style={styles.toggleWrapupLabel}>
                <FormattedMessage {...messages.wrapup} />
              </label>
              <Toggle
                id={wrapupToggle.toggleId}
                icons={wrapupToggle.icons}
                onChange={wrapupToggle.onChange}
                disabled={wrapupToggle.toggleDisabled}
                checked={wrapupToggle.checked}
                style={styles.toggleWrapup}
              />
            </div>}
          <ul style={styles.menuButtons}>
            {subButtons.map((subBtn) =>
              (<ButtonMenuItem
                key={subBtn.id}
                id={`submenu-${subBtn.id}`}
                customStyles={[
                  styles.indivMenuBtn,
                  subBtn.style && subBtn.style,
                ]}
                isSelected={subBtn.isSelected}
                clickCallback={subBtn.onClick}
                hideSubMenu={this.hideSubMenu}
                text={subBtn.text}
                disabled={subBtn.disabled}
              />)
            )}
          </ul>
        </div>
      );
    }

    return undefined;
  }

  renderSubMenuToggleArrow(buttonId, hasSubButtons) {
    if (hasSubButtons) {
      return (
        <i
          className="fa fa-caret-down"
          style={styles.mainBtnDropdownArrow}
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
            {this.renderSubMenuToggleArrow(
              this.props.id,
              !!buttons || !!this.props.menuItems.wrapupToggleConfig
            )}
          </Button>
          {this.renderSubMenu(
            buttons,
            this.state.showSubMenu,
            this.props.menuItems.wrapupToggleConfig
          )}
        </span>
      );
    } else {
      throw new Error(
        `buttons not found in config ${this.props.menuItems.buttonConfig}`
      );
    }
  }

  render() {
    return (
      <div style={styles.buttonSection}>
        {this.renderButtons(this.props.menuItems.buttonConfig)}
      </div>
    );
  }
}

ButtonMenu.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string,
  text: PropTypes.any,
  menuItems: PropTypes.shape(menuItemsPropTypes),
};

export default Radium(ButtonMenu);
