/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * ActionsMenu
 *
 */

// Dependencies:
import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';

// Containers
import TransferMenu from 'containers/TransferMenu';

// Components
import Button from 'components/Button';
import WrapUpToggle from 'components/WrapUpToggle';

import { buttonConfigPropTypes } from 'containers/ContentArea';

// Messages:
import messages from './messages';

// Styles:
const styles = {
  subMenu: {
    position: 'absolute',
    background: 'white',
    right: '8px',
    top: '45px',
    zIndex: 3,
    width: '188px',
    boxShadow: '0px 0px 2px 0px rgba(42, 45, 41, 0.63)',
  },
  subMenuExpanded: {
    position: 'absolute',
    background: 'white',
    right: '8px',
    top: '45px',
    zIndex: 3,
    width: '300px',
    boxShadow: '0px 0px 2px 0px rgba(42, 45, 41, 0.63)',
  },
  actionWrapupLabel: {
    marginRight: '58px',
  },
  toolbarActionsButtons: {
    marginBottom: '15px',
    width: '80%',
    marginLeft: '10%',
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
    right: '19px',
    top: '-1px',
  },
};

export class ActionsMenu extends React.Component {
  // Constructor:
  constructor(props) {
    super(props);
    this.state = {
      showTransferMenu: false,
      showSubMenu: false,
    };
  }
  // HotKeys:
  hotKeys = (e) => {
    // 27 is letter T on the keyboard
    if (
      e.which === 27 &&
      this.state.showTransferMenu === true &&
      this.props.interaction.direction !== 'outbound'
    ) {
      this.toggleTransferMenu();
      if (this.state.showSubMenu) {
        this.toggleSubMenu();
      }
    }
    if (e.altKey) {
      // 84 is esc key on keyboard
      if (e.which === 84) {
        if (this.context.toolbarMode) {
          this.toggleSubMenu();
        }
        this.toggleTransferMenu();
      }
    }
  };

  // Lifecycles Events:
  componentWillMount() {
    document.addEventListener('keydown', this.hotKeys);
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.hotKeys);
  }

  // Methods:
  toggleSubMenu = () => {
    this.setState({ showTransferMenu: false });
    this.setState({ showSubMenu: !this.state.showSubMenu });
  };
  toggleTransferMenu = () => {
    this.setState({ showTransferMenu: !this.state.showTransferMenu });
  };
  // FinalRender:
  render() {
    return (
      <div>
        <Button
          type="primaryBlue"
          title="actionsButton"
          id="actionsButton"
          text={messages.actions}
          onClick={this.toggleSubMenu}
          hasSubMenu
        />
        {this.state.showSubMenu && (
          <div
            className="SubMenu"
            style={
              this.state.showTransferMenu
                ? styles.subMenuExpanded
                : styles.subMenu
            }
          >
            <div style={styles.dropdownMenuPopoutArrow} />
            {this.props.interaction.status !== 'wrapup' &&
              !this.state.showTransferMenu && (
                <WrapUpToggle
                  interaction={this.props.interaction}
                  type="actionsMenu"
                />
              )}
            {this.state.showTransferMenu && (
              <TransferMenu
                interactionId={this.props.interaction.interactionId}
                nonVoice
              />
            )}
            {this.props.interaction.channelType !== 'voice' &&
              this.props.interaction.direction !== 'outbound' && (
                <Button
                  style={styles.toolbarActionsButtons}
                  type="secondary"
                  title="transfer"
                  id="transferButton"
                  text={
                    this.state.showTransferMenu
                      ? messages.cancel
                      : messages.transfer
                  }
                  onClick={this.toggleTransferMenu}
                />
              )}
            {!this.state.showTransferMenu &&
              this.props.buttonConfig.map((button) => (
                <Button
                  style={styles.toolbarActionsButtons}
                  key={button.id}
                  id={button.id}
                  type={this.context.toolbarMode ? 'secondary' : button.type}
                  text={button.text}
                  icons={button.icons}
                  onClick={button.onClick}
                />
              ))}
          </div>
        )}
      </div>
    );
  }
}

// PropTypes:
ActionsMenu.propTypes = {
  interaction: PropTypes.object.isRequired,
  buttonConfig: PropTypes.arrayOf(PropTypes.shape(buttonConfigPropTypes)),
};

// ContextTypes:
ActionsMenu.contextTypes = {
  toolbarMode: PropTypes.bool,
};

export default Radium(ActionsMenu);
