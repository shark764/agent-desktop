/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * TransferMenu
 *
 */
import React from 'react';
import { connect } from 'react-redux';
import { Tab, TabList, TabPanel } from 'react-tabs';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import Radium from 'radium';
import ErrorBoundary from 'components/ErrorBoundary';

import search from 'assets/icons/search.png';
import Icon from 'components/Icon';
import Tabs from 'components/Tabs';
import TextInput from 'components/TextInput';
import TimeStat from 'components/TimeStat';

import {
  clearQueuesTime,
  updateInteractionTransferLists,
  updateInteractionTransferListsVisibleState,
  updateVisibleStateOfAllInteractionTransferlists,
} from 'containers/AgentDesktop/actions';
import {
  selectAgentId,
  getSelectedInteractionId,
  selectInteractionTransferLists,
  selectInteractionTransferListsLoadingState,
  selectInteractionTransferListsVisibleState,
  selectVisibleStateofAllInteractionTrasferLists,
} from 'containers/AgentDesktop/selectors';
import { selectBatchRequests } from 'containers/Toolbar/selectors';
import {
  selectAgentsPreferences,
  selectVisibleQueues,
  selectVisibleTransferLists,
} from 'containers/AgentTransferMenuPreferenceMenu/selectors';
import TransferDialPadButton from 'containers/TransferDialPadButton';
import TransferDialPad from 'containers/TransferDialPad';
import TransferLists from './TransferLists';
import messages from './messages';
import {
  setResourceCapactiy,
  setUsers,
  setTransferSearchInput,
  setFocusedTransferItemIndex,
  setTransferTabIndex,
  initializeQueuesAgentsVisibleState,
  updateQueuesListVisibleState,
  updateAgentsListVisibleState,
  tearDownTransferMenuStates,
  transferInteraction,
  updateUserAssignedTransferLists,
  updateUserAssignedTransferListsVisibleState,
  updateVisibleStateOfAllUserAssignedTransferlists,
  updateQueues,
} from './actions';
import {
  selectWarmTransfers,
  selectAgents,
  selectQueuesListVisibleState,
  selectAgentsListVisibleState,
  selectTransferSearchInput,
  selectFocusedTransferItemIndex,
  selectTransferTabIndex,
  selectShowTransferDialpad,
  selectUserAssignedTransferListsLoadingState,
  selectUserAssignedTransferListsVisibleState,
  selectVisibleStateOfAllUserAssignedTrasferLists,
  selectHasAgentExperienceTransferMenuQueuesViewPermission,
  selectHasAgentExperienceTransferMenuAgentsViewPermission,
} from './selectors';

const REFRESH_AGENTS_RATE = 5000;
const REFRESH_QUEUES_RATE = 10000;
export class TransferMenu extends React.Component {
  constructor(props) {
    super(props);
    this.mounted = false;
    this.queuesStatsIds = [];
  }

  hotKeys = (e) => {
    const availableTransferItems = document.getElementsByClassName(
      'transferItem'
    );
    const lastTransferItem = availableTransferItems.length - 1;

    if (e.target.id === 'transferSearchInput') {
      this.props.setFocusedTransferItemIndex(-1);
    }

    // 38 is up arrow
    if (e.which === 38 && availableTransferItems.length !== 0) {
      if (this.props.focusedTransferItemIndex === 0) {
        availableTransferItems[lastTransferItem].focus();
        this.props.setFocusedTransferItemIndex(lastTransferItem);
      } else {
        availableTransferItems[this.props.focusedTransferItemIndex - 1].focus();
        this.props.setFocusedTransferItemIndex(
          this.props.focusedTransferItemIndex - 1
        );
      }
    }

    // 40 is down arrow
    if (e.which === 40 && availableTransferItems.length !== 0) {
      if (
        this.props.focusedTransferItemIndex === -1 ||
        this.props.focusedTransferItemIndex === lastTransferItem
      ) {
        availableTransferItems[0].focus();
        this.props.setFocusedTransferItemIndex(0);
      } else {
        availableTransferItems[this.props.focusedTransferItemIndex + 1].focus();
        this.props.setFocusedTransferItemIndex(
          this.props.focusedTransferItemIndex + 1
        );
      }
    }
    // 13 is enter key
    if (e.which === 13) {
      if (e.target.className.includes('queueTransferListItem')) {
        this.props.transfer(
          this.props.setShowTransferMenu,
          e.target.title,
          undefined,
          e.target.id
        );
      } else if (e.target.className.includes('readyAgentTransferListItem')) {
        this.props.transfer(
          this.props.setShowTransferMenu,
          e.target.title,
          e.target.id
        );
      }
    }
  };

  componentDidMount() {
    this.mounted = true;
    document.addEventListener('keydown', this.hotKeys);

    this.props.updateUserAssignedTransferLists();
    this.props.updateInteractionTransferLists();
    this.props.initializeQueuesAgentsVisibleState();
    if (
      !this.props.batchRequestsAreSuccessful &&
      this.props.showAgentsTransferMenuPreference &&
      this.props.hasAgentExperienceTransferMenuAgentsViewPermission
    ) {
      CxEngage.entities.getUsers({ excludeOffline: true });
    }
    if (this.props.hasAgentExperienceTransferMenuQueuesViewPermission) {
      this.props.updateQueues(this.refreshQueues);
      this.reloadQueuesInterval = setInterval(() => {
        this.props.updateQueues(this.refreshQueues);
      }, REFRESH_QUEUES_RATE);
    }

    if (this.props.hasAgentExperienceTransferMenuAgentsViewPermission) {
      if (this.props.transferTabIndex === 0) {
        this.reloadTransferablesInterval = setInterval(() => {
          if (
            !this.props.batchRequestsAreSuccessful &&
            this.props.showAgentsTransferMenuPreference
          ) {
            CxEngage.entities.getUsers({ excludeOffline: true });
          }
        }, REFRESH_AGENTS_RATE);
      }
      CxEngage.reporting.addStatSubscription(
        { statistic: 'resource-capacity' },
        (error, topic, response) => {
          if (!error) {
            this.resourceCapacityStatId = response.statId;
          }
        }
      );
    }
  }

  componentWillUnmount() {
    this.mounted = false;

    this.props.tearDownTransferMenuStates();

    clearInterval(this.reloadQueuesInterval);
    clearInterval(this.reloadTransferablesInterval);

    if (this.resourceCapacityStatId !== undefined) {
      CxEngage.reporting.removeStatSubscription({
        statId: this.resourceCapacityStatId,
      });
    }
    CxEngage.reporting.bulkRemoveStatSubscription({
      statIds: this.queuesStatsIds,
    });

    this.props.setUsers(undefined);
    this.props.clearQueuesTime(this.props.selectVisibleQueues);
    document.removeEventListener('keydown', this.hotKeys);
  }

  refreshQueues = () => {
    const queriesList = this.props.selectVisibleQueues.map((queue) => ({
      statistic: 'queue-time',
      queueId: queue.id,
      statId: queue.id,
    }));
    //  Since we are using batch-response to get queues information, we need to compare if a new queue has been added or removed against currentQueuesIds
    const currentQueuesIds = this.queuesStatsIds;

    //  Creating a list of new added queues to add them to stats-subscription
    const addedQueuesList = queriesList.filter(
      (queryItem) => !currentQueuesIds.includes(queryItem.statId)
    );

    //  Creating a list of removed queues to remove them of stats-subscription
    const removedQueuesList = currentQueuesIds.filter(
      (queryItem) => !queriesList.map((e) => e.statId).includes(queryItem)
    );

    //  This will check if there are new queues added
    if (addedQueuesList.length > 0) {
      CxEngage.reporting.bulkAddStatSubscription(
        { queries: addedQueuesList },
        (error, topic, response) => {
          console.log(
            '[TransferMenu] CxEngage.reporting.bulkAddStatSubscription()',
            topic,
            response
          );
          this.queuesStatsIds = this.queuesStatsIds.concat(response.statIds);
        }
      );
    }
    //  This will check if there are queues removed
    if (removedQueuesList.length > 0) {
      removedQueuesList.forEach((queueStatId) => {
        CxEngage.reporting.removeStatSubscription({
          statId: queueStatId,
        });
        const index = this.queuesStatsIds.indexOf(queueStatId);
        if (index > -1) {
          this.queuesStatsIds.splice(index, 1);
        }
      });
    }
  };

  refreshQueuesButton = (e) => {
    e.stopPropagation();
    if (
      this.props.selectVisibleQueues &&
      this.props.selectVisibleQueues[0] &&
      this.props.selectVisibleQueues[0].queueTime !== undefined &&
      this.props.batchRequestsAreSuccessful
    ) {
      this.props.clearQueuesTime(this.props.selectVisibleQueues);
      this.props.updateQueues(() => {
        CxEngage.reporting.triggerBatch();
      });
    }
  };

  refreshAgents = (e) => {
    e.stopPropagation();
    if (this.props.selectAgents !== undefined) {
      if (
        this.props.batchRequestsAreSuccessful &&
        this.props.showAgentsTransferMenuPreference
      ) {
        this.props.setResourceCapactiy(undefined);
        CxEngage.reporting.triggerBatch();
      } else {
        this.props.setUsers(undefined);
        CxEngage.entities.getUsers({ excludeOffline: true });
      }
    }
  };

  styles = {
    transferListsContainer: {
      padding: '20px 20px 10px',
      flexGrow: '1',
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
    },
    transferSearchInput: {
      width: '100%',
      height: '35px',
      backgroundImage: `url(${search})`,
      backgroundSize: '16px',
      backgroundPosition: '11px 8px',
      backgroundRepeat: 'no-repeat',
      padding: '0 0 0 40px',
      marginBottom: '8px',
      flexShrink: '0',
    },
    transferLists: {
      overflowY: 'auto',
      textAlign: 'left',
      flexGrow: '1',
    },
    transferListDivContainer: {
      marginTop: '12px',
    },
    expandedTransferHeading: {
      fontSize: '15px',
      fontWeight: 'bold',
      display: 'flex',
      borderRadius: '3px',
      marginTop: '12px',
      marginBottom: '0px !important',
      cursor: 'pointer',
      ':hover': {
        color: '#FFFFFF',
        backgroundColor: '#23cdf4',
      },
      ':focus': {
        outline: 'none',
        color: '#FFFFFF',
        backgroundColor: '#23cdf4',
      },
    },
    collapsedTransferHeading: {
      fontSize: '15px',
      fontWeight: 'bold',
      display: 'flex',
      borderRadius: '3px',
      marginTop: '12px',
      marginBottom: '0px !important',
      color: 'rgb(151, 151, 151)',
      cursor: 'pointer',
      ':hover': {
        color: '#FFFFFF',
        backgroundColor: '#23cdf4',
      },
      ':focus': {
        outline: 'none',
        color: '#FFFFFF',
        backgroundColor: '#23cdf4',
      },
    },
    lineSpacer: {
      display: 'inline-block',
      width: '100%',
      height: '2px',
      borderBottom: '1px solid #e6e6e6',
    },
    refresh: {
      display: 'inline-block',
      marginLeft: '5px',
      cursor: 'pointer',
      ':hover': {
        backgroundColor: '#FE4565',
      },
      ':focus': {
        outline: 'none',
        backgroundColor: '#FE4565',
      },
    },
    refreshInProgress: {
      color: 'gray',
      cursor: 'loading',
    },
    transferListItem: {
      display: 'flex',
      padding: '6px 8px',
      height: '32px',
      borderRadius: '3px',
      cursor: 'pointer',
      ':hover': {
        backgroundColor: '#DEF8FE',
      },
      ':focus': {
        outline: 'none',
        backgroundColor: '#DEF8FE',
      },
    },
    inactiveTransferListItem: {
      color: 'gray',
      padding: '6px 8px',
      height: '32px',
    },
    queueName: {
      flexBasis: '100%',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
    },
    averageQueueTime: {
      marginLeft: 'auto',
      flexShrink: 0,
      fontWeight: 600,
    },
    agentStatusIcon: {
      height: '8px',
      width: '8px',
      borderRadius: '4px',
      display: 'inline-block',
      margin: '3px 7px 4px -5px',
    },
    agentAvailable: {
      backgroundColor: '#23CEF5',
    },
    agentUnavailable: {
      border: '1px solid #979797',
    },
    agentName: {
      flexGrow: '1',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      display: 'inline-block',
      maxWidth: '200px',
    },
    iconClosed: {
      marginTop: '4px',
      marginRight: '4px',
      height: '8px',
      width: '13.33px',
      marginLeft: 'auto',
      flexShrink: '0',
      opacity: '0.5',
      transition: 'transform 0.5s',
    },
    iconOpen: {
      marginTop: '4px',
      marginRight: '4px',
      transform: 'rotate(180deg)',
      marginLeft: 'auto',
      height: '8px',
      width: '13.33px',
      flexShrink: '0',
      fontWeight: '600',
    },
  };

  filterTransferListItems = (transferListItems) =>
    transferListItems.filter((transferListItem) => {
      if (this.props.transferSearchInput.trim() !== '') {
        return transferListItem.name
          .toUpperCase()
          .includes(this.props.transferSearchInput.toUpperCase());
      } else {
        return true;
      }
    });

  transferFromDialpad = (dialpadText) => {
    this.props.transfer(
      this.props.setShowTransferMenu,
      dialpadText,
      undefined,
      undefined,
      {
        type: 'pstn',
        value: dialpadText,
      }
    );
  };

  render() {
    let queues;
    if (this.props.hasAgentExperienceTransferMenuQueuesViewPermission) {
      queues = this.filterTransferListItems(this.props.selectVisibleQueues).map(
        (queue) => (
          <div
            id={queue.id}
            key={queue.id}
            className="queueTransferListItem transferItem"
            onClick={() =>
              this.props.transfer(
                this.props.setShowTransferMenu,
                queue.name,
                undefined,
                queue.id
              )
            }
            style={this.styles.transferListItem}
            title={queue.name}
            tabIndex="0" // eslint-disable-line
          >
            <span style={this.styles.queueName}>
              {queue.name}
            </span>
            <span style={this.styles.averageQueueTime}>
              {queue.queueTime !== undefined ? (
                <TimeStat time={queue.queueTime} unit="millis" />
              ) : (
                undefined
              )}
            </span>
          </div>
        )
      );
    }

    let agents;
    if (
      !this.props.nonVoice &&
      this.props.showAgentsTransferMenuPreference &&
      this.props.hasAgentExperienceTransferMenuAgentsViewPermission
    ) {
      if (this.props.selectAgents !== undefined) {
        agents = this.filterTransferListItems(this.props.selectAgents).map(
          (agent) => {
            if (
              this.props.warmTransfers &&
              this.props.warmTransfers.find(
                (transfer) => transfer.id === agent.agentId
              )
            ) {
              return (
                <div
                  key={agent.agentId}
                  id={agent.agentId}
                  className="readyAgentTransferListItem"
                  style={this.styles.inactiveTransferListItem}
                  title={agent.name}
                >
                  <div
                    style={[
                      this.styles.agentStatusIcon,
                      this.styles.agentAvailable,
                    ]}
                  />
                  <span style={this.styles.agentName}>
                    {agent.name}
                  </span>
                </div>
              );
            } else if (agent.isAvailable) {
              return (
                <div
                  key={agent.agentId}
                  id={agent.agentId}
                  className="readyAgentTransferListItem transferItem"
                  onClick={() =>
                    this.props.transfer(
                      this.props.setShowTransferMenu,
                      agent.name,
                      agent.agentId
                    )
                  }
                  style={this.styles.transferListItem}
                  title={agent.name}
                  tabIndex="0" // eslint-disable-line
                >
                  <div
                    style={[
                      this.styles.agentStatusIcon,
                      this.styles.agentAvailable,
                    ]}
                  />
                  <span style={this.styles.agentName}>
                    {agent.name}
                  </span>
                </div>
              );
            } else {
              return (
                <div
                  key={agent.agentId}
                  id={agent.agentId}
                  className="notReadyAgentTransferListItem transferItem"
                  style={this.styles.inactiveTransferListItem}
                  title={agent.name}
                  tabIndex="0" // eslint-disable-line
                >
                  <div
                    style={[
                      this.styles.agentStatusIcon,
                      this.styles.agentUnavailable,
                    ]}
                  />
                  <span style={this.styles.agentName}>
                    {agent.name}
                  </span>
                </div>
              );
            }
          }
        );
      } else {
        agents = <FormattedMessage {...messages.checking} />;
      }
    }

    return (
      <div
        style={[{ display: 'flex', flexDirection: 'column' }, this.props.style]}
      >
        {!this.props.nonVoice && (
          <Tabs
            id="transferTabs"
            type="small"
            selectedIndex={this.props.transferTabIndex}
            onSelect={(transferTabIndex) =>
              this.props.setTransferTabIndex(transferTabIndex)
            }
          >
            <TabList>
              <Tab>
                <FormattedMessage {...messages.addParticipant} />
              </Tab>
              <Tab>
                <FormattedMessage {...messages.transfer} />
              </Tab>
            </TabList>
            <TabPanel />
            <TabPanel />
          </Tabs>
        )}
        {!this.props.showTransferDialpad ? (
          <div style={this.styles.transferListsContainer}>
            <TextInput
              id="transferSearchInput"
              placeholder={messages.search}
              cb={(transferSearchInput) =>
                this.props.setTransferSearchInput(transferSearchInput)
              }
              value={this.props.transferSearchInput}
              style={this.styles.transferSearchInput}
              autoFocus
            />
            <div className="transferList" style={this.styles.transferLists}>
              {this.props
                .hasAgentExperienceTransferMenuQueuesViewPermission && (
                <div style={this.styles.transferListDivContainer}>
                  {this.props.selectVisibleQueues.length > 0 && (
                    <div
                      id="queuesExpandCollapseBtn"
                      key="queuesListBtn"
                      style={this.styles.transferTypeTitle}
                      onClick={() => this.props.updateQueuesListVisibleState()}
                    >
                      <FormattedMessage {...messages.queues} />
                      {(this.props.queuesListVisibleState ||
                        this.props.transferSearchInput.trim() !== '') && (
                        <div
                          id="refreshQueues"
                          key="queuesRefreshBtn"
                          style={[
                            this.styles.refresh,
                            (this.props.selectVisibleQueues === undefined ||
                              this.props.selectVisibleQueues[0] === undefined ||
                              this.props.selectVisibleQueues[0].queueTime ===
                                undefined ||
                              !this.props.batchRequestsAreSuccessful) &&
                              this.styles.refreshInProgress,
                          ]}
                          onClick={this.refreshQueuesButton}
                        >
                          &#8635;
                        </div>
                      )}
                      <Icon
                        name="caret"
                        style={
                          this.props.queuesListVisibleState
                            ? this.styles.iconOpen
                            : this.styles.iconClosed
                        }
                      />
                    </div>
                  )}
                  {(this.props.queuesListVisibleState ||
                    this.props.transferSearchInput.trim() !== '') &&
                    queues}
                </div>
              )}
              {!this.props.nonVoice &&
                this.props.showAgentsTransferMenuPreference &&
                this.props
                  .hasAgentExperienceTransferMenuAgentsViewPermission && (
                <div style={this.styles.transferListDivContainer}>
                  <div
                    id="agentsExpandCollapseBtn"
                    key="agentsListBtn"
                    style={
                      this.props.agentsListVisibleState
                        ? this.styles.expandedTransferHeading
                        : this.styles.collapsedTransferHeading
                    }
                    onClick={() =>
                      !this.props.nonVoice &&
                        this.props.updateAgentsListVisibleState()
                    }
                  >
                    <FormattedMessage {...messages.agents} />
                    {(this.props.agentsListVisibleState ||
                        this.props.transferSearchInput.trim() !== '') && (
                      <div
                        id="refreshAgents"
                        key="agentsRefreshBtn"
                        style={[
                          this.styles.refresh,
                          this.props.selectAgents === undefined &&
                              this.styles.refreshInProgress,
                        ]}
                        onClick={this.refreshAgents}
                      >
                          &#8635;
                      </div>
                    )}
                    <Icon
                      name="caret"
                      style={
                        this.props.agentsListVisibleState
                          ? this.styles.iconOpen
                          : this.styles.iconClosed
                      }
                    />
                  </div>
                  {(this.props.agentsListVisibleState ||
                    this.props.transferSearchInput.trim() !== '') &&
                    agents}
                  <div style={this.styles.lineSpacer} />
                </div>
              )}

              <TransferLists
                transferSearchInput={this.props.transferSearchInput}
                transferTabIndex={this.props.transferTabIndex}
                setShowTransferMenu={this.props.setShowTransferMenu}
                transfer={this.props.transfer}
                selectedInteractionId={this.props.selectedInteractionId}
                interactionTransferLists={this.props.interactionTransferLists}
                interactionTransferListsLoadingState={
                  this.props.interactionTransferListsLoadingState
                }
                interactionTransferListsVisibleState={
                  this.props.interactionTransferListsVisibleState
                }
                visibleStateofAllInteractionTrasferLists={
                  this.props.visibleStateofAllInteractionTrasferLists
                }
                userAssignedTransferLists={
                  this.props.selectVisibleTransferLists
                }
                userAssignedTransferListsLoadingState={
                  this.props.userAssignedTransferListsLoadingState
                }
                userAssignedTransferListsVisibleState={
                  this.props.userAssignedTransferListsVisibleState
                }
                visibleStateOfAllUserAssignedTransferLists={
                  this.props.visibleStateOfAllUserAssignedTransferLists
                }
                updateInteractionTransferListsVisibleState={
                  this.props.updateInteractionTransferListsVisibleState
                }
                updateVisibleStateOfAllInteractionTransferlists={
                  this.props.updateVisibleStateOfAllInteractionTransferlists
                }
                updateUserAssignedTransferListsVisibleState={
                  this.props.updateUserAssignedTransferListsVisibleState
                }
                updateVisibleStateOfAllUserAssignedTransferlists={
                  this.props.updateVisibleStateOfAllUserAssignedTransferlists
                }
                styles={{
                  transferListDivContainer: this.styles
                    .transferListDivContainer,
                  expandedTransferHeading: this.styles.expandedTransferHeading,
                  collapsedTransferHeading: this.styles
                    .collapsedTransferHeading,
                  lineSpacer: this.styles.lineSpacer,
                  iconOpen: this.styles.iconOpen,
                  iconClosed: this.styles.iconClosed,
                }}
              />
            </div>
          </div>
        ) : (
          <TransferDialPad transferFromDialpad={this.transferFromDialpad} />
        )}
        {!this.props.nonVoice && <TransferDialPadButton />}
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  queuesListVisibleState: selectQueuesListVisibleState(state, props),
  agentsListVisibleState: selectAgentsListVisibleState(state, props),
  transferSearchInput: selectTransferSearchInput(state, props),
  transferTabIndex: selectTransferTabIndex(state, props),
  focusedTransferItemIndex: selectFocusedTransferItemIndex(state, props),
  showTransferDialpad: selectShowTransferDialpad(state, props),
  agentId: selectAgentId(state, props),
  warmTransfers: selectWarmTransfers(state, props),
  selectAgents: selectAgents(state, props),
  batchRequestsAreSuccessful: selectBatchRequests(state, props),
  userAssignedTransferListsLoadingState: selectUserAssignedTransferListsLoadingState(
    state,
    props
  ),
  userAssignedTransferListsVisibleState: selectUserAssignedTransferListsVisibleState(
    state,
    props
  ),
  visibleStateOfAllUserAssignedTransferLists: selectVisibleStateOfAllUserAssignedTrasferLists(
    state,
    props
  ),
  selectedInteractionId: getSelectedInteractionId(state, props),
  interactionTransferLists: selectInteractionTransferLists(state, props),
  interactionTransferListsLoadingState: selectInteractionTransferListsLoadingState(
    state,
    props
  ),
  interactionTransferListsVisibleState: selectInteractionTransferListsVisibleState(
    state,
    props
  ),
  visibleStateofAllInteractionTrasferLists: selectVisibleStateofAllInteractionTrasferLists(
    state,
    props
  ),
  showAgentsTransferMenuPreference: selectAgentsPreferences(state, props),
  selectVisibleQueues: selectVisibleQueues(state, props),
  selectVisibleTransferLists: selectVisibleTransferLists(state, props),
  hasAgentExperienceTransferMenuQueuesViewPermission: selectHasAgentExperienceTransferMenuQueuesViewPermission(
    state,
    props
  ),
  hasAgentExperienceTransferMenuAgentsViewPermission: selectHasAgentExperienceTransferMenuAgentsViewPermission(
    state,
    props
  ),
});

function mapDispatchToProps(dispatch) {
  return {
    clearQueuesTime: (queueData) => dispatch(clearQueuesTime(queueData)),
    setUsers: (users) => dispatch(setUsers(users)),
    setResourceCapactiy: (resourceCapacity) =>
      dispatch(setResourceCapactiy(resourceCapacity)),
    initializeQueuesAgentsVisibleState: () =>
      dispatch(initializeQueuesAgentsVisibleState()),
    updateQueuesListVisibleState: () =>
      dispatch(updateQueuesListVisibleState()),
    updateAgentsListVisibleState: () =>
      dispatch(updateAgentsListVisibleState()),
    setTransferSearchInput: (transferSearchInput) =>
      dispatch(setTransferSearchInput(transferSearchInput)),
    setTransferTabIndex: (transferTabIndex) =>
      dispatch(setTransferTabIndex(transferTabIndex)),
    setFocusedTransferItemIndex: (focusedTransferItemIndex) =>
      dispatch(setFocusedTransferItemIndex(focusedTransferItemIndex)),
    tearDownTransferMenuStates: () => dispatch(tearDownTransferMenuStates()),
    transfer: (
      setShowTransferMenu,
      name,
      resourceId,
      queueId,
      transferExtension
    ) =>
      dispatch(
        transferInteraction(
          setShowTransferMenu,
          name,
          resourceId,
          queueId,
          transferExtension
        )
      ),
    updateUserAssignedTransferLists: () =>
      dispatch(updateUserAssignedTransferLists()),
    updateUserAssignedTransferListsVisibleState: (transferListId) =>
      dispatch(updateUserAssignedTransferListsVisibleState(transferListId)),
    updateVisibleStateOfAllUserAssignedTransferlists: () =>
      dispatch(updateVisibleStateOfAllUserAssignedTransferlists()),
    updateInteractionTransferLists: () =>
      dispatch(updateInteractionTransferLists()),
    updateInteractionTransferListsVisibleState: (transferListId) =>
      dispatch(updateInteractionTransferListsVisibleState(transferListId)),
    updateVisibleStateOfAllInteractionTransferlists: () =>
      dispatch(updateVisibleStateOfAllInteractionTransferlists()),
    updateQueues: (refreshQueues) => dispatch(updateQueues(refreshQueues)),
  };
}

TransferMenu.propTypes = {
  style: PropTypes.object,
  setShowTransferMenu: PropTypes.func.isRequired,
  agentId: PropTypes.string.isRequired,
  warmTransfers: PropTypes.array,
  clearQueuesTime: PropTypes.func.isRequired,
  nonVoice: PropTypes.bool,
  selectAgents: PropTypes.array,
  batchRequestsAreSuccessful: PropTypes.bool.isRequired,
  setUsers: PropTypes.func.isRequired,
  setResourceCapactiy: PropTypes.func,
  queuesListVisibleState: PropTypes.bool,
  agentsListVisibleState: PropTypes.bool,
  initializeQueuesAgentsVisibleState: PropTypes.func.isRequired,
  updateQueuesListVisibleState: PropTypes.func.isRequired,
  updateAgentsListVisibleState: PropTypes.func.isRequired,
  transferSearchInput: PropTypes.string,
  transferTabIndex: PropTypes.number.isRequired,
  focusedTransferItemIndex: PropTypes.number.isRequired,
  showTransferDialpad: PropTypes.bool.isRequired,
  setTransferSearchInput: PropTypes.func.isRequired,
  setTransferTabIndex: PropTypes.func.isRequired,
  setFocusedTransferItemIndex: PropTypes.func.isRequired,
  tearDownTransferMenuStates: PropTypes.func.isRequired,
  transfer: PropTypes.func.isRequired,
  updateUserAssignedTransferLists: PropTypes.func.isRequired,
  updateUserAssignedTransferListsVisibleState: PropTypes.func.isRequired,
  updateVisibleStateOfAllUserAssignedTransferlists: PropTypes.func.isRequired,
  userAssignedTransferLists: PropTypes.array,
  userAssignedTransferListsLoadingState: PropTypes.bool,
  userAssignedTransferListsVisibleState: PropTypes.object,
  visibleStateOfAllUserAssignedTransferLists: PropTypes.bool,
  updateInteractionTransferLists: PropTypes.func.isRequired,
  updateInteractionTransferListsVisibleState: PropTypes.func.isRequired,
  updateVisibleStateOfAllInteractionTransferlists: PropTypes.func.isRequired,
  selectedInteractionId: PropTypes.string,
  interactionTransferLists: PropTypes.array,
  interactionTransferListsLoadingState: PropTypes.bool,
  interactionTransferListsVisibleState: PropTypes.object,
  visibleStateofAllInteractionTrasferLists: PropTypes.bool,
  showAgentsTransferMenuPreference: PropTypes.bool.isRequired,
  selectVisibleQueues: PropTypes.array.isRequired,
  selectVisibleTransferLists: PropTypes.array.isRequired,
  updateQueues: PropTypes.func.isRequired,
  hasAgentExperienceTransferMenuQueuesViewPermission: PropTypes.bool.isRequired,
  hasAgentExperienceTransferMenuAgentsViewPermission: PropTypes.bool.isRequired,
};

export default ErrorBoundary(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Radium(TransferMenu))
);
