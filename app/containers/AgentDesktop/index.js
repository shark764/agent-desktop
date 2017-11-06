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
  getHasAssignedContact,
} from 'containers/SidePanel/selectors';

import {
  showInteractionsBar,
  hideInteractionsBar,
  setSidePanelPx,
  selectInteraction,
  openNewInteractionPanel,
} from './actions';
import {
  selectAgentDesktopMap,
  selectLoginMap,
  selectIsSidePanelCollapsed,
  selectSidePanelPx,
  selectIsInteractionsBarCollapsed,
  getSelectedInteraction,
  selectPreviousInteraction,
  selectNextInteraction,
  selectCrmModule,
  selectExpandWindowForCrm,
  selectHasUnrespondedInteractions,
} from './selectors';

import {
  DEFAULT_TOOLBAR_WIDTH,
  EXPANDED_TOOLBAR_WIDTH,
  DEFAULT_TOOLBAR_HEIGHT,
} from './constants';

export class AgentDesktop extends React.Component {
  constructor(props, context) {
    super(props);

    this.collapsedSidePanelPx = 52;
    if (context.toolbarMode) {
      this.defaultSidePanelPx = 400;
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
      this.context.toolbarMode ? DEFAULT_TOOLBAR_WIDTH : window.innerWidth / 2
    );
    window.addEventListener('resize', this.updateDimensions);
  }

  componentDidMount() {
    document.addEventListener(
      'keydown',
      (e) => {
        if (e.ctrlKey) {
          // 37 is left arrow
          if (e.which === 37 && !this.props.isInteractionsBarCollapsed)
            this.toggleInteractionsBar();
          // 38 is right arrow
          if (e.which === 39 && this.props.isInteractionsBarCollapsed)
            this.toggleInteractionsBar();
          // 37 is up arrow
          if (e.which === 38) {
            if (this.props.selectedInteractionId !== undefined) {
              this.props.selectInteraction(
                this.props.selectPreviousInteraction
              );
            }
          }
          // 40 is down arrow
          if (e.which === 40) {
            if (this.props.selectedInteractionId !== undefined) {
              this.props.selectInteraction(this.props.selectNextInteraction);
            }
          }
          // 13 is enter key
          if (e.which === 13) {
            this.props.openNewInteractionPanel();
          }
        }
      },
      true
    );
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.expandWindowForCrm !== this.props.expandWindowForCrm) {
      const width = nextProps.expandWindowForCrm
        ? EXPANDED_TOOLBAR_WIDTH
        : DEFAULT_TOOLBAR_WIDTH;
      const height = DEFAULT_TOOLBAR_HEIGHT;
      if (this.props.crmModule === 'zendesk') {
        CxEngage.zendesk.setDimensions({
          width,
          height,
        });
      } else if (this.props.isStandalonePopup) {
        window.resizeTo(width, height);
      }
    }
  }

  updateDimensions = () => {
    const documentElement = document.documentElement;
    const body = document.getElementsByTagName('body')[0];
    const width =
      window.innerWidth || documentElement.clientWidth || body.clientWidth;
    this.props.setSidePanelPx(
      this.defaultSidePanelPx,
      this.context.toolbarMode ? DEFAULT_TOOLBAR_WIDTH : width / 2
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
      ((this.props.selectedInteractionHasScripts &&
        !this.props.selectedInteractionIsScriptOnly &&
        !this.props.selectedInteractionIsVoice) ||
        this.props.selectedInteractionHasAssignedContact)
    ) {
      sidePanelHasTabs = true;
    }

    return (
      <div
        id="desktop-container"
        style={[this.styles.parent, this.styles.columnParent, {overflow: this.context.toolbarMode? 'hidden' : 'auto'}]}
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
                  hasUnrespondedInteractions={
                    this.props.selectHasUnrespondedInteractions
                  }
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
                  minPx={this.context.toolbarMode ? 350 : 400}
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
  selectHasUnrespondedInteractions: selectHasUnrespondedInteractions(
    state,
    props
  ),
  sidePanelPx: selectSidePanelPx(state, props),
  sidePanelMaxPx: selectAgentDesktopMap(state, props).toJS().sidePanelMaxPx,
  isInteractionsBarCollapsed: selectIsInteractionsBarCollapsed(state, props),
  selectPreviousInteraction: selectPreviousInteraction(state, props),
  selectNextInteraction: selectNextInteraction(state, props),
  selectedInteractionHasScripts:
    getSelectedInteraction(state, props) &&
    getSelectedInteraction(state, props).script !== undefined,
  selectedInteractionId:
    getSelectedInteraction(state, props).interactionId || undefined,
  crmModule: selectCrmModule(state, props),
  isStandalonePopup: selectAgentDesktopMap(state, props).get('standalonePopup'),
  showCollapseButton: selectShowCollapseButton(state, props),
  hasCrmPermissions: selectHasCrmPermissions(state, props),
  selectedInteractionIsScriptOnly: getSelectedInteractionIsScriptOnly(
    state,
    props
  ),
  selectedInteractionIsVoice: getSelectedInteractionIsVoice(state, props),
  selectedInteractionHasAssignedContact: getHasAssignedContact(state, props),
  expandWindowForCrm: selectExpandWindowForCrm(state, props),
});

function mapDispatchToProps(dispatch) {
  return {
    showInteractionsBar: () => dispatch(showInteractionsBar()),
    hideInteractionsBar: () => dispatch(hideInteractionsBar()),
    selectInteraction: (interactionId) =>
      dispatch(selectInteraction(interactionId)),
    openNewInteractionPanel: () => dispatch(openNewInteractionPanel()),
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
  isStandalonePopup: PropTypes.bool,
  showCollapseButton: PropTypes.bool.isRequired,
  hasCrmPermissions: PropTypes.bool.isRequired,
  selectedInteractionIsScriptOnly: PropTypes.bool.isRequired,
  selectedInteractionIsVoice: PropTypes.bool.isRequired,
  selectedInteractionHasAssignedContact: PropTypes.bool.isRequired,
  showInteractionsBar: PropTypes.func.isRequired,
  hideInteractionsBar: PropTypes.func.isRequired,
  setSidePanelPx: PropTypes.func.isRequired,
  expandWindowForCrm: PropTypes.bool,
  selectInteraction: PropTypes.func.isRequired,
  selectedInteractionId: PropTypes.string,
  selectPreviousInteraction: PropTypes.any,
  selectNextInteraction: PropTypes.any,
  openNewInteractionPanel: PropTypes.func.isRequired,
  selectHasUnrespondedInteractions: PropTypes.bool.isRequired,
};

AgentDesktop.contextTypes = {
  toolbarMode: PropTypes.bool,
};

export default ErrorBoundary(
  injectIntl(connect(mapStateToProps, mapDispatchToProps)(Radium(AgentDesktop)))
);
