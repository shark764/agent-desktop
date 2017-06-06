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

import BaseComponent from 'components/BaseComponent';
import { setCriticalError } from 'containers/Errors/actions';

import Resizable from 'components/Resizable';

import InteractionsBar from 'containers/InteractionsBar';
import MainContentArea from 'containers/MainContentArea';
import PhoneControls from 'containers/PhoneControls';
import SidePanel from 'containers/SidePanel';
import Toolbar from 'containers/Toolbar';

import { showLogin, logout } from 'containers/Login/actions';

import { selectCriticalError, selectNonCriticalError } from 'containers/Errors/selectors';

import { setInteractionStatus, selectInteraction, showContactsPanel } from './actions';
import { selectAgentDesktopMap, selectLoginMap, selectIsContactsPanelCollapsed } from './selectors';

export class AgentDesktop extends BaseComponent {

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
    const width = window.innerWidth || documentElement.clientWidth || body.clientWidth;
    this.setState({
      contactsPanelMaxPx: Math.max(width - 600, 600),
      contactsPanelPx: this.state.contactsPanelPx > Math.max(width - 600, 600) ? Math.max(width - 600, 600) : this.state.contactsPanelPx,
    });
  }

  setContactsPanelWidth = (newWidth) => {
    this.setState({
      contactsPanelPx: newWidth,
    });
  }

  selectInteraction = (interactionId) => {
    this.props.selectInteraction(interactionId);
    this.props.showContactsPanel();
  }

  acceptInteraction = (interactionId) => {
    this.props.setInteractionStatus(interactionId, 'work-accepting');
    CxEngage.interactions.accept({ interactionId });
  }

  styles = {
    base: {
      // styles
    },
    parent: {
      alignItems: 'stretch',
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      justifyContent: 'flex-start',
      alignContent: 'stretch',
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
      height: 'calc(100vh - 54px)',
      borderBottom: '1px solid #141414',
    },
    topAreaOneBanner: {
      height: 'calc(100vh - 54px - 35px)',
    },
    topAreaTwoBanners: {
      height: 'calc(100vh - 54px - 70px)',
    },
    notificationBanner: {
      position: 'relative',
      zIndex: 20,
    },
    sidePanelOneBanner: {
      top: '35px',
    },
    sidePanelTwoBanners: {
      top: '70px',
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
              (this.props.criticalError || this.props.nonCriticalError) && this.styles.topAreaOneBanner,
              (this.props.criticalError || this.props.nonCriticalError) && this.props.refreshBannerIsVisible && this.styles.topAreaTwoBanners,
            ]}
          >
            <div style={[this.styles.leftArea]}>
              <PhoneControls style={[this.styles.phoneControls]} />
              <InteractionsBar acceptInteraction={this.acceptInteraction} selectInteraction={this.selectInteraction} style={[this.styles.interactionsBar]} />
            </div>
            <MainContentArea
              agent={this.props.login.agent}
              tenant={this.props.login.tenant}
              style={{ flex: '1 1 auto' }}
            />
            <Resizable id="crm-resizable" direction="left" setPx={this.setContactsPanelWidth} disabledPx={this.collapsedContactsPanelPx} px={this.state.contactsPanelPx} maxPx={this.state.contactsPanelMaxPx} minPx={500} isDisabled={this.props.isContactsPanelCollapsed} style={this.styles.topArea} />
          </div>
          <Toolbar
            tenant={this.props.login.tenant}
            readyState={this.props.agentDesktop.presence}
            agentDirection={this.props.agentDesktop.direction}
            style={[this.styles.flexChildGrow, this.styles.toolbar]}
          />
        </div>
        <SidePanel
          style={[
            this.styles.topArea,
            this.props.criticalError && { ...this.styles.topAreaOneBanner, ...this.styles.sidePanelOneBanner },
            this.props.criticalError && this.props.refreshBannerIsVisible && { ...this.styles.topAreaTwoBanners, ...this.styles.sidePanelTwoBanners },
          ]}
          collapsedPx={this.collapsedContactsPanelPx}
          openPx={this.state.contactsPanelPx}
          isCollapsed={this.props.isContactsPanelCollapsed}
        />
      </span>
    );
  }
}

const mapStateToProps = (state, props) => ({
  login: selectLoginMap(state, props).toJS(),
  agentDesktop: selectAgentDesktopMap(state, props).toJS(),
  criticalError: selectCriticalError(state, props),
  nonCriticalError: selectNonCriticalError(state, props),
  isContactsPanelCollapsed: selectIsContactsPanelCollapsed(state, props),
});

function mapDispatchToProps(dispatch) {
  return {
    setCriticalError: () => dispatch(setCriticalError()),
    showLogin: (show) => dispatch(showLogin(show)),
    setInteractionStatus: (interactionId, newStatus, response) => dispatch(setInteractionStatus(interactionId, newStatus, response)),
    selectInteraction: (interactionId) => dispatch(selectInteraction(interactionId)),
    logout: () => dispatch(logout()),
    showContactsPanel: () => dispatch(showContactsPanel()),
    dispatch,
  };
}

AgentDesktop.propTypes = {
  refreshBannerIsVisible: PropTypes.bool,
  setInteractionStatus: PropTypes.func.isRequired,
  selectInteraction: PropTypes.func.isRequired,
  // TODO when fixed in SDK
  // logout: PropTypes.func.isRequired,
  login: PropTypes.object,
  agentDesktop: PropTypes.object,
  criticalError: PropTypes.any,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Radium(AgentDesktop)));
