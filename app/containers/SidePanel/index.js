/*
 *
 * SidePanel
 *
 */

import React, { PropTypes } from 'react';
import { Tab, TabList, TabPanel } from 'react-tabs';
import { connect } from 'react-redux';
import Radium from 'radium';
import IconCollapse from 'icons/collapse';

import { getSelectedInteractionId, getSelectedInteractionIsVoice } from './selectors';

import Tabs from 'components/Tabs';

// import AgentScript from 'containers/AgentScript';
import ContactsControl from 'containers/ContactsControl';
import ContactInteractionHistory from 'containers/ContactInteractionHistory';

const leftGutterPx = 52;
const topBarHeightPx = 63;

export class SidePanel extends React.Component {
  constructor() {
    super();

    this.state = {
      selectedTabIndex: 0,
    };

    this.updateSelectedTab = this.updateSelectedTab.bind(this);
    this.getPanelSizing = this.getPanelSizing.bind(this);
    this.handleCollapseClick = this.handleCollapseClick.bind(this);
  }

  getPanelSizing() {
    const sizing = {
      width: this.props.openPx,
    };
    if (this.props.isCollapsed) {
      sizing.transform = `translateX(${this.props.openPx - this.props.collapsedPx}px)`;
    }
    return sizing;
  }

  updateSelectedTab(index) {
    this.setState({
      selectedTabIndex: index,
    });
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
  };

  handleCollapseClick() {
    if (this.props.isCollapsed) {
      this.props.showPanel();
    } else {
      this.props.collapsePanel();
    }
  }

  render() {
    return this.props.selectedInteractionId !== undefined ? (
      <div style={[this.styles.outerShell, this.getPanelSizing(), this.props.style]}>
        <div style={[this.styles.leftGutter]}>
          <div style={[this.styles.topGutterLeft]}>
            <IconCollapse
              onClick={this.handleCollapseClick}
              style={[this.styles.iconCollapse, this.props.isCollapsed ? this.styles.right90 : this.styles.left90]}
            />
          </div>
          <div style={this.styles.leftGutterSpacer}></div>
        </div>
        <div id="sidePanelTabsContainer" style={this.styles.bodyWrapper}>
          <Tabs topBarHeightPx={topBarHeightPx} style={this.styles.tabsOuter} tabsRootStyle={this.styles.tabsRoot} type="big" id="contactTabs" onSelect={this.updateSelectedTab} selectedIndex={this.state.selectedTabIndex}>
            <TabList>
              <Tab>Info</Tab>
              <Tab>History</Tab>
              { /*
                !this.props.selectedInteractionIsVoice
                ? <Tab>Scripts</Tab>
                : undefined
              */ }
            </TabList>
            <TabPanel>
              <ContactsControl
                addSearchFilter={this.props.addSearchFilter}
                removeSearchFilter={this.props.removeSearchFilter}
                setContactAction={this.props.setContactAction}
              />
            </TabPanel>
            <TabPanel>
              <ContactInteractionHistory />
            </TabPanel>
            { /*
              !this.props.selectedInteractionIsVoice
              ? <TabPanel>
                <div style={this.styles.agentScriptPanel}>
                  <AgentScript />
                </div>
              </TabPanel>
              : undefined
            */ }
          </Tabs>
        </div>
      </div>
    )
    : null;
  }
}

function mapStateToProps(state, props) {
  return {
    selectedInteractionId: getSelectedInteractionId(state, props),
    selectedInteractionIsVoice: getSelectedInteractionIsVoice(state, props),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

SidePanel.propTypes = {
  style: PropTypes.array,
  isCollapsed: PropTypes.bool,
  openPx: PropTypes.number,
  collapsedPx: PropTypes.number,
  collapsePanel: PropTypes.func,
  showPanel: PropTypes.func,
  selectedInteractionId: PropTypes.string,
  // selectedInteractionIsVoice: PropTypes.bool,
  addSearchFilter: PropTypes.func.isRequired,
  removeSearchFilter: PropTypes.func.isRequired,
  setContactAction: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Radium(SidePanel));
