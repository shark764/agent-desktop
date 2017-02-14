/*
 *
 * SidePanel
 *
 */

import React, { PropTypes } from 'react';
import { Tab, TabList, TabPanel } from 'react-tabs';
import { connect } from 'react-redux';
import { setContactLayout, setContactAttributes } from './actions';
import Radium from 'radium';
import IconCollapse from 'icons/collapse';

import { getSelectedInteractionId } from './selectors';

import Tabs from 'components/Tabs';

import ContactsControl from 'containers/ContactsControl';
import ContactInteractionHistory from 'containers/ContactInteractionHistory';

const leftGutterPx = 52;
const rightGutterPx = 26;
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

  componentDidMount() {
    SDK.subscribe('cxengage/contacts/list-attributes-response', (error, topic, response) => {
      console.log('[SidePanel] SDK.subscribe()', topic, response);
      this.props.setContactAttributes(response);
    });
    SDK.subscribe('cxengage/contacts/list-layouts-response', (error, topic, response) => {
      console.log('[SidePanel] SDK.subscribe()', topic, response);
      this.props.setContactLayout(response);
    });
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
    rightGutter: {
      width: `${rightGutterPx}px`,
      flexDirection: 'column',
      order: '2',
      flexGrow: '0',
      flexShrink: '0',
    },
    rightGutterSpacer: {
      flexGrow: 1,
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
    topGutterRight: {
      borderBottom: '1px solid #D0D0D0',
      margin: '0',
      height: `${topBarHeightPx}px`,
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
              <Tab>Reference</Tab>
            </TabList>
            <TabPanel>
              <ContactsControl
                assignContact={this.props.assignContact}
                addSearchFilter={this.props.addSearchFilter}
                removeSearchFilter={this.props.removeSearchFilter}
              ></ContactsControl>
            </TabPanel>
            <TabPanel>
              <ContactInteractionHistory />
            </TabPanel>
            <TabPanel>
              <h2>References</h2>
              <h4>Praesent sed metus ut lacus congue iaculis.</h4>
            </TabPanel>
          </Tabs>
        </div>
        <div style={this.styles.rightGutter}>
          <div style={this.styles.topGutterRight}></div>
          <div style={this.styles.rightGutterSpacer}></div>
        </div>
      </div>
    )
    : null;
  }
}

function mapStateToProps(state, props) {
  return {
    selectedInteractionId: getSelectedInteractionId(state, props),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setContactLayout: (layout) => dispatch(setContactLayout(layout)),
    setContactAttributes: (attributes) => dispatch(setContactAttributes(attributes)),
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
  setContactLayout: PropTypes.func.isRequired,
  setContactAttributes: PropTypes.func.isRequired,
  assignContact: PropTypes.func.isRequired,
  addSearchFilter: PropTypes.func.isRequired,
  removeSearchFilter: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Radium(SidePanel));
