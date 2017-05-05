/*
 *
 * AgentStatusMenu
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Radium from 'radium';

import Icon from 'components/Icon';
import PopupDialog from 'components/PopupDialog';

import { setActiveExtension, goNotReady } from 'containers/AgentDesktop/actions';

import LargeMenuRow from './LargeMenuRow';
import MenuRow from './MenuRow';
import messages from './messages';
import { selectHasActiveInteractions, selectExtensions, selectActiveExtension, selectSelectedPresenceReason, selectPresenceReasonLists, selectHasActiveWrapup } from './selectors';

export class AgentStatusMenu extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      showReasonMenuInfo: {},
      clearHoverInt: 0,
    };
  }

  styles = {
    menuPosition: {
      position: 'fixed',
      left: '2px',
      bottom: '56px',
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
      borderTop: 'solid 1px #e4e4e4',
      lineHeight: '1.25',
    },
    presenceLinkContainer: {
      color: '#363636',
      textTransform: 'capitalize',
      width: '303px',
      padding: '10px 24px',
      display: 'flex',
    },
    listContainer: {
      marginBottom: '7px',
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
    clearButton: {
      border: '0',
      margin: '-4px 0 0 0',
      ':hover': {
        backgroundColor: '',
      },
    },
    selectedIcon: {
      alignSelf: 'center',
      cursor: 'inherit',
    },
    notReadyLinkContainer: {
      padding: '14px 24px 10px 24px',
    },
  };

  clearHover() { // Longstanding radium bug where mouseleave event is never triggered https://github.com/FormidableLabs/radium/issues/524
    this.setState({ clearHoverInt: this.state.clearHoverInt + 1 });
  }

  changePresence(newPresence, reason, listId) {
    if (newPresence === 'ready') {
      SDK.session.goReady({ extensionValue: this.props.activeExtension.value });
    } else if (newPresence === 'notready') {
      this.props.goNotReady(reason, listId);
    } else {
      throw new Error('newPresence is neither ready nor notready:', newPresence);
    }
    this.setState({ showReasonMenuInfo: {} });
    this.props.showAgentStatusMenu(false);
  }

  renderReason(reason, listId, includeSectionName) {
    const isSelected = (this.props.selectedPresenceReason.reasonId === reason.reasonId && this.props.selectedPresenceReason.listId === listId);
    const selectReason = () => {
      this.changePresence('notready', reason, listId);
      this.clearHover();
    };
    const clearReason = () => {
      this.changePresence('notready');
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
        onClear={clearReason}
      />
    );
  }

  renderCategory(category, listId, categoryIndex) {
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
        style={[containsSelected && this.styles.selectedCategory]}
        isOpen={isDropdownOpen}
        hasSubMenu
        subMenuRows={
          category.reasons.map((reason) => this.renderReason(reason, listId), this)
        }
      />
    );
  }

  renderList(reasonList) {
    return [
      <div key={`reasonListDivider-${reasonList.id}`} style={this.styles.narrowDivider}></div>,
      <div
        id={`notReadyStateTitle-${reasonList.id}`}
        key={`notReadyStateTitle-${reasonList.id}`}
        style={this.styles.listTitle}
      >
        <div>
          {reasonList.name}
        </div>
      </div>,
      <div key={`reasonListBody-${reasonList.id}`} style={this.styles.listContainer}>
        {reasonList.reasons.map((reasonData, index) => {
          if (reasonData.type === 'category') {
            return this.renderCategory(reasonData, reasonList.id, index);
          } else {
            return this.renderReason(reasonData, reasonList.id);
          }
        })}
      </div>,
    ];
  }

  render() {
    return (
      <div style={this.styles.menuPosition}>
        <PopupDialog id="agentStatusMenu" isVisible={this.props.show} hide={() => { this.setState({ showPathwayMenu: false }); this.setState({ showReasonMenuInfo: {} }); this.props.showAgentStatusMenu(false); }} widthPx={303} arrowLeftOffsetPx={51}>
          <div style={this.styles.baseMenuContainer}>
            { this.props.hasActiveInteractions || this.props.hasActiveWrapup
              ? <div id="agentLogoutLink" style={this.styles.presenceLinkContainer}><FormattedMessage {...messages.logout} /></div>
              : <div
                id="agentLogoutLink"
                style={[this.styles.presenceLinkContainer, this.styles.inactivePresence]}
                onClick={() => { SDK.session.end(); this.props.showAgentStatusMenu(false); }}
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
            />
            <div id="agentNotReadyState" style={this.styles.notReadyReasons}>
              {
                this.props.readyState === 'notready'
                  ? <div
                    id="notReadyStateLink"
                    style={[this.styles.presenceLinkContainer, this.styles.activePresence]}
                  >
                    <div style={this.styles.itemText}>
                      <FormattedMessage {...messages.notReady} />
                    </div>
                    <Icon name="checkStatus" alt="selected" style={this.styles.selectedIcon} />
                  </div>
                  : <div
                    id="notReadyStateLink"
                    style={[this.styles.presenceLinkContainer, this.styles.inactivePresence]}
                    onClick={() => { this.changePresence('notready'); }}
                  >
                    <FormattedMessage {...messages.notReady} />
                  </div>
              }
              {
                this.props.presenceReasonLists.map(this.renderList, this)
              }
            </div>
            <div style={this.styles.narrowDivider}></div>
            {
              this.props.readyState === 'ready'
              ? <div
                id="readyStateLink"
                style={[this.styles.presenceLinkContainer, this.styles.activePresence, {}]}
              >
                <div style={this.styles.itemText}>
                  <FormattedMessage {...messages.ready} />
                </div>
                <Icon name="checkStatus" alt="selected" style={this.styles.selectedIcon} />
              </div>
              : <div
                id="readyStateLink"
                style={[this.styles.presenceLinkContainer, this.styles.inactivePresence]}
                onClick={() => { this.changePresence('ready'); }}
              >
                <FormattedMessage {...messages.ready} />
              </div>
            }
          </div>
        </PopupDialog>
      </div>
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
    setActiveExtension: (extension) => dispatch(setActiveExtension(extension)),
    goNotReady: (reason, listId) => dispatch(goNotReady(reason, listId)),
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Radium(AgentStatusMenu));
