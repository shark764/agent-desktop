/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/**
*
* ContentAreaTop
*
*/

import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Radium from 'radium';
import Toggle from 'react-toggle';
import { FormattedMessage } from 'react-intl';

import ErrorBoundary from 'components/ErrorBoundary';

import SidePanelToolbarBtn from 'containers/SidePanelToolbarBtn';
import ButtonLayout, { buttonConfigPropTypes } from 'components/ButtonLayout';

import { selectHasCrmPermissions } from 'containers/App/selectors';
import {
  getSelectedInteractionIsScriptOnly,
  getSelectedInteractionIsVoice,
} from 'containers/SidePanel/selectors';
import {
  selectIsSidePanelCollapsed,
  selectSidePanelPx,
  selectIsInteractionsBarCollapsed,
  getSelectedInteraction,
} from 'containers/AgentDesktop/selectors';
import { updateWrapupDetails } from 'containers/AgentDesktop/actions';

import messages from './messages';

export class ContentAreaTop extends React.Component {
  styles = {
    fromButtonsContainer: {
      borderBottom: '1px solid #D0D0D0',
      padding: '10px 5px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    from: {
      display: 'inline-block',
      fontSize: '20px',
      fontWeight: 'bold',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    buttons: {
      marginLeft: '10px',
    },
    rightHeaderContainer: {
      display: 'flex',
      alignItems: 'center',
      flexShrink: 0,
    },
    wrapupContainer: {
      display: 'flex',
      alignItems: 'center',
    },
    toggleWrapupLabel: {
      marginRight: '5px',
    },
    wrapupStatusUpdateInProgress: {
      pointerEvents: 'none',
      opacity: '.5',
    },
  };

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

  generateButtons = (interaction, buttons) => {
    let buttonConfig = buttons;
    if (
      this.context.toolbarMode &&
      interaction.status !== 'wrapup' &&
      interaction.wrapupDetails.wrapupUpdateAllowed
    ) {
      // if we're in toolbar mode and creating a drop-down button
      // w/wrapup status options
      buttonConfig = [
        // take the existing list of buttons...
        ...buttons.slice(),
        // ...and append to that list the wrapup enable/disable dropdown items
        {
          id: 'wrapup-on-submenu-item',
          text: messages.wrapupOn,
          onClick: this.enableWrapup,
          // here is where we add the style for indicating whether a
          // wrapup status is active or inactive
          isSelected: interaction.wrapupDetails.wrapupEnabled,
          // this conditional style property creates a disabled UI for while the
          // wrapup status update is happening
          style: this.props.interaction.wrapupDetails.loadingWrapupStatusUpdate
            ? this.styles.wrapupStatusUpdateInProgress
            : {},
        },
        {
          id: 'wrapup-off-submenu-item',
          text: messages.wrapupOff,
          onClick: this.disableWrapup,
          isSelected: !interaction.wrapupDetails.wrapupEnabled,
          style: this.props.interaction.wrapupDetails.loadingWrapupStatusUpdate
            ? this.styles.wrapupStatusUpdateInProgress
            : {},
        },
      ];
    }

    return (
      <ButtonLayout
        buttonConfig={buttonConfig}
        buttonMenuConfig={{
          id: 'actionsButton',
          type: 'primaryBlue',
          text: messages.actions,
        }}
      />
    );
  };

  render() {
    // This is all to solve the overflow ellipsis issue in the from container
    let sidePanelHasTabs = false;
    if (
      (this.props.hasCrmPermissions && !this.context.toolbarMode) ||
      (this.props.selectedInteractionHasScripts &&
        !this.props.selectedInteractionIsScriptOnly &&
        !this.props.selectedInteractionIsVoice)
    ) {
      sidePanelHasTabs = true;
    }

    let sidePanelSpacingInPx = 0;
    if (sidePanelHasTabs && !this.props.isSidePanelCollapsed) {
      sidePanelSpacingInPx += this.props.sidePanelPx;
    }
    if (!this.context.toolbarMode) {
      sidePanelSpacingInPx += 283;
    } else if (!this.props.isInteractionsBarCollapsed) {
      sidePanelSpacingInPx += 72;
    }

    return (
      <div
        style={[
          this.styles.fromButtonsContainer,
          {
            minWidth: '290px',
            maxWidth: `calc(100vw - ${sidePanelSpacingInPx}px - 30px)`,
          },
        ]}
      >
        <div style={this.styles.from} title={this.props.from}>
          {this.props.from}
        </div>
        <div style={this.styles.rightHeaderContainer}>
          {/*
            if we're NOT in toolbar mode, nor are we in the middle of a wrapup,
            display the toggle switch
          */}
          {!this.context.toolbarMode &&
            this.props.interaction.status !== 'wrapup' &&
            this.props.interaction.status !== 'work-ended-pending-script' &&
            <div id="wrapupContainer" style={this.styles.wrapupContainer}>
              <label
                htmlFor="wrapupToggle"
                style={this.styles.toggleWrapupLabel}
              >
                <FormattedMessage {...messages.wrapup} />
              </label>
              <Toggle
                id="toggleWrapup"
                icons={false}
                onChange={this.toggleWrapup}
                disabled={
                  !this.props.interaction.wrapupDetails.wrapupUpdateAllowed ||
                  this.props.interaction.wrapupDetails.loadingWrapupStatusUpdate
                }
                checked={this.props.interaction.wrapupDetails.wrapupEnabled}
              />
            </div>}
          <div style={this.styles.buttons}>
            {this.props.interaction.status !== 'work-ended-pending-script' &&
              <div>
                {this.generateButtons(
                  this.props.interaction,
                  this.props.buttonConfig
                )}
              </div>}
          </div>
        </div>
        <SidePanelToolbarBtn />
      </div>
    );
  }
}

ContentAreaTop.propTypes = {
  interaction: PropTypes.object.isRequired,
  from: PropTypes.node,
  buttonConfig: PropTypes.arrayOf(PropTypes.shape(buttonConfigPropTypes))
    .isRequired,
  hasCrmPermissions: PropTypes.bool,
  selectedInteractionIsScriptOnly: PropTypes.bool,
  selectedInteractionIsVoice: PropTypes.bool,
  isSidePanelCollapsed: PropTypes.bool.isRequired,
  sidePanelPx: PropTypes.number.isRequired,
  isInteractionsBarCollapsed: PropTypes.bool.isRequired,
  selectedInteractionHasScripts: PropTypes.bool,
  updateWrapupDetails: PropTypes.func,
};

ContentAreaTop.contextTypes = {
  toolbarMode: PropTypes.bool,
};

const mapStateToProps = (state, props) => ({
  hasCrmPermissions: selectHasCrmPermissions(state, props),
  selectedInteractionIsScriptOnly: getSelectedInteractionIsScriptOnly(
    state,
    props
  ),
  selectedInteractionIsVoice: getSelectedInteractionIsVoice(state, props),
  isSidePanelCollapsed: selectIsSidePanelCollapsed(state, props),
  sidePanelPx: selectSidePanelPx(state, props),
  isInteractionsBarCollapsed: selectIsInteractionsBarCollapsed(state, props),
  selectedInteractionHasScripts:
    getSelectedInteraction(state, props) &&
    getSelectedInteraction(state, props).script !== undefined,
});

function mapDispatchToProps(dispatch) {
  return {
    updateWrapupDetails: (interactionId, wrapupDetails) =>
      dispatch(updateWrapupDetails(interactionId, wrapupDetails)),
  };
}

export default ErrorBoundary(
  connect(mapStateToProps, mapDispatchToProps)(Radium(ContentAreaTop))
);
