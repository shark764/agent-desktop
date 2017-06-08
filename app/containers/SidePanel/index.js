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

import BaseComponent from 'components/BaseComponent';
import { setCriticalError } from 'containers/Errors/actions';

import Tabs from 'components/Tabs';

import AgentScript from 'containers/AgentScript';
import InfoTab from 'containers/InfoTab';
import ContactInteractionHistory from 'containers/ContactInteractionHistory';

import { setSidePanelTabIndex, showContactsPanel, hideContactsPanel } from 'containers/AgentDesktop/actions';

import messages from './messages';
import { getSelectedInteractionId, getSelectedInteractionIsCreatingNewInteractionWithoutSelectedContact, getSelectedInteractionIsVoice, getSelectedInteractionScript, getHasAssignedContact, getSelectedTabIndex } from './selectors';

const leftGutterPx = 52;
const topBarHeightPx = 63;

export class SidePanel extends BaseComponent {

  getPanelSizing = () => {
    const sizing = {
      width: this.props.openPx,
    };
    if (this.props.isCollapsed) {
      sizing.transform = `translateX(${this.props.openPx - this.props.collapsedPx}px)`;
    }
    return sizing;
  }

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
    emptyPanel: {
      height: `${topBarHeightPx}px`,
      width: '100%',
      borderBottom: '1px solid #D0D0D0',
    },
  };

  handleCollapseClick = () => {
    if (this.props.isCollapsed) {
      this.props.showContactsPanel();
    } else {
      this.props.hideContactsPanel();
    }
  }

  render() {
    return (
      <div style={[this.styles.outerShell, this.getPanelSizing(), this.props.style]}>
        <div style={[this.styles.leftGutter]}>
          <div style={[this.styles.topGutterLeft]}>
            <IconCollapse
              id="sidePanelCollapse"
              onClick={this.handleCollapseClick}
              style={[this.styles.iconCollapse, this.props.isCollapsed ? this.styles.right90 : this.styles.left90]}
            />
          </div>
          <div style={this.styles.leftGutterSpacer}></div>
        </div>
        <div id="sidePanelTabsContainer" style={this.styles.bodyWrapper}>
          {
            !this.props.selectedInteractionIsCreatingNewInteractionWithoutSelectedContact
            ? <Tabs topBarHeightPx={topBarHeightPx} style={this.styles.tabsOuter} tabsRootStyle={this.styles.tabsRoot} type="big" id="contactTabs" onSelect={(tabIndex) => this.props.setSidePanelTabIndex(this.props.selectedInteractionId, tabIndex)} selectedIndex={this.props.selectedTabIndex}>
              <TabList>
                <Tab>
                  <FormattedMessage {...messages.infoTab} />
                </Tab>
                {
                  this.props.hasAssignedContact
                  ? <Tab>
                    <FormattedMessage {...messages.historyTab} />
                  </Tab>
                  : undefined
                }
                {
                  !this.props.selectedInteractionIsVoice && this.props.selectedInteractionScript !== undefined
                  ? <Tab>
                    <FormattedMessage {...messages.scriptsTab} />
                  </Tab>
                  : undefined
                }
              </TabList>
              <TabPanel>
                <InfoTab
                  isCollapsed={this.props.isCollapsed}
                  style={this.styles.rightMargin}
                />
              </TabPanel>
              {
                this.props.hasAssignedContact
                ? <TabPanel>
                  <ContactInteractionHistory />
                </TabPanel>
                : undefined
              }
              {
                !this.props.selectedInteractionIsVoice && this.props.selectedInteractionScript !== undefined
                ? <TabPanel>
                  <div style={this.styles.agentScriptPanel}>
                    <AgentScript interactionId={this.props.selectedInteractionId} script={this.props.selectedInteractionScript} />
                  </div>
                </TabPanel>
                : undefined
              }
            </Tabs>
            : <div style={this.styles.emptyPanel} />
          }
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    selectedInteractionId: getSelectedInteractionId(state, props),
    selectedInteractionIsCreatingNewInteractionWithoutSelectedContact: getSelectedInteractionIsCreatingNewInteractionWithoutSelectedContact(state, props),
    selectedInteractionIsVoice: getSelectedInteractionIsVoice(state, props),
    selectedInteractionScript: getSelectedInteractionScript(state, props),
    hasAssignedContact: getHasAssignedContact(state, props),
    selectedTabIndex: getSelectedTabIndex(state, props),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setCriticalError: () => dispatch(setCriticalError()),
    setSidePanelTabIndex: (interactionId, tabIndex) => dispatch(setSidePanelTabIndex(interactionId, tabIndex)),
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
  selectedTabIndex: PropTypes.number.isRequired,
  hasAssignedContact: PropTypes.bool.isRequired,
  setSidePanelTabIndex: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Radium(SidePanel));
