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

import checkMark from 'assets/icons/checkMark.png';

import ErrorBoundary from 'components/ErrorBoundary';

import SidePanelToolbarBtn from 'containers/SidePanelToolbarBtn';
import ButtonLayout, { buttonConfigPropTypes } from 'components/ButtonLayout';

import {
  selectIsSidePanelCollapsed,
  selectSidePanelPx,
  selectIsInteractionsBarCollapsed,
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
    selectedOption: {
      pointerEvents: 'none',
      backgroundImage: `url(${checkMark})`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: '90% center',
      backgroundColor: '#fff',
      // since there is a default hover color we're using for the dropdowns,
      // we need to explicitly override that in order to prevent
      // it from displaying.
      ':hover': {
        backgroundColor: '#fff',
      },
      backgroundSize: '20px',
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
    if (
      this.context.toolbarMode &&
      interaction.status !== 'wrapup' &&
      interaction.wrapupDetails.wrapupUpdateAllowed
    ) {
      // if we're in toolbar mode and creating a drop-down button
      // w/wrapup status options
      const buttonConfigWithWrapup = [
        // take the existing list of buttons...
        ...buttons.slice(),
        // ...and append to that list the wrapup enable/disable dropdown items
        {
          id: 'wrapup-on-submenu-item',
          text: messages.wrapupOn,
          onClick: this.enableWrapup,
          // here is where we add the style for indicating whether a
          // wrapup status is active or inactive
          activeSubButtonStyle: interaction.wrapupDetails.wrapupEnabled
            ? this.styles.selectedOption
            : {},
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
          activeSubButtonStyle: !interaction.wrapupDetails.wrapupEnabled
            ? this.styles.selectedOption
            : {},
          style: this.props.interaction.wrapupDetails.loadingWrapupStatusUpdate
            ? this.styles.wrapupStatusUpdateInProgress
            : {},
        },
      ];
      return <ButtonLayout buttonConfig={buttonConfigWithWrapup} />;
    }

    return <ButtonLayout buttonConfig={buttons} />;
  };

  render() {
    return (
      <div
        style={[
          this.styles.fromButtonsContainer,
          {
            minWidth: '290px',
            maxWidth: `calc(100vw - ${this.props.isSidePanelCollapsed
              ? 0
              : this.props.sidePanelPx}px - ${this.props
              .isInteractionsBarCollapsed
              ? 0
              : 72}px - 30px)`,
          },
        ]}
      >
        <div style={this.styles.from}>
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
  isSidePanelCollapsed: PropTypes.bool.isRequired,
  sidePanelPx: PropTypes.number.isRequired,
  isInteractionsBarCollapsed: PropTypes.bool.isRequired,
  updateWrapupDetails: PropTypes.func,
};

ContentAreaTop.contextTypes = {
  toolbarMode: PropTypes.bool,
};

const mapStateToProps = (state, props) => ({
  isSidePanelCollapsed: selectIsSidePanelCollapsed(state, props),
  sidePanelPx: selectSidePanelPx(state, props),
  isInteractionsBarCollapsed: selectIsInteractionsBarCollapsed(state, props),
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
