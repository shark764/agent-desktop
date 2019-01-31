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

import ButtonConfigPropTypes from 'containers/ContentArea/propTypes';

// Messages:
import messages from './messages';

// Styles:
const styles = {
  subMenu: {
    position: 'absolute',
    paddingTop: '17px',
    background: 'white',
    right: '10px',
    zIndex: 3,
    width: '188px',
    boxShadow: '0px 0px 2px 0px rgba(42, 45, 41, 0.63)',
  },
  subMenuExpanded: {
    position: 'absolute',
    background: 'white',
    right: '10px',
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
  clickMask: {
    position: 'fixed',
    top: '0px',
    left: '0px',
    width: '100%',
    height: '100%',
    zIndex: 2,
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
      this.props.interaction.direction !== 'agent-initiated' &&
      this.props.interaction.status !== 'wrapup'
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
    this.setState((prevState) => ({ showSubMenu: !prevState.showSubMenu }));
  };

  toggleTransferMenu = () => {
    this.setState((prevState) => ({
      showTransferMenu: !prevState.showTransferMenu,
    }));
  };

  // FinalRender:
  render() {
    return (
      <div>
        {this.state.showSubMenu && (
          <div style={styles.clickMask} onClick={this.toggleSubMenu} />
        )}
        <Button
          type="primaryBlue"
          title="actionsButton"
          id="actionsButton"
          text={messages.actions}
          onClick={this.toggleSubMenu}
          hasSubMenu
          subMenuOpen={this.state.showSubMenu}
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
            {this.props.interaction.status !== 'wrapup' &&
              !this.state.showTransferMenu && (
              <WrapUpToggle
                interaction={this.props.interaction}
                type="actionsMenu"
              />
            )}
            {this.state.showTransferMenu && (
              <TransferMenu
                setShowTransferMenu={this.toggleSubMenu}
                nonVoice
                style={{ height: 'calc(100vh - 214px)' }}
              />
            )}
            {this.props.interaction.channelType !== 'voice' &&
              this.props.interaction.direction !== 'agent-initiated' &&
              this.props.interaction.status !== 'wrapup' &&
              !this.props.interaction.sendingReply &&
              !this.props.interaction.isColdTransferring && (
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
                onClick={
                  this.state.showTransferMenu
                    ? this.toggleSubMenu
                    : this.toggleTransferMenu
                }
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
                  onClick={() => {
                    button.onClick();
                    if (button.id !== 'copy-chat-transcript') {
                      this.toggleSubMenu();
                    }
                  }}
                  disabled={button.disabled}
                  title={button.title}
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
  buttonConfig: PropTypes.arrayOf(PropTypes.shape(ButtonConfigPropTypes)),
};

// ContextTypes:
ActionsMenu.contextTypes = {
  toolbarMode: PropTypes.bool,
};

export default Radium(ActionsMenu);
