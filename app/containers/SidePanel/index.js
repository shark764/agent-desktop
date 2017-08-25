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
  showSidePanel,
  hideSidePanel,
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

const leftGutterPx = 51;
const topBarHeightPx = 63;

export class SidePanel extends React.Component {
  styles = {
    outerShell: {
      backgroundColor: '#FFFFFF',
      right: 0,
      top: 0,
      height: '100%',
      width: '100%',
      transition: 'transform 1s',
      display: 'flex',
      flexWrap: 'no-wrap',
      zIndex: '1',
      borderLeft: '1px solid #D0D0D0',
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
      cursor: 'pointer',
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
    },
    iconCollapseContainer: {
      zIndex: '100',
    },
    bodyWrapper: {
      display: 'flex',
      order: '1',
      flexGrow: '1',
      overflow: 'hidden',
      transition: 'opacity 1s cubic-bezier(1,0,.5,1)',
      opacity: '1',
      marginLeft: '-50px',
      paddingLeft: '50px',
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
    hideContent: {
      transition: 'opacity 1s cubic-bezier(0,1,0,1)',
      opacity: '0',
    },
  };

  handleCollapseClick = () => {
    if (this.props.isCollapsed) {
      this.props.showSidePanel(this.props.selectedInteractionId);
    } else {
      this.props.hideSidePanel(this.props.selectedInteractionId);
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
          <InfoTab isCollapsed={this.props.isCollapsed} />,
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
          <AgentScript
            interactionId={this.props.selectedInteractionId}
            script={this.props.selectedInteractionScript}
          />,
      },
    ];
    // filter out any tabs with falsey inner
    return tabs.filter((tab) => tab.tabInner);
  };

  render() {
    const tabsData = this.getTabsData();
    if (this.context.toolbarMode && this.props.isCollapsed) {
      this.styles.leftGutter.width = 0;
    } else {
      this.styles.leftGutter.width = `${leftGutterPx}px`;
    }
    return (
      <div style={[this.styles.outerShell, this.props.style]}>
        <div style={[this.styles.leftGutter]}>
          <div
            id="sidePanelCollapse"
            onClick={this.handleCollapseClick}
            style={[
              this.styles.topGutterLeft,
              this.styles.iconCollapseContainer,
            ]}
          >
            <IconCollapse
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
        <div
          id="sidePanelTabsContainer"
          style={[
            this.styles.bodyWrapper,
            this.props.isCollapsed ? this.styles.hideContent : {},
          ]}
        >
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
    showSidePanel: (interactionId) => dispatch(showSidePanel(interactionId)),
    hideSidePanel: (interactionId) => dispatch(hideSidePanel(interactionId)),
    dispatch,
  };
}

SidePanel.propTypes = {
  isCollapsed: PropTypes.bool,
  style: PropTypes.array,
  showSidePanel: PropTypes.func,
  hideSidePanel: PropTypes.func,
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
