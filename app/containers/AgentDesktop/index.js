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

import { selectHasCrmPermissions } from 'containers/App/selectors';
import {
  getSelectedInteractionIsScriptOnly,
  getSelectedInteractionIsVoice,
} from 'containers/SidePanel/selectors';

import {
  showInteractionsBar,
  hideInteractionsBar,
  setSidePanelPx,
} from './actions';
import {
  selectAgentDesktopMap,
  selectLoginMap,
  selectIsSidePanelCollapsed,
  selectSidePanelPx,
  selectIsInteractionsBarCollapsed,
  getSelectedInteraction,
  selectCrmModule,
  selectExpandWindowForCrm,
} from './selectors';

export class AgentDesktop extends React.Component {
  constructor(props, context) {
    super(props);

    this.collapsedSidePanelPx = 52;
    if (context.toolbarMode) {
      this.defaultSidePanelPx = 350;
    } else {
      this.defaultSidePanelPx = 500;
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  componentWillMount() {
    this.props.setSidePanelPx(
      this.defaultSidePanelPx,
      this.context.toolbarMode ? 400 : window.innerWidth / 2
    );
    window.addEventListener('resize', this.updateDimensions);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.expandWindowForCrm !== this.props.expandWindowForCrm) {
      CxEngage.zendesk.setDimensions(
        {
          width: nextProps.expandWindowForCrm ? 800 : 400,
          height: 800,
        }
      );
    }
  }

  updateDimensions = () => {
    const documentElement = document.documentElement;
    const body = document.getElementsByTagName('body')[0];
    const width =
      window.innerWidth || documentElement.clientWidth || body.clientWidth;
    this.props.setSidePanelPx(
      this.defaultSidePanelPx,
      this.context.toolbarMode ? 400 : width / 2
    );
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
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      justifyContent: 'flex-start',
      alignContent: 'stretch',
      alignItems: 'stretch',
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
      backgroundColor: '#072931',
    },
    leftAreaToolbar: {
      transition: 'width 0.3s linear',
      width: '72px',
    },
    leftAreaCollapsed: {
      width: '0px',
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
    let sidePanelHasTabs = false;
    if (
      (this.props.hasCrmPermissions && !this.context.toolbarMode) ||
      (this.props.selectedInteractionHasScripts &&
        !this.props.selectedInteractionIsScriptOnly &&
        !this.props.selectedInteractionIsVoice) ||
      (this.context.toolbarMode &&
        this.props.selectedInteractionIsVoice &&
        this.props.crmModule !== 'zendesk')
    ) {
      sidePanelHasTabs = true;
    }

    return (
      <div
        id="desktop-container"
        style={[this.styles.parent, this.styles.columnParent]}
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
              <PhoneControls style={{ flex: '0' }} />}
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
                  <PhoneControls style={{ flexShrink: '0' }} />}
                {(!this.context.toolbarMode ||
                  !this.props.isInteractionsBarCollapsed) &&
                  <InteractionsBar style={{ flexGrow: '1' }} />}
              </div>
              {this.context.toolbarMode &&
                this.props.showCollapseButton &&
                <CollapseInteractionsButton
                  toggleInteractionsBar={this.toggleInteractionsBar}
                  isCollapsed={this.props.isInteractionsBarCollapsed}
                />}
              <MainContentArea
                agent={this.props.login.agent}
                style={{ flex: '1 1 auto' }}
              />
              {sidePanelHasTabs &&
                <Resizable
                  id="crm-resizable"
                  direction="left"
                  setPx={this.props.setSidePanelPx}
                  disabledPx={this.collapsedSidePanelPx}
                  px={this.props.sidePanelPx}
                  maxPx={this.props.sidePanelMaxPx}
                  minPx={this.context.toolbarMode ? 300 : 400}
                  isDisabled={this.props.isSidePanelCollapsed}
                >
                  <SidePanel isCollapsed={this.props.isSidePanelCollapsed} />
                </Resizable>}
            </div>
          </div>
        </div>
        <Toolbar
          tenant={this.props.login.tenant}
          style={[this.styles.flexChildGrow, this.styles.toolbar]}
        />
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  login: selectLoginMap(state, props).toJS(),
  agentDesktop: selectAgentDesktopMap(state, props).toJS(),
  isSidePanelCollapsed: selectIsSidePanelCollapsed(state, props),
  sidePanelPx: selectSidePanelPx(state, props),
  sidePanelMaxPx: selectAgentDesktopMap(state, props).toJS().sidePanelMaxPx,
  isInteractionsBarCollapsed: selectIsInteractionsBarCollapsed(state, props),
  selectedInteractionHasScripts:
    getSelectedInteraction(state, props) &&
    getSelectedInteraction(state, props).script !== undefined,
  crmModule: selectCrmModule(state, props),
  showCollapseButton: selectShowCollapseButton(state, props),
  hasCrmPermissions: selectHasCrmPermissions(state, props),
  selectedInteractionIsScriptOnly: getSelectedInteractionIsScriptOnly(
    state,
    props
  ),
  selectedInteractionIsVoice: getSelectedInteractionIsVoice(state, props),
  expandWindowForCrm: selectExpandWindowForCrm(state, props),
});

function mapDispatchToProps(dispatch) {
  return {
    showInteractionsBar: () => dispatch(showInteractionsBar()),
    hideInteractionsBar: () => dispatch(hideInteractionsBar()),
    setSidePanelPx: (sidePanelPx, sidePanelMaxPx) =>
      dispatch(setSidePanelPx(sidePanelPx, sidePanelMaxPx)),
    dispatch,
  };
}

AgentDesktop.propTypes = {
  login: PropTypes.object,
  isSidePanelCollapsed: PropTypes.bool.isRequired,
  sidePanelPx: PropTypes.number.isRequired,
  sidePanelMaxPx: PropTypes.number.isRequired,
  isInteractionsBarCollapsed: PropTypes.bool.isRequired,
  selectedInteractionHasScripts: PropTypes.bool,
  crmModule: PropTypes.string,
  showCollapseButton: PropTypes.bool.isRequired,
  hasCrmPermissions: PropTypes.bool.isRequired,
  selectedInteractionIsScriptOnly: PropTypes.bool.isRequired,
  selectedInteractionIsVoice: PropTypes.bool.isRequired,
  showInteractionsBar: PropTypes.func.isRequired,
  hideInteractionsBar: PropTypes.func.isRequired,
  setSidePanelPx: PropTypes.func.isRequired,
  expandWindowForCrm: PropTypes.bool,
};

AgentDesktop.contextTypes = {
  toolbarMode: PropTypes.bool,
};

export default ErrorBoundary(
  injectIntl(connect(mapStateToProps, mapDispatchToProps)(Radium(AgentDesktop)))
);
