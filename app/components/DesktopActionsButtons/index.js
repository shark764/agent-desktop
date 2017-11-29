/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/**
 *
 * DesktopActionsButtons
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

import TransferMenu from 'containers/TransferMenu';

import Button from 'components/Button';
import WrapUpToggle from 'components/WrapUpToggle';

import { buttonConfigPropTypes } from 'containers/ContentArea';

import messages from './messages';

const styles = {
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
    right: '96px',
    top: '-1px',
  },
  rightHeaderContainer: {
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
  },
  transferMenuPopOut: {
    background: 'white',
    position: 'absolute',
    top: '52px',
    zIndex: 3,
    boxShadow: '0px 0px 2px 0px rgba(42, 45, 41, 0.63)',
  },
  cancelTransferButton: {
    width: '80%',
    marginLeft: '10%',
    marginBottom: '20px',
    marginTop: '25px',
  },
};

class DesktopActionsButtons extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showTransferMenu: false,
    };
  }

  hotKeys = (e) => {
    // 27 is esc on the keyboard
    if (e.which === 27 && this.state.showTransferMenu === true) {
      this.toggleTransferMenu();
    }
    if (e.altKey) {
      // 84 is T key on keyboard
      if (e.which === 84) {
        this.toggleTransferMenu();
      }
    }
  };

  componentWillMount() {
    document.addEventListener('keydown', this.hotKeys);
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.hotKeys);
  }

  toggleTransferMenu = () => {
    this.setState({ showTransferMenu: !this.state.showTransferMenu });
  };

  render() {
    return (
      <div style={styles.rightHeaderContainer}>
        {!this.context.toolbarMode &&
          this.props.interaction.status !== 'wrapup' &&
          this.props.interaction.status !== 'work-ended-pending-script' && (
            <WrapUpToggle interaction={this.props.interaction} type="" />
          )}
        {this.state.showTransferMenu && (
          <div className="transferMenuPopOut" style={styles.transferMenuPopOut}>
            <TransferMenu
              interactionId={this.props.interaction.interactionId}
              nonVoice
            />
            <div style={styles.dropdownMenuPopoutArrow} />
            <Button
              style={styles.cancelTransferButton}
              type="secondary"
              title="cancel"
              id="cancelTransferButton"
              text={messages.cancel}
              onClick={this.toggleTransferMenu}
            />
          </div>
        )}
        {this.props.interaction.channelType !== 'voice' && (
          <Button
            style={{ marginRight: '10px', padding: '9px 17px' }}
            type="secondary"
            title="transfer"
            id="transferButton"
            text={messages.transfer}
            onClick={this.toggleTransferMenu}
          />
        )}
        {this.props.buttonConfig.map((button) => (
          <Button
            key={button.id}
            style={{ marginRight: '10px' }}
            id={button.id}
            type={button.type}
            text={button.text}
            icons={button.icons}
            onClick={button.onClick}
          />
        ))}
      </div>
    );
  }
}

DesktopActionsButtons.propTypes = {
  interaction: PropTypes.object.isRequired,
  buttonConfig: PropTypes.arrayOf(PropTypes.shape(buttonConfigPropTypes)),
};

export default DesktopActionsButtons;
