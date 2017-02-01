/*
 *
 * SidePanel
 *
 */

import React, { PropTypes } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { connect } from 'react-redux';
import { setContactLayout, setContactAttributes } from './actions';
import Radium from 'radium';
import IconCollapse from 'icons/collapse';

import ContactsControl from 'containers/ContactsControl';

const leftGutterPx = 52;
const rightGutterPx = 26;
const topBarHeightPx = 63;

export class SidePanel extends React.Component {
  constructor() {
    super();

    this.state = {
      selectedTabIndex: 0,
    };

    Tabs.setUseDefaultStyles(false);

    this.updateSelectedTab = this.updateSelectedTab.bind(this);
    this.getPanelSizing = this.getPanelSizing.bind(this);
    this.handleCollapseClick = this.handleCollapseClick.bind(this);
  }

  getTabsStyleElement() {
    return (
      <Radium.Style
        scopeSelector=".react-tabs"
        rules={{
          color: '#4B4B4B',
          '[role=tablist]': {
            flexGrow: '0',
            flexShrink: '0',
            order: '0',
            borderBottom: '1px solid #D0D0D0',
            padding: '10px 5px 15px 0',
            margin: '0',
            height: `${topBarHeightPx}px`,
            boxSizing: 'border-box',
          },
          '[role=tabpanel]': {
            height: `calc(100% - ${topBarHeightPx}px)`,
            alignSelf: 'stretch',
          },
          '[role=tab]': {
            fontWeight: 'bold',
            display: 'inline-block',
            border: '1px solid transparent',
            borderBottom: 'none',
            bottom: '-1px',
            position: 'relative',
            listStyle: 'none',
            padding: '6px 12px',
            cursor: 'pointer',
          },
          '[role=tab]:first-child': {
            paddingLeft: 0,
          },
          '[role=tab][aria-selected=true]::after': {
            content: '\'\'',
            width: 'calc(100% - 24px)',
            left: '12px',
            height: '4px',
            background: '#4B4B4B',
            position: 'absolute',
            bottom: '-14px',
          },
          '[role=tab][aria-selected=true]:first-child::after': {
            content: '\'\'',
            width: 'calc(100% - 12px)',
            left: '0px',
          },
          '[role=tab][aria-selected=false]': {
            color: '#979797',
          },
          '[role=tab][aria-disabled=true]': {
            cursor: 'default',
          },
          '[role=tab]:focus': {
            boxShadow: '0 0 0',
            border: 'none',
            outline: 'none',
          },
          '[role=tab]:focus::after': {
            boxShadow: '0 0 5px hsl(208, 99%, 50%)',
            borderColor: 'hsl(208, 99%, 50%)',
            outline: 'none',
          },
        }}
      />
    );
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
  };

  handleCollapseClick() {
    if (this.props.isCollapsed) {
      this.props.showPanel();
    } else {
      this.props.collapsePanel();
    }
  }

  render() {
    return (
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
        <div style={[this.styles.bodyWrapper]}>
          {this.getTabsStyleElement()}
          <Tabs style={this.styles.tabsOuter} onSelect={this.updateSelectedTab} selectedIndex={this.state.selectedTabIndex}>
            <TabList>
              <Tab>Info</Tab>
              <Tab>History</Tab>
              <Tab>Reference</Tab>
            </TabList>
            <TabPanel>
              <ContactsControl></ContactsControl>
            </TabPanel>
            <TabPanel>
              <h2>History</h2>
              <h4>Interdum et malesuada fames ac ante ipsum.</h4>
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
    );
  }
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
};

export default connect(null, mapDispatchToProps)(Radium(SidePanel));
