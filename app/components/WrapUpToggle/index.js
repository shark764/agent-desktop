/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/**
 *
 * WrapUpToggle
 *
 */
// Dependencies
import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Radium from 'radium';
import PropTypes from 'prop-types';

// Actions
import { updateWrapupDetails } from 'containers/AgentDesktop/actions';

// Components
import Toggle from 'react-toggle';

// Messages:
import messages from './messages';

// Styles:
const styles = {
  wrapupContainerActionsMenu: {
    width: '80%',
    marginLeft: '10%',
    display: 'inline-block',
    marginBottom: '15px',
  },
  wrapupContainerDesktopActionsMenu: {
    paddingRight: '15px',
    minWidth: '113px',
  },
  wrapUpLabel: {
    marginRight: '10px',
  },
};

export class WrapUpToggle extends React.Component {
  // Methods:
  setWrapupToggleStatusStart = (interactionId) => {
    this.props.updateWrapupDetails(interactionId, {
      loadingWrapupStatusUpdate: true,
    });
  };

  enableWrapup = () => {
    this.setWrapupToggleStatusStart(this.props.interaction.interactionId);
    CxEngage.interactions.enableWrapup({
      interactionId: this.props.interaction.interactionId,
    });
  };

  disableWrapup = () => {
    this.setWrapupToggleStatusStart(this.props.interaction.interactionId);
    CxEngage.interactions.disableWrapup({
      interactionId: this.props.interaction.interactionId,
    });
  };

  toggleWrapup = () => {
    if (this.props.interaction.wrapupDetails.wrapupEnabled) {
      this.disableWrapup(this.props.interaction.interactionId);
    } else {
      this.enableWrapup(this.props.interaction.interactionId);
    }
  };

  render() {
    return (
      <div
        id="wrapupContainer"
        style={
          this.props.type === 'actionsMenu'
            ? styles.wrapupContainerActionsMenu
            : styles.wrapupContainerDesktopActionsMenu
        }
      >
        <label htmlFor="wrapupToggle" style={styles.wrapUpLabel}>
          <FormattedMessage {...messages.wrapup} />
        </label>
        <div
          style={
            this.props.type === 'actionsMenu' && {
              float: 'right',
              marginTop: '5px',
            }
          }
        >
          <Toggle
            id="wrapUpToggle"
            onChange={this.toggleWrapup}
            disabled={
              !this.props.interaction.wrapupDetails.wrapupUpdateAllowed ||
              this.props.interaction.wrapupDetails.loadingWrapupStatusUpdate
            }
            checked={this.props.interaction.wrapupDetails.wrapupEnabled}
          />
        </div>
      </div>
    );
  }
}

// PropTypes:
WrapUpToggle.propTypes = {
  updateWrapupDetails: PropTypes.func,
  interaction: PropTypes.object.isRequired,
  type: PropTypes.string,
};

// StateToProps:

// DispatchToProps:
function mapDispatchToProps(dispatch) {
  return {
    updateWrapupDetails: (interactionId, wrapupDetails) =>
      dispatch(updateWrapupDetails(interactionId, wrapupDetails)),
  };
}

export default connect(null, mapDispatchToProps)(Radium(WrapUpToggle));
