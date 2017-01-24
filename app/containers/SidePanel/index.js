/*
 *
 * SidePanel
 *
 */

import React, { PropTypes } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { connect } from 'react-redux';
import { selectSelectedInteraction } from './selectors';
import { setContactLayout, setContactAttributes } from './actions';
import Radium from 'radium';
import IconCollapse from 'icons/collapse';

// import Contact from 'containers/Contact';

export class SidePanel extends React.Component {
  constructor() {
    super();

    this.state = {
      selectedTabIndex: 0,
    };

    Tabs.setUseDefaultStyles(false);

    this.updateSelectedTab = this.updateSelectedTab.bind(this);
  }

  getTabsStyleElement() {
    return (
      <Radium.Style
        scopeSelector=".react-tabs"
        rules={{
          color: '#4B4B4B',
          '[role=tablist]': {
            borderBottom: '1px solid #D0D0D0',
            padding: '10px 5px 15px 0',
            margin: '0',
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

  styles = {
    leftGutter: {
      width: '52px',
      display: 'flex',
      flexDirection: 'column',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignContent: 'stretch',
      alignItems: 'stretch',
    },
    collapseContainer: {
      borderBottom: '1px solid #D0D0D0',
      margin: '0',
      height: '63px',
      alignItems: 'center',
      justifyContent: 'center',
      display: 'flex',
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
    panel: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'flex-start',
      alignContent: 'stretch',
      alignItems: 'stretch',
    },
    flexChild1: {
      order: '0',
      flex: '0 0 auto',
      alignSelf: 'auto',
    },
    flexChild2: {
      order: '1',
      flex: '1 0 auto',
      alignSelf: 'auto',
    },
  };

  updateSelectedTab(index) {
    this.setState({
      selectedTabIndex: index,
    });
  }

  render() {
    return (
      <div style={[this.styles.panel, this.props.style]}>
        <div style={[this.styles.leftGutter, this.styles.flexChild1]}>
          <div
            style={[this.styles.flexChild1, this.styles.collapseContainer, this.props.selectedInteraction]}
            onClick={() => {
              if (this.props.isCollapsed) {
                this.props.showPanel();
              } else {
                this.props.collapsePanel();
              }
            }}
          >
            <IconCollapse style={[this.styles.iconCollapse, this.props.isCollapsed ? this.styles.right90 : this.styles.left90]} />
          </div>
          <div style={this.styles.flexChild2}></div>
        </div>
        {this.props.isCollapsed
          ?
            ''
          :
            <div style={[this.styles.flexChild2]}>
              {this.getTabsStyleElement()}
              <Tabs onSelect={this.updateSelectedTab} selectedIndex={this.state.selectedTabIndex}>
                <TabList>
                  <Tab>Info</Tab>
                  <Tab>History</Tab>
                  <Tab>Reference</Tab>
                </TabList>
                <TabPanel>
                  <div style={{ height: '54px' }}></div> { /* TODO: ContactControl component */ }
                  { /* <Contact contact={this.props.selectedInteraction.contact} /> */}
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
        }
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  selectedInteraction: selectSelectedInteraction(state, props),
});

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
  collapsePanel: PropTypes.func,
  showPanel: PropTypes.func,
  selectedInteraction: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(Radium(SidePanel));
