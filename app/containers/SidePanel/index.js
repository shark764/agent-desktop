/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * SidePanel
 *
 */

import React from 'react';
import { Tab, TabList, TabPanel } from 'react-tabs';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Radium from 'radium';
import IconCollapse from 'icons/collapse';
import { FormattedMessage } from 'react-intl';

import ErrorBoundary from 'components/ErrorBoundary';

import Tabs from 'components/Tabs';

import AgentScript from 'containers/AgentScript';
import InfoTab from 'containers/InfoTab';
import ContactInteractionHistory from 'containers/ContactInteractionHistory';

import {
  selectSidePanelTab,
  showContactsPanel,
  hideContactsPanel,
} from 'containers/AgentDesktop/actions';

import messages from './messages';
import {
  getSelectedInteractionId,
  getSelectedInteractionIsVoice,
  getSelectedInteractionScript,
  getSelectedInteractionIsScriptOnly,
  getHasAssignedContact,
  getSelectedSidePanelTab,
} from './selectors';

const leftGutterPx = 52;
const topBarHeightPx = 63;

export class SidePanel extends React.Component {
  getPanelSizing = () => {
    const sizing = {
      width: this.props.openPx,
    };
    if (this.props.isCollapsed) {
      sizing.transform = `translateX(${this.props.openPx -
        this.props.collapsedPx}px)`;
    }
    return sizing;
  };

  styles = {
    outerShell: {
      backgroundColor: '#FFFFFF',
      borderLeft: '1px solid #D0D0D0',
      position: 'fixed',
      right: 0,
      top: 0,
      height: '100vh',
      transition: 'transform 1s',
      display: 'flex',
      flexWrap: 'no-wrap',
      zIndex: '1',
    },
    leftGutter: {
      width: `${leftGutterPx}px`,
      display: 'flex',
      flexDirection: 'column',
      flexGrow: '0',
      flexShrink: 0,
    },
    topGutterLeft: {
      borderBottom: '1px solid #D0D0D0',
      margin: '0',
      height: `${topBarHeightPx}px`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    leftGutterSpacer: {
      order: '1',
      flexGrow: '1',
    },
    left90: {
      transform: 'rotate(-90deg)',
    },
    right90: {
      transform: 'rotate(90deg)',
    },
    iconCollapse: {
      height: '19px',
      cursor: 'pointer',
    },
    bodyWrapper: {
      display: 'flex',
      order: '1',
      flexGrow: '1',
    },
    tabsOuter: {
      flexGrow: '1',
      alignSelf: 'stretch',
      display: 'flex',
      flexDirection: 'column',
    },
    tabsRoot: {
      height: '100%',
    },
    agentScriptPanel: {
      height: '100%',
      width: '100%',
      overflowY: 'auto',
    },
    rightMargin: {
      marginRight: '26px',
    },
  };

  handleCollapseClick = () => {
    if (this.props.isCollapsed) {
      this.props.showContactsPanel();
    } else {
      this.props.hideContactsPanel();
    }
  };

  getTabsData = () => {
    const renderScriptTab =
      (this.context.toolbarMode || !this.props.selectedInteractionIsVoice) &&
      this.props.selectedInteractionScript !== undefined &&
      !this.props.selectedInteractionIsScriptOnly;
    const tabs = [
      {
        name: 'info',
        tabInner:
          this.context.crmEnabled &&
          <InfoTab
            isCollapsed={this.props.isCollapsed}
            style={this.styles.rightMargin}
          />,
      },
      {
        name: 'history',
        tabInner:
          this.context.crmEnabled &&
          this.props.hasAssignedContact &&
          <ContactInteractionHistory />,
      },
      {
        name: 'script',
        tabInner:
          renderScriptTab &&
          <div style={this.styles.agentScriptPanel}>
            <AgentScript
              interactionId={this.props.selectedInteractionId}
              script={this.props.selectedInteractionScript}
            />
          </div>,
      },
    ];
    // filter out any tabs with falsey inner
    return tabs.filter((tab) => tab.tabInner);
  };

  render() {
    const tabsData = this.getTabsData();
    return (
      <div
        style={[
          this.styles.outerShell,
          this.getPanelSizing(),
          this.props.style,
        ]}
      >
        <div style={[this.styles.leftGutter]}>
          <div style={[this.styles.topGutterLeft]}>
            <IconCollapse
              id="sidePanelCollapse"
              onClick={this.handleCollapseClick}
              style={[
                this.styles.iconCollapse,
                this.props.isCollapsed
                  ? this.styles.right90
                  : this.styles.left90,
              ]}
            />
          </div>
          <div style={this.styles.leftGutterSpacer} />
        </div>
        <div id="sidePanelTabsContainer" style={this.styles.bodyWrapper}>
          <Tabs
            topBarHeightPx={topBarHeightPx}
            style={this.styles.tabsOuter}
            tabsRootStyle={this.styles.tabsRoot}
            type="big"
            id="contactTabs"
            onSelect={(tabIndex) =>
              this.props.selectSidePanelTab(
                this.props.selectedInteractionId,
                tabsData[tabIndex].name
              )}
            selectedIndex={tabsData.findIndex(
              (tabData) => tabData.name === this.props.selectedSidePanelTab
            )}
          >
            <TabList>
              {tabsData.map((tabData) =>
                (<Tab key={tabData.name}>
                  <FormattedMessage {...messages[`${tabData.name}Tab`]} />
                </Tab>)
              )}
            </TabList>
            {tabsData.map((tabData) =>
              (<TabPanel key={tabData.name}>
                {tabData.tabInner}
              </TabPanel>)
            )}
          </Tabs>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    selectedInteractionId: getSelectedInteractionId(state, props),
    selectedInteractionIsVoice: getSelectedInteractionIsVoice(state, props),
    selectedInteractionScript: getSelectedInteractionScript(state, props),
    selectedInteractionIsScriptOnly: getSelectedInteractionIsScriptOnly(
      state,
      props
    ),
    hasAssignedContact: getHasAssignedContact(state, props),
    selectedSidePanelTab: getSelectedSidePanelTab(state, props),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    selectSidePanelTab: (interactionId, tabName) =>
      dispatch(selectSidePanelTab(interactionId, tabName)),
    showContactsPanel: () => dispatch(showContactsPanel()),
    hideContactsPanel: () => dispatch(hideContactsPanel()),
    dispatch,
  };
}

SidePanel.propTypes = {
  style: PropTypes.array,
  isCollapsed: PropTypes.bool,
  openPx: PropTypes.number,
  collapsedPx: PropTypes.number,
  hideContactsPanel: PropTypes.func,
  showContactsPanel: PropTypes.func,
  selectedInteractionId: PropTypes.string,
  selectedInteractionIsVoice: PropTypes.bool,
  selectedInteractionScript: PropTypes.object,
  selectedInteractionIsScriptOnly: PropTypes.bool,
  selectedSidePanelTab: PropTypes.oneOf(['info', 'history', 'script'])
    .isRequired,
  hasAssignedContact: PropTypes.bool.isRequired,
  selectSidePanelTab: PropTypes.func.isRequired,
};

SidePanel.contextTypes = {
  toolbarMode: PropTypes.bool,
  crmEnabled: PropTypes.bool,
};

export default ErrorBoundary(
  connect(mapStateToProps, mapDispatchToProps)(Radium(SidePanel))
);
