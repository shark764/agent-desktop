/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * SidePanelToolbarBtn
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Radium from 'radium';
import IconCollapse from 'icons/collapse';

import ErrorBoundary from 'components/ErrorBoundary';

import {
  showSidePanel,
  selectSidePanelTab,
} from 'containers/AgentDesktop/actions';

import {
  selectIsSidePanelCollapsed,
  getSelectedInteractionId,
  selectCrmModule,
} from 'containers/AgentDesktop/selectors';
import {
  getSelectedInteractionScript,
  getSelectedInteractionIsScriptOnly,
} from 'containers/SidePanel/selectors';

const styles = {
  base: {
    flexShrink: 0,
    display: 'flex',
    position: 'relative',
    height: '60px',
    width: '50px',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderTop: '1px solid #D0D0D0',
    borderBottom: '1px solid #D0D0D0',
    borderLeft: '1px solid #D0D0D0',
    right: '-20px',
    cursor: 'pointer',
    marginTop: '-15px',
    marginBottom: '-11px',
  },
  iconCollapse: {
    height: '19px',
    transform: 'rotate(90deg)',
  },
};

export class SidePanelToolbarBtn extends React.Component {
  handleClick = () => {
    this.props.selectSidePanelTab(this.props.selectedInteractionId, 'script');
    this.props.showSidePanel(this.props.selectedInteractionId);

    // updating outer window width for when embedded in Zendesk CRM
    if (this.props.crmModule === 'zendesk') {
      CxEngage.zendesk.setDimensions({ width: 800, height: 800 });
    }
  };

  render() {
    if (
      this.context.toolbarMode &&
      this.props.isSidePanelCollapsed &&
      this.props.selectedInteractionScript !== undefined &&
      !this.props.selectedInteractionIsScriptOnly
    ) {
      return (
        <div
          id="SidePanelToolbarBtn"
          onClick={this.handleClick}
          style={styles.base}
        >
          <IconCollapse style={[styles.iconCollapse]} />
        </div>
      );
    } else {
      return null;
    }
  }
}

function mapStateToProps(state, props) {
  return {
    isSidePanelCollapsed: selectIsSidePanelCollapsed(state, props),
    selectedInteractionScript: getSelectedInteractionScript(state, props),
    selectedInteractionIsScriptOnly: getSelectedInteractionIsScriptOnly(
      state,
      props
    ),
    selectedInteractionId: getSelectedInteractionId(state, props),
    crmModule: selectCrmModule(state, props),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    showSidePanel: (interactionId) => dispatch(showSidePanel(interactionId)),
    selectSidePanelTab: (interactionId, tabName) =>
      dispatch(selectSidePanelTab(interactionId, tabName)),
    dispatch,
  };
}

SidePanelToolbarBtn.propTypes = {
  isSidePanelCollapsed: PropTypes.bool,
  selectedInteractionScript: PropTypes.object,
  selectedInteractionIsScriptOnly: PropTypes.bool,
  selectedInteractionId: PropTypes.string,
  showSidePanel: PropTypes.func,
  selectSidePanelTab: PropTypes.func,
  crmModule: PropTypes.string,
};

SidePanelToolbarBtn.contextTypes = {
  toolbarMode: PropTypes.bool,
};

export default ErrorBoundary(
  connect(mapStateToProps, mapDispatchToProps)(Radium(SidePanelToolbarBtn))
);
