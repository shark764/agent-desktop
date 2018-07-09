/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * AgentStatusMenu
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import Radium from 'radium';

import expireToken from 'utils/token';
import crmCssAdapter from 'utils/crmCssAdapter';

import ErrorBoundary from 'components/ErrorBoundary';

import Collapsible from 'components/Collapsible';
import Icon from 'components/Icon';
import PopupDialog from 'components/PopupDialog';
import { selectAgent } from 'containers/Login/selectors';
import { selectCrmModule } from 'containers/AgentDesktop/selectors';

import {
  setActiveExtension,
  goNotReady,
  showConfirmationPopupGoReady,
} from 'containers/AgentDesktop/actions';

import DirectionRow from './DirectionRow';
import LargeMenuRow from './LargeMenuRow';
import MenuRow from './MenuRow';
import messages from './messages';
import {
  selectHasActiveInteractions,
  selectExtensions,
  selectActiveExtension,
  selectSelectedPresenceReason,
  selectPresenceReasonLists,
  selectHasActiveWrapup,
  selectHasActiveScript,
  selectAgentDirection,
  selectHasDirectionChangePermission,
} from './selectors';

const storage = window.localStorage;

const styles = {
  base: {
    position: 'absolute',
    left: '2px',
    bottom: '56px',
    zIndex: '2',
    width: '396px',
    borderRadius: '8px',
    margin: '0',
  },
  baseMenuContainer: {
    padding: '3px 0',
    maxHeight: 'calc(100vh - 60px)',
    overflowY: 'auto',
  },
  // Used by crmCssAdapter
  baseMenuContainerSfLightning: {
    maxHeight: 'calc(100vh - 100px)',
  },
  itemText: {
    flexGrow: 1,
  },
  notReadyReasons: {
    display: 'block',
    paddingTop: '4px',
    lineHeight: '1.25',
  },
  presenceLinkContainer: {
    color: '#363636',
    padding: '10px 24px',
    display: 'flex',
  },
  listTitle: {
    color: '#979797',
    padding: '10px 24px 0 24px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: '100%',
  },
  inactivePresence: {
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  disabledPresenceUpdate: {
    cursor: 'default',
    color: '#979797',
  },
  activePresence: {
    fontWeight: 'bold',
  },
  selectedCategory: {
    fontWeight: 'bold',
  },
  narrowDivider: {
    borderBottom: '1px solid #E1E1E1',
    margin: '0 24px',
  },
  selectedIcon: {
    alignSelf: 'center',
    cursor: 'inherit',
  },
  notReadyLinkContainer: {
    padding: '14px 24px 10px 24px',
  },
  subMenuRows: {
    ':hover': {
      backgroundColor: '#DEF8FE',
      cursor: 'pointer',
    },
    padding: '5px 25px 0',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: '100%',
  },
};

export class AgentStatusMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      clearHoverInt: 0,
      statusLoading: false,
      expandedMenu: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.readyState !== this.props.readyState ||
      nextProps.selectedPresenceReason !== this.props.selectedPresenceReason
    ) {
      this.setState({ statusLoading: false });
    }
  }

  setCollapsibleMenus = (menuId) => {
    if (this.state.expandedMenu === '' || this.state.expandedMenu !== menuId) {
      this.setState({ expandedMenu: menuId });
    } else {
      this.setState({ expandedMenu: '' });
    }
  };

  clearHover = () => {
    // Longstanding radium bug where mouseleave event is never triggered https://github.com/FormidableLabs/radium/issues/524
    this.setState((prevState) => ({
      clearHoverInt: prevState.clearHoverInt + 1,
    }));
  };

  changePresence = (newPresence, reason, listId) => {
    if (newPresence === 'ready') {
      this.setState({ statusLoading: true });
      CxEngage.session.goReady({
        extensionValue: this.props.activeExtension.value,
      });
    } else if (newPresence === 'notready') {
      this.setState({ statusLoading: true });
      this.props.goNotReady(reason, listId);
    } else {
      throw new Error(
        'newPresence is neither ready nor notready:',
        newPresence
      );
    }
    this.props.showAgentStatusMenu(false);
  };

  goReady = () => {
    // Check if the current time is later than the expiration time
    // minus the 9 hours, since this ensures that you will never be
    // booted off while in "Ready" mode due to an expired
    // token during a typical work day
    const debugTokenVal = storage.getItem('debugTokenVal');
    const token = CxEngage.session.getToken();
    if (expireToken(token, 9, this.props.agent.isSso, debugTokenVal)) {
      this.props.showAgentStatusMenu(false);

      // if we have less than 9 hours until the token expires, let's grab
      // a new token with this reauth modal!
      this.props.showConfirmationPopupGoReady({
        showConfirmationPopupGoReady: true,
        propertiesForLocalStorage: {
          isSso: !!this.props.agent.isSso,
          expiredSessionUsername: this.props.agent.username,
          tenantId: this.props.tenant.id,
          name: this.props.tenant.name,
        },
      });
    } else {
      this.changePresence('ready');
    }
  };

  renderReason = (reason, listId, includeSectionName) => {
    const isSelected =
      this.props.selectedPresenceReason.reasonId === reason.reasonId &&
      this.props.selectedPresenceReason.listId === listId;
    const selectReason = () => {
      this.changePresence('notready', reason, listId);
      this.clearHover();
      this.setCollapsibleMenus();
    };
    return (
      <MenuRow
        id={`reason-${reason.reasonId}-${listId}`}
        key={listId + reason.reasonId + this.state.clearHoverInt}
        rowText={
          includeSectionName === true
            ? `${reason.hierarchy[0]} - ${reason.name}`
            : reason.name
        }
        isSelected={isSelected}
        onSelect={selectReason}
        disabled={this.state.statusLoading}
      />
    );
  };

  renderCategory = (category, listId, categoryIndex) => {
    if (category.reasons.length === 1) {
      return this.renderReason(category.reasons[0], listId, true);
    }
    const containsSelected =
      category.reasons.findIndex(
        (reason) =>
          this.props.selectedPresenceReason.reasonId === reason.reasonId &&
          this.props.selectedPresenceReason.listId === listId
      ) > -1;
    const elementId = `${listId}-${categoryIndex}`;
    return (
      <Collapsible
        id={elementId}
        key={elementId}
        trigger={category.name}
        style={[containsSelected && styles.selectedCategory]}
        classParentString={
          containsSelected ? 'CollapsibleReasonBold' : 'CollapsibleReason'
        }
        open={this.state.expandedMenu === elementId}
        handleTriggerClick={() => this.setCollapsibleMenus(elementId)}
      >
        {category.reasons.map(
          (reason) => this.renderReason(reason, listId),
          this
        )}
      </Collapsible>
    );
  };

  renderList = (reasonList) => [
    <div
      id={`notReadyStateTitle-${reasonList.id}`}
      key={`notReadyStateTitle-${reasonList.id}`}
      style={styles.listTitle}
      title={reasonList.name}
    >
      {reasonList.name}
    </div>,
    <div
      key={`reasonListTitleBottom-${reasonList.id}`}
      style={[styles.narrowDivider, { margin: '5px 24px' }]}
    />,
    <div key={`reasonListBody-${reasonList.id}`}>
      {reasonList.reasons.map((reasonData, index) => {
        if (reasonData.type === 'category') {
          return this.renderCategory(reasonData, reasonList.id, index);
        } else {
          return this.renderReason(reasonData, reasonList.id);
        }
      })}
    </div>,
  ];

  logoutAndCloseMenu = () => {
    CxEngage.authentication.logout(
      (error) => error && window.location.reload()
    );
    this.props.showAgentStatusMenu(false);
  };

  render() {
    crmCssAdapter(styles, ['baseMenuContainer'], this.props.crmModule);

    return (
      <PopupDialog
        id="agentStatusMenu"
        style={styles.base}
        isVisible={this.props.show}
        hide={() => {
          this.props.showAgentStatusMenu(false);
        }}
        widthPx={303}
        arrowLeftOffsetPx={51}
      >
        <div style={styles.baseMenuContainer}>
          {this.props.hasActiveInteractions ||
          this.props.hasActiveWrapup ||
          this.props.hasActiveScript ? (
              <div id="agentLogoutLink" style={styles.presenceLinkContainer}>
                <FormattedMessage {...messages.logout} />
              </div>
            ) : (
              <div
                id="agentLogoutLink"
                style={[styles.presenceLinkContainer, styles.inactivePresence]}
                onClick={this.logoutAndCloseMenu}
              >
                <FormattedMessage {...messages.logout} />
              </div>
            )}
          <LargeMenuRow
            id="agentMenuTenant"
            titleText={messages.tenant}
            mainText={this.props.tenant.name}
          />
          <Collapsible
            className="agentMenuPathway"
            triggerHeader="Active Voice Pathway"
            trigger={this.props.activeExtension.description}
            triggerDisabled={this.props.readyState === 'ready'}
            open={this.state.expandedMenu === 'agentVoicePathway'}
            handleTriggerClick={() =>
              this.setCollapsibleMenus('agentVoicePathway')
            }
          >
            {this.props.extensions.map((extension, index) => (
              <div
                id={`${
                  extension.provider === undefined
                    ? extension.type
                    : extension.provider
                }-${extension.value}-${index}`}
                // eslint-disable-next-line
                key={`${
                  extension.provider === undefined
                    ? extension.type
                    : extension.provider
                }-${extension.value}-${index}`}
                style={styles.subMenuRows}
                onClick={() => {
                  this.props.setActiveExtension(extension);
                  this.setCollapsibleMenus();
                }}
              >
                {extension.description}
                {this.props.activeExtension.description ===
                  extension.description && (
                  <Icon
                    name="checkStatus"
                    alt="selected"
                    style={{ float: 'right' }}
                  />
                )}
              </div>
            ))}
          </Collapsible>
          <Collapsible
            className="agentDirectionMenu"
            triggerHeader="Mode"
            trigger={this.props.intl.formatMessage(
              messages[this.props.agentDirection.direction]
            )}
            triggerDisabled={!this.props.hasDirectionChangePermission}
            open={this.state.expandedMenu === 'agentDirection'}
            handleTriggerClick={() =>
              this.setCollapsibleMenus('agentDirection')
            }
          >
            <DirectionRow
              direction="inbound"
              style={styles.subMenuRows}
              setCollapsibleMenus={this.setCollapsibleMenus}
            />
            <DirectionRow
              direction="outbound"
              style={styles.subMenuRows}
              setCollapsibleMenus={this.setCollapsibleMenus}
            />
            <DirectionRow
              direction="agent-initiated"
              style={styles.subMenuRows}
              setCollapsibleMenus={this.setCollapsibleMenus}
            />
          </Collapsible>
          <div
            id="agentNotReadyState"
            style={[
              styles.notReadyReasons,
              this.state.statusLoading && styles.disabledPresenceUpdate,
            ]}
          >
            {this.props.presenceReasonLists.map(this.renderList, this)}
          </div>
          <div style={[styles.narrowDivider, { padding: '7px 24px 0 24px' }]} />
          {this.props.readyState === 'ready' ? (
            <div
              id="readyStateLink"
              style={[styles.presenceLinkContainer, styles.activePresence]}
            >
              <div style={styles.itemText}>
                <FormattedMessage {...messages.ready} />
              </div>
              <Icon
                name="checkStatus"
                alt="selected"
                style={styles.selectedIcon}
              />
            </div>
          ) : (
            <div
              id="readyStateLink"
              style={[
                styles.presenceLinkContainer,
                styles.inactivePresence,
                this.state.statusLoading && styles.disabledPresenceUpdate,
              ]}
              onClick={!this.state.statusLoading ? this.goReady : undefined}
            >
              <FormattedMessage {...messages.ready} />
            </div>
          )}
        </div>
      </PopupDialog>
    );
  }
}

AgentStatusMenu.propTypes = {
  intl: intlShape.isRequired,
  hasActiveInteractions: PropTypes.bool.isRequired,
  extensions: PropTypes.array.isRequired,
  activeExtension: PropTypes.object.isRequired,
  hasActiveWrapup: PropTypes.bool.isRequired,
  hasActiveScript: PropTypes.bool.isRequired,
  presenceReasonLists: PropTypes.array.isRequired,
  selectedPresenceReason: PropTypes.object.isRequired,
  showAgentStatusMenu: PropTypes.func,
  tenant: PropTypes.object,
  readyState: PropTypes.string,
  setActiveExtension: PropTypes.func.isRequired,
  goNotReady: PropTypes.func.isRequired,
  showConfirmationPopupGoReady: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  agentDirection: PropTypes.any,
  agent: PropTypes.object.isRequired,
  crmModule: PropTypes.string,
  hasDirectionChangePermission: PropTypes.bool.isRequired,
};

const mapStateToProps = (state, props) => ({
  hasActiveInteractions: selectHasActiveInteractions(state, props),
  extensions: selectExtensions(state, props),
  activeExtension: selectActiveExtension(state, props),
  hasActiveWrapup: selectHasActiveWrapup(state, props),
  hasActiveScript: selectHasActiveScript(state, props),
  selectedPresenceReason: selectSelectedPresenceReason(state, props),
  presenceReasonLists: selectPresenceReasonLists(state, props),
  agentDirection: selectAgentDirection(state, props),
  agent: selectAgent(state, props),
  crmModule: selectCrmModule(state, props),
  hasDirectionChangePermission: selectHasDirectionChangePermission(
    state,
    props
  ),
});

function mapDispatchToProps(dispatch) {
  return {
    setActiveExtension: (extension) => dispatch(setActiveExtension(extension)),
    goNotReady: (reason, listId) => dispatch(goNotReady(reason, listId)),
    showConfirmationPopupGoReady: (popupConfig) =>
      dispatch(showConfirmationPopupGoReady(popupConfig)),
    dispatch,
  };
}

export default ErrorBoundary(
  injectIntl(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(Radium(AgentStatusMenu))
  )
);
