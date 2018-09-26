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

import IconSVG from 'components/IconSVG';

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
    minHeight: '29px',
  },
  wrapupContainerDesktopActionsMenu: {
    paddingRight: '15px',
    minWidth: '113px',
    minHeight: '29px',
  },
  wrapUpLabel: {
    marginRight: '10px',
  },
  togglePosition: {
    float: 'right',
    marginTop: '5px',
  },
};

export class WrapUpToggle extends React.Component {
  toggleWrapup = () => {
    const { interactionId, wrapupDetails } = this.props.interaction;
    this.props.updateWrapupDetails(interactionId, {
      loadingWrapupStatusUpdate: true,
    });
    // timer is for if the request to enable/disable doesn't return, we reset so the user can try again
    this.timer = setTimeout(
      () =>
        this.props.updateWrapupDetails(interactionId, {
          loadingWrapupStatusUpdate: false,
        }),
      15000
    );
    if (wrapupDetails.wrapupEnabled) {
      CxEngage.interactions.disableWrapup(
        {
          interactionId,
        },
        () => clearTimeout(this.timer)
      );
    } else {
      CxEngage.interactions.enableWrapup(
        {
          interactionId,
        },
        () => clearTimeout(this.timer)
      );
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
        <div style={styles.togglePosition}>
          {this.props.interaction.wrapupDetails.loadingWrapupStatusUpdate ? (
            <IconSVG id="loadingConfirm" name="loading" width="24px" />
          ) : (
            <Toggle
              id="wrapUpToggle"
              onChange={this.toggleWrapup}
              disabled={
                !this.props.interaction.wrapupDetails.wrapupUpdateAllowed
              }
              checked={this.props.interaction.wrapupDetails.wrapupEnabled}
            />
          )}
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

export default connect(
  null,
  mapDispatchToProps
)(Radium(WrapUpToggle));
