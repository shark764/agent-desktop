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
  showContactsPanel,
  selectSidePanelTab,
} from 'containers/AgentDesktop/actions';

import {
  selectIsContactsPanelCollapsed,
  getSelectedInteractionId,
} from 'containers/AgentDesktop/selectors';
import {
  getSelectedInteractionScript,
  getSelectedInteractionIsScriptOnly,
} from 'containers/SidePanel/selectors';

const styles = {
  base: {
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
  },
  iconCollapse: {
    height: '19px',
    transform: 'rotate(90deg)',
  },
};

export class SidePanelToolbarBtn extends React.Component {
  handleClick = () => {
    this.props.showContactsPanel();
    this.props.selectSidePanelTab(this.props.selectedInteractionId, 'script');
  };

  render() {
    if (
      this.context.toolbarMode &&
      this.props.isContactsPanelCollapsed &&
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
    isContactsPanelCollapsed: selectIsContactsPanelCollapsed(state, props),
    selectedInteractionScript: getSelectedInteractionScript(state, props),
    selectedInteractionIsScriptOnly: getSelectedInteractionIsScriptOnly(
      state,
      props
    ),
    selectedInteractionId: getSelectedInteractionId(state, props),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    showContactsPanel: () => dispatch(showContactsPanel()),
    selectSidePanelTab: (interactionId, tabName) =>
      dispatch(selectSidePanelTab(interactionId, tabName)),
    dispatch,
  };
}

SidePanelToolbarBtn.propTypes = {
  isContactsPanelCollapsed: PropTypes.bool,
  selectedInteractionScript: PropTypes.object,
  selectedInteractionIsScriptOnly: PropTypes.bool,
  selectedInteractionId: PropTypes.string,
  showContactsPanel: PropTypes.func,
  selectSidePanelTab: PropTypes.func,
};

SidePanelToolbarBtn.contextTypes = {
  toolbarMode: PropTypes.bool,
};

export default ErrorBoundary(
  connect(mapStateToProps, mapDispatchToProps)(Radium(SidePanelToolbarBtn))
);