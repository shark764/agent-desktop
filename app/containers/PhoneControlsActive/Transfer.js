/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Radium from 'radium';

import { selectHasAgentExperienceTransferMenuQueuesViewPermission } from 'containers/TransferMenu/selectors';
import { selectQueuesSet } from 'containers/AgentDesktop/selectors';
import { updateQueues } from 'containers/TransferMenu/actions';
import CircleIconButton from 'components/CircleIconButton';
import TransferMenu from 'containers/TransferMenu';
import messages from './messages';

const styles = {
  topTriangle: {
    width: '0px',
    height: '0px',
    borderTop: 'none',
    borderLeft: '8px solid transparent',
    borderRight: '8px solid transparent',
    borderBottom: '10px solid #F3F3F3',
    position: 'absolute',
    marginTop: '4px',
    left: '14px',
    zIndex: 4,
  },
  mask: {
    position: 'fixed',
    top: '0px',
    left: '0px',
    height: '100vh',
    width: '100vw',
    zIndex: 3,
  },
  transferPhoneControlsPopupMenu: {
    width: '282px',
    marginTop: '10px',
    backgroundColor: '#FFFFFF',
    color: '#4B4B4B',
    boxShadow: '0 0 6px 0 rgba(0,0,0,0.23)',
    borderRadius: '3px',
    overflow: 'auto',
    position: 'absolute',
    zIndex: 11,
    fontSize: '14px',
    left: '-119px',
  },
  transferPhoneControlsPopupMenuToolbar: {
    left: 0,
    width: '100%',
    borderRadius: 0,
  },
  circleIconButtonRow: {
    padding: '0 1.5px',
  },
};

export class Transfer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showTransferMenu: false,
    };
  }

  setShowTransferMenu = showTransferMenu => {
    this.setState({
      showTransferMenu,
    });
  };

  toggleTransferMenu = () => {
    if (
      !this.props.queuesSet &&
      this.props.hasAgentExperienceTransferMenuQueuesViewPermission
    ) {
      this.props.updateQueues();
    }
    this.setShowTransferMenu(!this.state.showTransferMenu);
  };

  hideTransferMenu = () => {
    this.setShowTransferMenu(false);
  };

  renderTransferMenuTypes = forIcon => {
    if (this.state.showTransferMenu) {
      if (forIcon && this.context.toolbarMode) {
        return <div style={styles.topTriangle} />;
      } else {
        return (
          <span>
            <div
              id="transferMask"
              style={styles.mask}
              onClick={this.hideTransferMenu}
            />
            {!this.context.toolbarMode && <div style={styles.topTriangle} />}
            <div
              id="transfersContainer"
              style={[
                styles.transferPhoneControlsPopupMenu,
                this.context.toolbarMode &&
                  styles.transferPhoneControlsPopupMenuToolbar,
              ]}
            >
              <TransferMenu
                setShowTransferMenu={this.toggleTransferMenu}
                style={{ height: 'calc(100vh - 118px)' }}
              />
            </div>
          </span>
        );
      }
    }
    return null;
  };

  render() {
    if (this.props.canTransfer && !this.props.connectingTransfers) {
      return (
        <span>
          <CircleIconButton
            id="transferButton"
            name="transfer"
            title={messages.transferMenu}
            active={this.state.showTransferMenu}
            onClick={this.toggleTransferMenu}
            style={styles.circleIconButtonRow}
            innerElement={this.renderTransferMenuTypes(true)}
          />
          {this.context.toolbarMode && this.renderTransferMenuTypes()}
        </span>
      );
    }
    return null;
  }
}

Transfer.propTypes = {
  canTransfer: PropTypes.bool.isRequired,
  connectingTransfers: PropTypes.bool.isRequired,
  queuesSet: PropTypes.bool.isRequired,
  hasAgentExperienceTransferMenuQueuesViewPermission: PropTypes.bool.isRequired,
  updateQueues: PropTypes.func.isRequired,
};

Transfer.contextTypes = {
  toolbarMode: PropTypes.bool,
};

const mapStateToProps = (state, props) => ({
  queuesSet: selectQueuesSet(state, props),
  hasAgentExperienceTransferMenuQueuesViewPermission: selectHasAgentExperienceTransferMenuQueuesViewPermission(
    state,
    props
  ),
});

export const actions = {
  updateQueues,
};

export default connect(
  mapStateToProps,
  actions
)(Radium(Transfer));
