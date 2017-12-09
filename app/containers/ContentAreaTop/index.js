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

import ErrorBoundary from 'components/ErrorBoundary';

import SidePanelToolbarBtn from 'containers/SidePanelToolbarBtn';
import DesktopActionsButtons from 'components/DesktopActionsButtons';
import ActionsMenu from 'containers/ActionsMenu';

import { selectHasCrmPermissions } from 'containers/App/selectors';
import {
  getSelectedInteractionIsScriptOnly,
  getSelectedInteractionIsVoice,
  getHasAssignedContact,
} from 'containers/SidePanel/selectors';
import {
  selectIsSidePanelCollapsed,
  selectSidePanelPx,
  selectIsInteractionsBarCollapsed,
  getSelectedInteraction,
} from 'containers/AgentDesktop/selectors';

import { buttonConfigPropTypes } from 'containers/ContentArea';

// Styles:
const styles = {
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
  desktopWrapupContainer: {
    marginRight: '15px',
    whiteSpace: 'nowrap',
    display: 'inline-block',
  },
  toggleWrapupLabel: {
    marginRight: '5px',
  },
  actionWrapupLabel: {
    marginRight: '58px',
  },
};

export class ContentAreaTop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    // This is all to solve the overflow ellipsis issue in the from container
    let sidePanelHasTabs = false;
    if (
      (this.props.hasCrmPermissions && !this.context.toolbarMode) ||
      (this.props.selectedInteractionHasScripts &&
        !this.props.selectedInteractionIsScriptOnly &&
        !this.props.selectedInteractionIsVoice) ||
      this.props.hasAssignedContact
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
          styles.fromButtonsContainer,
          {
            minWidth: '290px',
            maxWidth: `calc(100vw - ${sidePanelSpacingInPx}px - 30px)`,
          },
        ]}
      >
        <div style={styles.from} title={this.props.from}>
          {this.props.from}
        </div>
        <div style={{ marginLeft: 'auto' }}>
          {this.props.interaction.status !== 'work-ended-pending-script' &&
            (!this.context.toolbarMode ? (
              <DesktopActionsButtons
                interaction={this.props.interaction}
                buttonConfig={this.props.buttonConfig}
              />
            ) : (
              <ActionsMenu
                interaction={this.props.interaction}
                buttonConfig={this.props.buttonConfig}
              />
            ))}
        </div>
        <SidePanelToolbarBtn />
      </div>
    );
  }
}

ContentAreaTop.propTypes = {
  interaction: PropTypes.object.isRequired,
  from: PropTypes.node,
  buttonConfig: PropTypes.arrayOf(PropTypes.shape(buttonConfigPropTypes)),
  hasCrmPermissions: PropTypes.bool,
  selectedInteractionIsScriptOnly: PropTypes.bool,
  selectedInteractionIsVoice: PropTypes.bool,
  isSidePanelCollapsed: PropTypes.bool.isRequired,
  sidePanelPx: PropTypes.number.isRequired,
  isInteractionsBarCollapsed: PropTypes.bool.isRequired,
  selectedInteractionHasScripts: PropTypes.bool,
  hasAssignedContact: PropTypes.bool.isRequired,
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
  hasAssignedContact: getHasAssignedContact(state, props),
});

export default ErrorBoundary(connect(mapStateToProps)(Radium(ContentAreaTop)));
