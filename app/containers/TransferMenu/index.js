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
import { PhoneNumberUtil } from 'google-libphonenumber';

import search from 'assets/icons/search.png';

import ErrorBoundary from 'components/ErrorBoundary';

import Button from 'components/Button';
import CircleIconButton from 'components/CircleIconButton';
import Dialpad from 'components/Dialpad';
import Tabs from 'components/Tabs';
import TextInput from 'components/TextInput';
import TimeStat from 'components/TimeStat';

import {
  startWarmTransferring,
  setQueueTime,
} from 'containers/AgentDesktop/actions';
import { selectAgentId } from 'containers/AgentDesktop/selectors';

import { selectWarmTransfers, selectQueues } from './selectors';
import messages from './messages';

const REFRESH_AGENTS_RATE = 5000;
const REFRESH_QUEUES_RATE = 10000;

export class TransferMenu extends React.Component {
  constructor(props) {
    super(props);

    this.mounted = false;

    this.state = {
      transferTabIndex: 0,
      transferSearchInput: '',
      agents: 'loading',
      transferLists: 'loading',
      dialpadText: '',
      dialpadTextValid: false,
    };
  }

  phoneNumberUtil = PhoneNumberUtil.getInstance();

  setDialpadText = (dialpadText) => {
    let formattedDialpadText = dialpadText.replace(/[^0-9+*#]/g, '');
    if (formattedDialpadText.indexOf('+') !== 0) {
      formattedDialpadText = `+${formattedDialpadText}`;
    }
    let isValid = false;
    try {
      isValid = this.phoneNumberUtil.isValidNumber(
        this.phoneNumberUtil.parse(formattedDialpadText, 'E164')
      );
    } catch (e) {
      // Do nothing, this just means it is invalid
    }
    this.setState({ dialpadTextValid: isValid });
    this.setState({ dialpadText: formattedDialpadText });
  };

  componentDidMount() {
    this.mounted = true;

    this.refreshQueueTimes();
    CxEngage.entities.getUsers(
      { excludeOffline: true },
      this.setAgentsCallback
    );
    CxEngage.entities.getTransferLists((error, topic, response) =>
      this.setTransferListsCallback(error, topic, response)
    );

    this.reloadQueuesInterval = setInterval(() => {
      this.refreshQueueTimes();
    }, REFRESH_QUEUES_RATE);

    this.reloadTransferablesInterval = setInterval(() => {
      CxEngage.entities.getUsers(
        { excludeOffline: true },
        this.setAgentsCallback
      );
    }, REFRESH_AGENTS_RATE);
  }

  componentWillUnmount() {
    this.mounted = false;
    clearInterval(this.reloadQueuesInterval);
    clearInterval(this.reloadTransferablesInterval);
  }

  refreshQueueTimes = () => {
    this.props.queues.forEach((queue) => {
      CxEngage.reporting.statQuery(
        { statistic: 'queue-time', queueId: queue.id },
        (error, topic, response) => {
          if (!error) {
            console.log('[TransferMenu] CxEngage.subscribe()', topic, response);
            this.props.setQueueTime(
              queue.id,
              response[Object.keys(response)[0]].body.results.avg
            );
          }
        }
      );
    });
  };

  refreshAgents = () => {
    this.setState({ agents: 'loading' });
    CxEngage.entities.getUsers(
      { excludeOffline: true },
      this.setAgentsCallback
    );
  };

  setAgentsCallback = (error, topic, response) => {
    if (!error) {
      console.log('[TransferMenu] CxEngage.subscribe()', topic, response);
      CxEngage.reporting.getCapacity(
        {},
        (capacityError, capacityTopic, capacityResponse) => {
          console.log(
            '[TransferMenu] CxEngage.subscribe()',
            capacityTopic,
            capacityResponse
          );
          const agents = response.result
            .filter(
              (agent) =>
                // Filter ourself, pending users
                agent.id !== this.props.agentId && agent.status === 'accepted'
            )
            .map((agent) => ({
              id: agent.id,
              firstName: agent.firstName,
              lastName: agent.lastName,
              name: `${agent.firstName ? agent.firstName : ''} ${agent.lastName
                ? agent.lastName
                : ''}`,
              // If there was an error with getCapactity, we have to assume ready agents are available
              isAvailable: !capacityError
                ? this.isAgentAvailable(
                    agent,
                    capacityResponse.resourceCapacity
                  )
                : agent.state === 'ready',
            }))
            .sort((agent1, agent2) => {
              // Ready agents first, then sort by name alphabetically
              if (agent1.isAvailable && !agent2.isAvailable) return -1;
              if (!agent1.isAvailable && agent2.isAvailable) return 1;
              if (
                agent1.firstName.toLowerCase() + agent1.lastName.toLowerCase() <
                agent2.firstName.toLowerCase() + agent2.lastName.toLowerCase()
              )
                return -1;
              if (
                agent1.firstName.toLowerCase() + agent1.lastName.toLowerCase() >
                agent2.firstName.toLowerCase() + agent2.lastName.toLowerCase()
              )
                return 1;
              return 0;
            });
          if (this.mounted) {
            this.setState({
              agents,
            });
          }
        }
      );
    }
  };

  isAgentAvailable = (agent, resourceCapacities) => {
    if (agent.state !== 'ready') {
      return false;
    }
    let isAgentAvailable = false;
    const agentCapacities = resourceCapacities.find(
      (resourceCapacity) => resourceCapacity.resourceId === agent.id
    );
    // If there is no capacity (null) for the agent, they are not available
    if (agentCapacities && agentCapacities.capacity) {
      const voiceCapacity = agentCapacities.capacity.find((agentCapacity) =>
        Object.keys(agentCapacity.channels).includes('voice')
      );
      if (voiceCapacity) {
        isAgentAvailable = voiceCapacity.allocation !== 'fully-allocated';
      }
    }
    return isAgentAvailable;
  };

  setTransferListsCallback = (error, topic, response) => {
    console.log('[TransferMenu] CxEngage.subscribe()', topic, response);
    const transferLists = response.result.map((transferList) => ({
      id: transferList.id,
      name: transferList.name,
      endpoints: transferList.endpoints,
    }));
    if (this.mounted) {
      this.setState({
        transferLists,
      });
    }
  };

  styles = {
    transferListsContainer: {
      padding: '20px 20px 10px',
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
    },
    transferLists: {
      maxHeight: 'calc(100vh - 330px)',
      overflowY: 'auto',
      minHeight: '76px',
      textAlign: 'left',
    },
    transferListsToolbar: {
      maxHeight: undefined,
      height: 'calc(100vh - 292px)',
    },
    transferList: {
      marginTop: '12px',
    },
    transferListTitle: {
      fontSize: '15px',
      fontWeight: 'bold',
      marginBottom: '4px',
    },
    refresh: {
      display: 'inline-block',
      marginLeft: '5px',
      cursor: 'pointer',
    },
    hierarchy: {
      fontWeight: 600,
      padding: '6px 4px',
    },
    transferListItem: {
      padding: '6px 8px',
      height: '32px',
      borderRadius: '3px',
      cursor: 'pointer',
      ':hover': {
        backgroundColor: '#DEF8FE',
      },
    },
    inactiveTransferListItem: {
      color: 'gray',
      padding: '6px 8px',
      height: '32px',
    },
    queueName: {
      width: '175px',
      display: 'inline-block',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
    },
    averageQueueTime: {
      fontWeight: 600,
      float: 'right',
    },
    agentStatusIcon: {
      height: '8px',
      width: '8px',
      borderRadius: '4px',
      display: 'inline-block',
      margin: '0 15px 6px 0',
    },
    agentAvailable: {
      backgroundColor: '#23CEF5',
    },
    agentUnavailable: {
      border: '1px solid #979797',
    },
    agentName: {
      width: '175px',
      display: 'inline-block',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
    },
    dialpadButtonContainer: {
      backgroundColor: '#F3F3F3',
      borderTop: '1px solid #D0D0D0',
      padding: '10px 0',
    },
    dialpadButton: {
      display: 'block',
      margin: '0 auto',
    },
    dialpadContainer: {
      padding: '24px 12px',
    },
    transferDialpadButton: {
      display: 'block',
      margin: '24px auto 0',
      width: '134px',
    },
  };

  filterTransferListItems = (transferListItems) =>
    transferListItems.filter((transferListItem) => {
      if (this.state.transferSearchInput.trim() !== '') {
        return transferListItem.name
          .toUpperCase()
          .includes(this.state.transferSearchInput.toUpperCase());
      } else {
        return true;
      }
    });

  transferTransferListItem = (name, contactType, endpoint) => {
    if (contactType === 'queue') {
      this.transfer(name, undefined, endpoint);
    } else {
      const transferExtension = {
        type: contactType.toLowerCase(),
        value: endpoint,
      };
      this.transfer(name, undefined, undefined, transferExtension);
    }
  };

  transferFromDialpad = () => {
    this.transfer(this.state.dialpadText, undefined, undefined, {
      type: 'pstn',
      value: this.state.dialpadText,
    });
  };

  transfer = (name, resourceId, queueId, transferExtension) => {
    const interactionId = this.props.interactionId;
    let transferType;
    if (this.state.transferTabIndex === 0) {
      transferType = 'warm';
      let id;
      let type;
      if (queueId !== undefined) {
        id = queueId;
        type = 'queue';
      } else if (resourceId !== undefined) {
        id = resourceId;
        type = 'agent';
      } else if (transferExtension !== undefined) {
        id = transferExtension;
        type = 'transferExtension';
      } else {
        throw new Error(
          'warm transfer: neither resourceId, queueId, nor transferExtension passed in'
        );
      }
      const transferringTo = {
        id,
        type,
        name,
      };
      this.props.startWarmTransferring(interactionId, transferringTo);
    } else {
      transferType = 'cold';
    }

    if (queueId !== undefined) {
      console.log('transferToQueue()', interactionId, transferType, queueId);
      CxEngage.interactions.voice.transferToQueue({
        interactionId,
        queueId,
        transferType,
      });
    } else if (resourceId !== undefined) {
      console.log(
        'transferToResource()',
        interactionId,
        transferType,
        resourceId
      );
      CxEngage.interactions.voice.transferToResource({
        interactionId,
        resourceId,
        transferType,
      });
    } else if (transferExtension !== undefined) {
      console.log(
        'transferToExtension()',
        interactionId,
        transferType,
        transferExtension
      );
      CxEngage.interactions.voice.transferToExtension({
        interactionId,
        transferExtension,
        transferType,
      });
    } else {
      throw new Error(
        'neither resourceId, queueId, nor transferExtension passed in'
      );
    }

    this.props.setShowTransferMenu(false);
  };

  render() {
    const queues = this.filterTransferListItems(this.props.queues).map((queue) =>
      (<div
        id={queue.id}
        key={queue.id}
        className="queueTransferListItem"
        onClick={() => this.transfer(queue.name, undefined, queue.id)}
        style={this.styles.transferListItem}
        title={queue.name}
      >
        <span style={this.styles.queueName}>
          {queue.name}
        </span>
        <span style={this.styles.averageQueueTime}>
          {queue.queueTime !== undefined
            ? <TimeStat time={queue.queueTime} unit="millis" />
            : undefined}
        </span>
      </div>)
    );

    let agents;
    if (this.state.agents !== 'loading') {
      agents = this.filterTransferListItems(this.state.agents).map((agent) => {
        if (
          this.props.warmTransfers.find((transfer) => transfer.id === agent.id)
        ) {
          return (
            <div
              key={agent.id}
              id={agent.id}
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
              key={agent.id}
              id={agent.id}
              className="readyAgentTransferListItem"
              onClick={() => this.transfer(agent.name, agent.id)}
              style={this.styles.transferListItem}
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
        } else {
          return (
            <div
              key={agent.id}
              id={agent.id}
              className="notReadyAgentTransferListItem"
              style={this.styles.inactiveTransferListItem}
              title={agent.name}
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
      });
    } else {
      agents = ['Loading...'];
    }

    let transferLists;
    if (this.state.transferLists !== 'loading') {
      transferLists = [];
      this.state.transferLists.forEach((transferList) => {
        const hierarchyMap = new Map();
        transferList.endpoints.forEach((transferListItem) => {
          const hierarchy = transferListItem.hierarchy;
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
              if (this.state.transferTabIndex === 0) {
                return transferListItem.warmTransfer !== undefined;
              } else {
                return transferListItem.coldTransfer !== undefined;
              }
            })
            .map((transferListItem) =>
              (<div
                id={`${transferList.id}-${hierarchy}-${transferListItem.name}`}
                key={`${transferList.id}-${hierarchy}-${transferListItem.name}`}
                className="tranferListItem"
                onClick={() =>
                  this.transferTransferListItem(
                    transferListItem.name,
                    transferListItem.contactType,
                    transferListItem.endpoint
                  )}
                style={this.styles.transferListItem}
              >
                {transferListItem.name}
              </div>)
            );
          if (filteredTransferListItems.length > 0) {
            hierarchyList.push(
              <div
                id={`${transferList.id}-${hierarchy}`}
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
            <div
              id={transferList.id}
              key={transferList.id}
              style={this.styles.transferList}
            >
              <div style={this.styles.transferListTitle}>
                {transferList.name}
              </div>
              {hierarchyList}
            </div>
          );
        }
      });
    } else {
      transferLists = 'Loading Transfer Lists...';
    }

    return (
      <div>
        <Tabs
          id="transferTabs"
          type="small"
          selectedIndex={this.state.transferTabIndex}
          onSelect={(transferTabIndex) => this.setState({ transferTabIndex })}
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
        {!this.state.showTransferListDialpad
          ? <div style={this.styles.transferListsContainer}>
            <TextInput
              id="transferSearchInput"
              placeholder={messages.search}
              cb={(transferSearchInput) =>
                  this.setState({ transferSearchInput })}
              value={this.state.transferSearchInput}
              style={this.styles.transferSearchInput}
            />
            <div
              style={[
                this.styles.transferLists,
                this.context.toolbarMode && this.styles.transferListsToolbar,
              ]}
            >
              {queues.length > 0
                  ? <div style={this.styles.transferList}>
                    <div style={this.styles.transferListTitle}>
                      <FormattedMessage {...messages.queues} />
                      <div
                        id="refreshQueues"
                        style={this.styles.refresh}
                        onClick={() => this.refreshQueueTimes()}
                      >
                          &#8635;
                        </div>
                    </div>
                    {queues}
                  </div>
                  : ''}
              {agents.length > 0
                  ? <div style={this.styles.transferList}>
                    <div style={this.styles.transferListTitle}>
                      <FormattedMessage
                        {...messages.agents}
                        style={this.styles.transferListTitle}
                      />
                      <div
                        id="refreshAgents"
                        style={this.styles.refresh}
                        onClick={() => this.refreshAgents()}
                      >
                          &#8635;
                        </div>
                    </div>
                    {agents}
                  </div>
                  : ''}
              {transferLists}
            </div>
          </div>
          : <div style={this.styles.dialpadContainer}>
            <Dialpad
              id="dialpad"
              setDialpadText={this.setDialpadText}
              onEnter={this.transferFromDialpad}
              dialpadText={this.state.dialpadText}
              active={false}
              transfer
            />
            <Button
              id="transferDialpadButton"
              text={
                  this.state.transferTabIndex === 0
                    ? messages.addParticipant
                    : messages.transfer
                }
              disabled={!this.state.dialpadTextValid}
              onClick={this.transferFromDialpad}
              type="primaryBlue"
              style={this.styles.transferDialpadButton}
            />
          </div>}
        <div style={this.styles.dialpadButtonContainer}>
          <CircleIconButton
            id="transferDialpadButton"
            name={
              this.state.showTransferListDialpad
                ? 'transfer_dark'
                : 'dialpad_dark'
            }
            active={false}
            onClick={() =>
              this.setState({
                showTransferListDialpad: !this.state.showTransferListDialpad,
              })}
            style={this.styles.dialpadButton}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  agentId: selectAgentId(state, props),
  warmTransfers: selectWarmTransfers(state, props),
  queues: selectQueues(state, props),
});

function mapDispatchToProps(dispatch) {
  return {
    startWarmTransferring: (interactionId, transferringTo) =>
      dispatch(startWarmTransferring(interactionId, transferringTo)),
    setQueueTime: (queueId, queueTime) =>
      dispatch(setQueueTime(queueId, queueTime)),
    dispatch,
  };
}

TransferMenu.propTypes = {
  interactionId: PropTypes.string.isRequired,
  setShowTransferMenu: PropTypes.func.isRequired,
  agentId: PropTypes.string.isRequired,
  warmTransfers: PropTypes.array.isRequired,
  queues: PropTypes.array.isRequired,
  startWarmTransferring: PropTypes.func.isRequired,
  setQueueTime: PropTypes.func.isRequired,
};

TransferMenu.contextTypes = {
  toolbarMode: PropTypes.bool,
};

export default ErrorBoundary(
  connect(mapStateToProps, mapDispatchToProps)(Radium(TransferMenu))
);
