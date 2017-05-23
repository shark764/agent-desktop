/*
 *
 * AgentStatusMenu
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import Radium from 'radium';

import BaseComponent from 'components/BaseComponent';
import { setCriticalError } from 'containers/Errors/actions';

import Icon from 'components/Icon';
import PopupDialog from 'components/PopupDialog';

import { setActiveExtension, goNotReady } from 'containers/AgentDesktop/actions';

import LargeMenuRow from './LargeMenuRow';
import MenuRow from './MenuRow';
import messages from './messages';
import { selectHasActiveInteractions, selectExtensions, selectActiveExtension, selectSelectedPresenceReason, selectPresenceReasonLists, selectHasActiveWrapup } from './selectors';

const styles = {
  menuPosition: {
    position: 'fixed',
    left: '2px',
    bottom: '56px',
    zIndex: '2',
  },
  baseMenuContainer: {
    padding: '3px 0',
    display: 'flex',
    flexDirection: 'column',
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
    textTransform: 'capitalize',
    width: '303px',
    padding: '10px 24px',
    display: 'flex',
  },
  listTitle: {
    color: '#979797',
    textTransform: 'capitalize',
    width: '303px',
    padding: '10px 24px 0 24px',
    display: 'flex',
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
};

export class AgentStatusMenu extends BaseComponent {

  constructor(props) {
    super(props);

    this.state = {
      showReasonMenuInfo: {},
      clearHoverInt: 0,
      statusLoading: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.readyState !== this.props.readyState || nextProps.selectedPresenceReason !== this.props.selectedPresenceReason) {
      this.setState({ statusLoading: false });
    }
  }

  clearHover = () => { // Longstanding radium bug where mouseleave event is never triggered https://github.com/FormidableLabs/radium/issues/524
    this.setState({ clearHoverInt: this.state.clearHoverInt + 1 });
  }

  changePresence = (newPresence, reason, listId) => {
    if (newPresence === 'ready') {
      this.setState({ statusLoading: true });
      CxEngage.session.goReady({ extensionValue: this.props.activeExtension.value });
    } else if (newPresence === 'notready') {
      this.setState({ statusLoading: true });
      this.props.goNotReady(reason, listId);
    } else {
      throw new Error('newPresence is neither ready nor notready:', newPresence);
    }
    this.setState({ showReasonMenuInfo: {} });
    this.props.showAgentStatusMenu(false);
  }

  goReady = () => { this.changePresence('ready'); }

  renderReason = (reason, listId, includeSectionName) => {
    const isSelected = (this.props.selectedPresenceReason.reasonId === reason.reasonId && this.props.selectedPresenceReason.listId === listId);
    const selectReason = () => {
      this.changePresence('notready', reason, listId);
      this.clearHover();
    };
    return (
      <MenuRow
        id={`reason-${reason.reasonId}-${listId}`}
        key={listId + reason.reasonId + this.state.clearHoverInt}
        rowText={includeSectionName === true
          ? `${reason.hierarchy[0]} - ${reason.name}`
          : reason.name
        }
        isSelected={isSelected}
        onSelect={selectReason}
        disabled={this.state.statusLoading}
      />
    );
  }

  renderCategory = (category, listId, categoryIndex) => {
    if (category.reasons.length === 1) {
      return this.renderReason(category.reasons[0], listId, true);
    }
    const containsSelected = category.reasons.findIndex(
      (reason) =>
        (this.props.selectedPresenceReason.reasonId === reason.reasonId && this.props.selectedPresenceReason.listId === listId)
      ) > -1;
    const isDropdownOpen = (this.state.showReasonMenuInfo.listId === listId) && (this.state.showReasonMenuInfo.index === categoryIndex);
    const elementId = `${listId}-${categoryIndex}`;
    return (
      <MenuRow
        id={elementId}
        key={elementId + this.state.clearHoverInt}
        rowText={category.name}
        onSelect={() => {
          this.setState({ showPathwayMenu: false, showReasonMenuInfo: isDropdownOpen ? {} : { listId, index: categoryIndex } });
        }}
        style={[containsSelected && styles.selectedCategory]}
        isOpen={isDropdownOpen}
        hasSubMenu
        subMenuRows={
          category.reasons.map((reason) => this.renderReason(reason, listId), this)
        }
      />
    );
  }

  renderList = (reasonList) => [
    <div
      id={`notReadyStateTitle-${reasonList.id}`}
      key={`notReadyStateTitle-${reasonList.id}`}
      style={styles.listTitle}
    >
      <div>
        {reasonList.name}
      </div>
    </div>,
    <div key={`reasonListTitleBottom-${reasonList.id}`} style={[styles.narrowDivider, { margin: '5px 24px' }]}></div>,
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

  render() {
    return (
      <PopupDialog id="agentStatusMenu" style={styles.menuPosition} isVisible={this.props.show} hide={() => { this.setState({ showPathwayMenu: false }); this.setState({ showReasonMenuInfo: {} }); this.props.showAgentStatusMenu(false); }} widthPx={303} arrowLeftOffsetPx={51}>
        <div style={styles.baseMenuContainer}>
          { this.props.hasActiveInteractions || this.props.hasActiveWrapup
            ? <div id="agentLogoutLink" style={styles.presenceLinkContainer}><FormattedMessage {...messages.logout} /></div>
            : <div
              id="agentLogoutLink"
              style={[styles.presenceLinkContainer, styles.inactivePresence]}
              onClick={() => { CxEngage.authentication.logout(); this.props.showAgentStatusMenu(false); }}
            >
              <FormattedMessage {...messages.logout} />
            </div>
          }
          <LargeMenuRow id="agentMenuTenant" titleText={messages.tenant} mainText={this.props.tenant.name} />
          <LargeMenuRow id="agentMenuMode" titleText={messages.mode} mainText={messages.inbound} />
          <LargeMenuRow
            id="agentMenuPathway"
            titleText={messages.activeVoicePath}
            mainText={this.props.activeExtension.description}
            hasSubMenu
            onClick={() => {
              this.setState({ showReasonMenuInfo: {}, showPathwayMenu: !this.state.showPathwayMenu });
            }}
            disabled={this.props.readyState === 'ready'}
            isOpen={this.state.showPathwayMenu}
            subMenuRows={
              this.props.extensions.map((extension) =>
                <MenuRow
                  key={extension.value}
                  id={extension.value}
                  rowText={extension.description}
                  onSelect={() => {
                    this.props.setActiveExtension(extension);
                    this.setState({ showPathwayMenu: false });
                    this.props.showAgentStatusMenu(false);
                  }}
                />
              )
            }
            style={{ borderBottom: 'solid 1px #e4e4e4' }}
          />
          <div
            id="agentNotReadyState"
            style={[
              styles.notReadyReasons,
              this.state.statusLoading && styles.disabledPresenceUpdate,
            ]}
          >
            {
              this.props.presenceReasonLists.map(this.renderList, this)
            }
          </div>
          <div style={[styles.narrowDivider, { padding: '7px 24px 0 24px' }]}></div>
          {
            this.props.readyState === 'ready'
            ? <div
              id="readyStateLink"
              style={[styles.presenceLinkContainer, styles.activePresence]}
            >
              <div style={styles.itemText}>
                <FormattedMessage {...messages.ready} />
              </div>
              <Icon name="checkStatus" alt="selected" style={styles.selectedIcon} />
            </div>
            : <div
              id="readyStateLink"
              style={[
                styles.presenceLinkContainer,
                styles.inactivePresence,
                this.state.statusLoading && styles.disabledPresenceUpdate,
              ]}
              onClick={!this.state.statusLoading && this.goReady}
            >
              <FormattedMessage {...messages.ready} />
            </div>
          }
        </div>
      </PopupDialog>
    );
  }
}

AgentStatusMenu.propTypes = {
  hasActiveInteractions: PropTypes.bool.isRequired,
  extensions: PropTypes.array.isRequired,
  activeExtension: PropTypes.object.isRequired,
  hasActiveWrapup: PropTypes.bool.isRequired,
  presenceReasonLists: PropTypes.array.isRequired,
  selectedPresenceReason: PropTypes.object.isRequired,
  showAgentStatusMenu: PropTypes.func,
  tenant: PropTypes.object,
  // agentDirection: PropTypes.string,
  readyState: PropTypes.string,
  setActiveExtension: PropTypes.func.isRequired,
  goNotReady: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
};

const mapStateToProps = (state, props) => ({
  hasActiveInteractions: selectHasActiveInteractions(state, props),
  extensions: selectExtensions(state, props),
  activeExtension: selectActiveExtension(state, props),
  hasActiveWrapup: selectHasActiveWrapup(state, props),
  selectedPresenceReason: selectSelectedPresenceReason(state, props),
  presenceReasonLists: selectPresenceReasonLists(state, props),
});

function mapDispatchToProps(dispatch) {
  return {
    setCriticalError: () => dispatch(setCriticalError()),
    setActiveExtension: (extension) => dispatch(setActiveExtension(extension)),
    goNotReady: (reason, listId) => dispatch(goNotReady(reason, listId)),
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Radium(AgentStatusMenu));
