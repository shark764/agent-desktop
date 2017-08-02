/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * AgentDesktop
 *
 */
import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import Radium from 'radium';

import ErrorBoundary from 'components/ErrorBoundary';

import Resizable from 'components/Resizable';
import CollapseInteractionsButton from 'components/CollapseInteractionsButton';

import InteractionsBar from 'containers/InteractionsBar';
import MainContentArea from 'containers/MainContentArea';
import PhoneControls from 'containers/PhoneControls';
import SidePanel from 'containers/SidePanel';
import Toolbar from 'containers/Toolbar';

import { selectShowCollapseButton } from 'containers/InteractionsBar/selectors';

import { showInteractionsBar, hideInteractionsBar } from './actions';
import {
  selectAgentDesktopMap,
  selectLoginMap,
  selectIsContactsPanelCollapsed,
  selectIsInteractionsBarCollapsed,
} from './selectors';

export class AgentDesktop extends React.Component {
  constructor(props) {
    super(props);

    this.collapsedContactsPanelPx = 52;
    this.defaultContactsPanelPx = 600;

    this.state = {
      contactsPanelPx: this.defaultContactsPanelPx,
      contactsPanelMaxPx: Math.max(window.innerWidth - 600, 600),
    };
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  componentWillMount() {
    window.addEventListener('resize', this.updateDimensions);
  }

  updateDimensions = () => {
    const documentElement = document.documentElement;
    const body = document.getElementsByTagName('body')[0];
    const width =
      window.innerWidth || documentElement.clientWidth || body.clientWidth;
    this.setState({
      contactsPanelMaxPx: Math.max(width - 600, 600),
      contactsPanelPx:
        this.state.contactsPanelPx > Math.max(width - 600, 600)
          ? Math.max(width - 600, 600)
          : this.state.contactsPanelPx,
    });
  };

  setContactsPanelWidth = (newWidth) => {
    this.setState({
      contactsPanelPx: newWidth,
    });
  };

  toggleInteractionsBar = () => {
    if (this.props.isInteractionsBarCollapsed) {
      this.props.showInteractionsBar();
    } else {
      this.props.hideInteractionsBar();
    }
  };

  styles = {
    parent: {
      alignItems: 'stretch',
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      justifyContent: 'flex-start',
      alignContent: 'stretch',
      height: '100%',
    },
    columnParent: {
      flexDirection: 'column',
    },
    flexChildGrow: {
      flex: '1 0 auto',
    },
    leftArea: {
      flex: '0 0 auto',
      width: '283px',
      display: 'flex',
      flexFlow: 'column',
      height: '100%',
      backgroundColor: '#072931',
    },
    leftAreaToolbar: {
      transition: 'width 0.3s linear',
      width: '72px',
    },
    leftAreaCollapsed: {
      width: '0px',
    },
    phoneControls: {
      flex: '0 0 auto',
    },
    interactionsBar: {
      flex: '1 0 auto',
    },
    toolbar: {
      flex: '0 0 auto',
      height: '54px',
    },
    topArea: {
      height: 'calc(100% - 54px)',
      borderBottom: '1px solid #141414',
    },
    topAreaToolbar: {
      height: 'calc(100% - 118px)',
    },
  };

  render() {
    return (
      <span>
        <div
          id="desktop-container"
          style={[
            this.styles.flexChildGrow,
            this.styles.parent,
            this.styles.columnParent,
          ]}
        >
          <div
            id="top-area"
            style={[
              this.styles.flexChildGrow,
              this.styles.parent,
              this.styles.topArea,
              this.context.toolbarMode && this.styles.topAreaToolbar,
            ]}
          >
            <div
              style={{
                flex: '1 1 auto',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {this.context.toolbarMode &&
                <PhoneControls
                  style={[this.styles.phoneControls, { flex: '0' }]}
                />}
              <div style={{ display: 'flex', flex: '1' }}>
                <div
                  style={[
                    this.styles.leftArea,
                    this.context.toolbarMode && this.styles.leftAreaToolbar,
                    this.context.toolbarMode &&
                      this.props.isInteractionsBarCollapsed &&
                      this.styles.leftAreaCollapsed,
                  ]}
                >
                  {!this.context.toolbarMode &&
                    <PhoneControls style={[this.styles.phoneControls]} />}
                  {(!this.context.toolbarMode ||
                    !this.props.isInteractionsBarCollapsed) &&
                    <InteractionsBar style={[this.styles.interactionsBar]} />}
                </div>
                {this.context.toolbarMode &&
                  this.props.showCollapseButton &&
                  <CollapseInteractionsButton
                    toggleInteractionsBar={this.toggleInteractionsBar}
                    isCollapsed={this.props.isInteractionsBarCollapsed}
                  />}
                <MainContentArea
                  agent={this.props.login.agent}
                  tenant={this.props.login.tenant}
                  style={{ flex: '1 1 auto' }}
                />
                <Resizable
                  id="crm-resizable"
                  direction="left"
                  setPx={this.setContactsPanelWidth}
                  disabledPx={this.collapsedContactsPanelPx}
                  px={this.state.contactsPanelPx}
                  maxPx={this.state.contactsPanelMaxPx}
                  minPx={400}
                  isDisabled={this.props.isContactsPanelCollapsed}
                  style={this.styles.topArea}
                />
              </div>
            </div>
          </div>
          <Toolbar
            tenant={this.props.login.tenant}
            style={[this.styles.flexChildGrow, this.styles.toolbar]}
          />
          <SidePanel
            isCollapsed={this.props.isContactsPanelCollapsed}
            openPx={this.state.contactsPanelPx}
            collapsedPx={this.collapsedContactsPanelPx}
            bannerCount={this.props.bannerCount}
          />
        </div>
      </span>
    );
  }
}

const mapStateToProps = (state, props) => ({
  login: selectLoginMap(state, props).toJS(),
  agentDesktop: selectAgentDesktopMap(state, props).toJS(),
  isContactsPanelCollapsed: selectIsContactsPanelCollapsed(state, props),
  isInteractionsBarCollapsed: selectIsInteractionsBarCollapsed(state, props),
  showCollapseButton: selectShowCollapseButton(state, props),
});

function mapDispatchToProps(dispatch) {
  return {
    showInteractionsBar: () => dispatch(showInteractionsBar()),
    hideInteractionsBar: () => dispatch(hideInteractionsBar()),
    dispatch,
  };
}

AgentDesktop.propTypes = {
  login: PropTypes.object,
  isContactsPanelCollapsed: PropTypes.bool.isRequired,
  bannerCount: PropTypes.number,
  isInteractionsBarCollapsed: PropTypes.bool.isRequired,
  showInteractionsBar: PropTypes.func.isRequired,
  hideInteractionsBar: PropTypes.func.isRequired,
  showCollapseButton: PropTypes.bool.isRequired,
};

AgentDesktop.contextTypes = {
  toolbarMode: PropTypes.bool,
};

export default ErrorBoundary(
  injectIntl(connect(mapStateToProps, mapDispatchToProps)(Radium(AgentDesktop)))
);
