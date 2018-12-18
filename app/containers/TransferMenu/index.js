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

import { clearQueuesTime } from 'containers/AgentDesktop/actions';
import { selectAgentId, selectQueues } from 'containers/AgentDesktop/selectors';
import { selectBatchRequests } from 'containers/Toolbar/selectors';
import TransferDialPadButton from 'containers/TransferDialPadButton';
import TransferDialPad from 'containers/TransferDialPad';
import messages from './messages';
import {
  setResourceCapactiy,
  setUsers,
  setTransferLists,
  setTransferSearchInput,
  setFocusedTransferItemIndex,
  setTransferTabIndex,
  initializeQueuesAgentsVisibleState,
  updateQueuesListVisibleState,
  updateAgentsListVisibleState,
  updateTransferListVisibleState,
  tearDownTransferMenuStates,
  transferInteraction,
} from './actions';
import {
  selectWarmTransfers,
  selectAgents,
  selectTransferLists,
  selectQueuesListVisibleState,
  selectAgentsListVisibleState,
  selectTransferListsVisibleState,
  selectTransferSearchInput,
  selectFocusedTransferItemIndex,
  selectTransferTabIndex,
  selectShowTransferDialpad,
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

    if (!this.props.batchRequestsAreSuccessful) {
      CxEngage.entities.getUsers({ excludeOffline: true });
    }

    if (!this.props.nonVoice) {
      this.props.setTransferLists();
      this.props.initializeQueuesAgentsVisibleState();
    }

    CxEngage.entities.getQueues(this.refreshQueues);
    this.reloadQueuesInterval = setInterval(() => {
      CxEngage.entities.getQueues(this.refreshQueues);
    }, REFRESH_QUEUES_RATE);

    if (this.props.transferTabIndex === 0) {
      this.reloadTransferablesInterval = setInterval(() => {
        if (!this.props.batchRequestsAreSuccessful) {
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
    this.props.clearQueuesTime(this.props.queues);
    document.removeEventListener('keydown', this.hotKeys);
  }

  refreshQueues = () => {
    const queriesList = this.props.queues.map((queue) => ({
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
      this.props.queues &&
      this.props.queues[0] &&
      this.props.queues[0].queueTime !== undefined &&
      this.props.batchRequestsAreSuccessful
    ) {
      this.props.clearQueuesTime(this.props.queues);
      CxEngage.entities.getQueues(() => {
        CxEngage.reporting.triggerBatch();
      });
    }
  };

  refreshAgents = (e) => {
    e.stopPropagation();
    if (this.props.selectAgents !== undefined) {
      if (this.props.batchRequestsAreSuccessful) {
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
    transferList: {
      marginTop: '12px',
    },
    transferListTitle: {
      fontSize: '15px',
      fontWeight: 'bold',
      marginBottom: '4px',
      display: 'flex',
      borderRadius: '3px',
    },
    voiceTransferListTitle: {
      cursor: 'pointer',
      ':hover': {
        backgroundColor: '#23cdf4',
      },
      ':focus': {
        outline: 'none',
        backgroundColor: '#23cdf4',
      },
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
    hierarchy: {
      fontWeight: 600,
      padding: '6px 4px',
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
    transferSubItem: {
      display: 'inherit',
      maxWidth: '225px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
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
      marginTop: '6px',
      height: '8px',
      width: '13.33px',
      marginLeft: 'auto',
      flexShrink: '0',
      fontWeight: '600',
      transition: 'transform 0.5s',
    },
    iconOpen: {
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

  transferTransferListItem = (name, contactType, endpoint) => {
    if (contactType === 'queue') {
      this.props.transfer(
        this.props.setShowTransferMenu,
        name,
        undefined,
        endpoint
      );
    } else {
      const transferExtension = {
        type: contactType.toLowerCase(),
        value: endpoint,
      };
      this.props.transfer(
        this.props.setShowTransferMenu,
        name,
        undefined,
        undefined,
        transferExtension
      );
    }
  };

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
    const queues = this.filterTransferListItems(this.props.queues).map(
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

    let agents;
    if (!this.props.nonVoice) {
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

    let transferLists;
    if (!this.props.nonVoice) {
      if (
        this.props.transferLists !== 'loading' &&
        this.props.transferLists !== 'noTransferListsAvailable'
      ) {
        transferLists = [];
        this.props.transferLists.forEach((transferList, transferListIndex) => {
          const hierarchyMap = new Map();
          transferList.endpoints.forEach((transferListItem) => {
            const { hierarchy } = transferListItem;
            if (!hierarchyMap.has(hierarchy)) {
              hierarchyMap.set(hierarchy, [transferListItem]);
            } else {
              hierarchyMap.get(hierarchy).push(transferListItem);
            }
          });
          const hierarchyList = [];
          hierarchyMap.forEach((transferListItems, hierarchy) => {
            const filteredTransferListItems = this.filterTransferListItems(
              transferListItems
            )
              .filter((transferListItem) => {
                if (this.props.transferTabIndex === 0) {
                  return transferListItem.warmTransfer !== undefined;
                } else {
                  return transferListItem.coldTransfer !== undefined;
                }
              })
              .map((transferListItem, transferListItemIndex) => (
                <div
                  id={`${
                    transferList.id
                  }-${hierarchy}-${transferListItemIndex}`}
                  // The list is static, so we can just use the index as the key
                  // eslint-disable-next-line react/no-array-index-key
                  key={`${
                    transferList.id
                  }-${hierarchy}-${transferListItemIndex}`}
                  className="tranferListItem transferItem"
                  onClick={() =>
                    this.transferTransferListItem(
                      transferListItem.name,
                      transferListItem.contactType,
                      transferListItem.endpoint
                    )
                  }
                  title={transferListItem.name}
                  style={[
                    this.styles.transferListItem,
                    this.styles.transferSubItem,
                  ]}
                  tabIndex="0" // eslint-disable-line
                >
                  {transferListItem.name}
                </div>
              ));
            if (filteredTransferListItems.length > 0) {
              hierarchyList.push(
                <div
                  id={`${transferList.id}-${hierarchy}`}
                  // hierarchy is not the array index. it is the key of the map.
                  // eslint-disable-next-line
                  key={`${transferList.id}-${hierarchy}`}
                >
                  <div style={this.styles.hierarchy}>
                    {hierarchy}
                  </div>
                  {filteredTransferListItems}
                </div>
              );
            }
          });
          if (hierarchyList.length > 0) {
            transferLists.push(
              <div key={transferList.id} style={this.styles.transferList}>
                <div
                  id={`transferList-${transferListIndex}`}
                  key={`${transferList.id}-title`}
                  style={[
                    this.styles.transferListTitle,
                    this.styles.voiceTransferListTitle,
                  ]}
                  onClick={() =>
                    this.props.updateTransferListVisibleState(transferList.id)
                  }
                >
                  {transferList.name}
                  <Icon
                    name="caret"
                    style={
                      this.props.transferListsVisibleState[transferList.id]
                        ? this.styles.iconOpen
                        : this.styles.iconClosed
                    }
                  />
                </div>
                {(this.props.transferListsVisibleState[transferList.id] ||
                  this.props.transferSearchInput.trim() !== '') &&
                  hierarchyList}
              </div>
            );
          }
        });
      } else if (this.props.transferLists === 'loading') {
        transferLists = <FormattedMessage {...messages.loadingTransferLists} />;
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
              <div style={this.styles.transferList}>
                <div
                  id="queuesExpandCollapseBtn"
                  key="queuesListBtn"
                  style={[
                    this.styles.transferListTitle,
                    !this.props.nonVoice && this.styles.voiceTransferListTitle,
                  ]}
                  onClick={() =>
                    !this.props.nonVoice &&
                    this.props.updateQueuesListVisibleState()
                  }
                >
                  <FormattedMessage {...messages.queues} />
                  {(!this.props.nonVoice
                    ? this.props.queuesListVisibleState ||
                      this.props.transferSearchInput.trim() !== ''
                    : true) && (
                    <div
                      id="refreshQueues"
                      key="queuesRefreshBtn"
                      style={[
                        this.styles.refresh,
                        (this.props.queues === undefined ||
                          this.props.queues[0] === undefined ||
                          this.props.queues[0].queueTime === undefined ||
                          !this.props.batchRequestsAreSuccessful) &&
                          this.styles.refreshInProgress,
                      ]}
                      onClick={this.refreshQueuesButton}
                    >
                      &#8635;
                    </div>
                  )}
                  {!this.props.nonVoice && (
                    <Icon
                      name="caret"
                      style={
                        this.props.queuesListVisibleState
                          ? this.styles.iconOpen
                          : this.styles.iconClosed
                      }
                    />
                  )}
                </div>
                {(!this.props.nonVoice
                  ? this.props.queuesListVisibleState ||
                    this.props.transferSearchInput.trim() !== ''
                  : true) && queues}
              </div>
              {!this.props.nonVoice && (
                <div style={this.styles.transferList}>
                  <div
                    id="agentsExpandCollapseBtn"
                    key="agentsListBtn"
                    style={[
                      this.styles.transferListTitle,
                      !this.props.nonVoice &&
                        this.styles.voiceTransferListTitle,
                    ]}
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
                </div>
              )}
              {transferLists}
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
  transferLists: selectTransferLists(state, props),
  queuesListVisibleState: selectQueuesListVisibleState(state, props),
  agentsListVisibleState: selectAgentsListVisibleState(state, props),
  transferListsVisibleState: selectTransferListsVisibleState(state, props),
  transferSearchInput: selectTransferSearchInput(state, props),
  transferTabIndex: selectTransferTabIndex(state, props),
  focusedTransferItemIndex: selectFocusedTransferItemIndex(state, props),
  showTransferDialpad: selectShowTransferDialpad(state, props),
  agentId: selectAgentId(state, props),
  warmTransfers: selectWarmTransfers(state, props),
  queues: selectQueues(state, props),
  selectAgents: selectAgents(state, props),
  batchRequestsAreSuccessful: selectBatchRequests(state, props),
});

function mapDispatchToProps(dispatch) {
  return {
    clearQueuesTime: (queueData) => dispatch(clearQueuesTime(queueData)),
    setUsers: (users) => dispatch(setUsers(users)),
    setResourceCapactiy: (resourceCapacity) =>
      dispatch(setResourceCapactiy(resourceCapacity)),
    setTransferLists: () => dispatch(setTransferLists()),
    initializeQueuesAgentsVisibleState: () =>
      dispatch(initializeQueuesAgentsVisibleState()),
    updateQueuesListVisibleState: () =>
      dispatch(updateQueuesListVisibleState()),
    updateAgentsListVisibleState: () =>
      dispatch(updateAgentsListVisibleState()),
    updateTransferListVisibleState: (transferListId) =>
      dispatch(updateTransferListVisibleState(transferListId)),
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
  };
}

TransferMenu.propTypes = {
  style: PropTypes.object,
  setShowTransferMenu: PropTypes.func.isRequired,
  agentId: PropTypes.string.isRequired,
  warmTransfers: PropTypes.array,
  queues: PropTypes.array.isRequired,
  clearQueuesTime: PropTypes.func.isRequired,
  nonVoice: PropTypes.bool,
  selectAgents: PropTypes.array,
  batchRequestsAreSuccessful: PropTypes.bool.isRequired,
  setUsers: PropTypes.func.isRequired,
  setResourceCapactiy: PropTypes.func,
  setTransferLists: PropTypes.func.isRequired,
  transferLists: PropTypes.oneOfType([PropTypes.array, PropTypes.string])
    .isRequired,
  queuesListVisibleState: PropTypes.bool,
  agentsListVisibleState: PropTypes.bool,
  transferListsVisibleState: PropTypes.object,
  initializeQueuesAgentsVisibleState: PropTypes.func.isRequired,
  updateQueuesListVisibleState: PropTypes.func.isRequired,
  updateAgentsListVisibleState: PropTypes.func.isRequired,
  updateTransferListVisibleState: PropTypes.func.isRequired,
  transferSearchInput: PropTypes.string,
  transferTabIndex: PropTypes.number.isRequired,
  focusedTransferItemIndex: PropTypes.number.isRequired,
  showTransferDialpad: PropTypes.bool.isRequired,
  setTransferSearchInput: PropTypes.func.isRequired,
  setTransferTabIndex: PropTypes.func.isRequired,
  setFocusedTransferItemIndex: PropTypes.func.isRequired,
  tearDownTransferMenuStates: PropTypes.func.isRequired,
  transfer: PropTypes.func.isRequired,
};

export default ErrorBoundary(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Radium(TransferMenu))
);
