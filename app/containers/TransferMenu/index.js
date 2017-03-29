/*
 *
 * TransferMenu
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Tab, TabList, TabPanel } from 'react-tabs';
import { FormattedMessage } from 'react-intl';
import Radium from 'radium';
import { PhoneNumberUtil } from 'google-libphonenumber';

import search from 'assets/icons/search.png';
import { startWarmTransferring } from 'containers/AgentDesktop/actions';

import Button from 'components/Button';
import CircleIconButton from 'components/CircleIconButton';
import Dialpad from 'components/Dialpad';
import Tabs from 'components/Tabs';
import TextInput from 'components/TextInput';

import { selectAgentId } from 'containers/AgentDesktop/selectors';
import { selectWarmTransfers } from './selectors';
import messages from './messages';

export class TransferMenu extends React.Component {

  constructor(props) {
    super(props);
    this.setQueuesCallback = this.setQueuesCallback.bind(this);
    this.setAgentsCallback = this.setAgentsCallback.bind(this);
    this.refreshQueues = this.refreshQueues.bind(this);
    this.refreshAgents = this.refreshAgents.bind(this);
    this.filterTransferListItems = this.filterTransferListItems.bind(this);
    this.setDialpadText = this.setDialpadText.bind(this);

    this.state = {
      transferTabIndex: 0,
      transferSearchInput: '',
      queues: 'loading',
      agents: 'loading',
      transferLists: 'loading',
      dialpadText: '',
      dialpadTextValid: false,
    };
  }

  phoneNumberUtil = PhoneNumberUtil.getInstance();

  setDialpadText(dialpadText) {
    let formattedDialpadText = dialpadText.replace(/[^0-9+*#]/g, '');
    if (formattedDialpadText.indexOf('+') !== 0) {
      formattedDialpadText = `+${formattedDialpadText}`;
    }
    let isValid = false;
    try {
      isValid = this.phoneNumberUtil.isValidNumber(this.phoneNumberUtil.parse(formattedDialpadText, 'E164'));
    } catch (e) {
      // Do nothing, this just means it is invalid
    }
    this.setState({ dialpadTextValid: isValid });
    this.setState({ dialpadText: formattedDialpadText });
  }

  componentDidMount() {
    SDK.entities.get.queues({}, (error, topic, response) => this.setQueuesCallback(error, topic, response));
    SDK.entities.get.users({}, (error, topic, response) => this.setAgentsCallback(error, topic, response));
    SDK.entities.get.transferLists({}, (error, topic, response) => this.setTransferListsCallback(error, topic, response));

    this.reloadTransferablesInterval = setInterval(() => {
      SDK.entities.get.users({}, (error, topic, response) => this.setAgentsCallback(error, topic, response));
    }, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.reloadTransferablesInterval);
  }

  refreshQueues() {
    this.setState({ queues: 'loading' });
    SDK.entities.get.queues({}, (error, topic, response) => this.setQueuesCallback(error, topic, response));
  }

  refreshAgents() {
    this.setState({ agents: 'loading' });
    SDK.entities.get.users({}, (error, topic, response) => this.setAgentsCallback(error, topic, response));
  }

  setQueuesCallback(error, topic, response) {
    console.log('[TransferMenu] SDK.subscribe()', topic, response);
    const queues = response.result.map((queue) => (
      {
        id: queue.id,
        name: queue.name,
        // TODO add averageQueueTime when it is available
      }
    ));
    this.setState({
      queues,
    });
  }

  setAgentsCallback(error, topic, response) {
    console.log('[TransferMenu] SDK.subscribe()', topic, response);
    const agents = response.result.filter((agent) =>
      // Filter ourself, pending users
      agent.id !== this.props.agentId && agent.status === 'accepted'
    ).sort((agent1, agent2) => {
      // Ready agents first, then sort by name alphabetically
      if (agent1.state === 'ready' && agent2.state !== 'ready') return -1;
      if (agent1.state !== 'ready' && agent2.state === 'ready') return 1;
      if (agent1.firstName.toLowerCase() + agent1.lastName.toLowerCase() < agent2.firstName.toLowerCase() + agent2.lastName.toLowerCase()) return -1;
      if (agent1.firstName.toLowerCase() + agent1.lastName.toLowerCase() > agent2.firstName.toLowerCase() + agent2.lastName.toLowerCase()) return 1;
      return 0;
    }).map((agent) => (
      {
        id: agent.id,
        name: `${agent.firstName ? agent.firstName : ''} ${agent.lastName ? agent.lastName : ''}`,
        state: agent.state,
        // TODO add voiceCapacity when it is available
      }
    ));
    this.setState({
      agents,
    });
  }

  setTransferListsCallback(error, topic, response) {
    console.log('[TransferMenu] SDK.subscribe()', topic, response);
    const transferLists = response.result.map((transferList) => (
      {
        name: transferList.name,
        endpoints: transferList.endpoints,
      }
    ));
    this.setState({
      transferLists,
    });
  }

  styles = {
    transferListsContainer: {
      padding: '20px 20px 10px',
    },
    transferSearchInput: {
      width: '100%',
      height: '35px',
      border: '1px solid #979797',
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
      width: '102px',
    },
  }

  filterTransferListItems(transferListItems) {
    return transferListItems.filter((transferListItem) => {
      if (this.state.transferSearchInput.trim() !== '') {
        return transferListItem.name.toUpperCase().includes(this.state.transferSearchInput.toUpperCase());
      } else {
        return true;
      }
    });
  }

  transferTransferListItem(name, contactType, endpoint) {
    if (contactType === 'queue') {
      this.transfer(name, undefined, endpoint);
    } else {
      const transferExtension = {
        type: contactType.toLowerCase(),
        value: endpoint,
      };
      this.transfer(name, undefined, undefined, transferExtension);
    }
  }

  transfer(name, resourceId, queueId, transferExtension) {
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
        throw new Error('warm transfer: neither resourceId, queueId, nor transferExtension passed in');
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
      SDK.interactions.voice.transferToQueue({
        interactionId,
        queueId,
        transferType,
      });
    } else if (resourceId !== undefined) {
      console.log('transferToResource()', interactionId, transferType, resourceId);
      SDK.interactions.voice.transferToResource({
        interactionId,
        resourceId,
        transferType,
      });
    } else if (transferExtension !== undefined) {
      console.log('transferToExtension()', interactionId, transferType, transferExtension);
      SDK.interactions.voice.transferToExtension({
        interactionId,
        transferExtension,
        transferType,
      });
    } else {
      throw new Error('neither resourceId, queueId, nor transferExtension passed in');
    }

    this.props.setShowTransferMenu(false);
  }

  render() {
    let queues;
    if (this.state.queues !== 'loading') {
      queues = this.filterTransferListItems(this.state.queues)
        .map((queue) =>
          <div key={queue.name} className="queueTransferListItem" onClick={() => this.transfer(queue.name, undefined, queue.id)} style={this.styles.transferListItem} title={queue.name}>
            <span style={this.styles.queueName}>
              {queue.name}
            </span>
            <span style={this.styles.averageQueueTime}>
              {queue.averageQueueTime}
            </span>
          </div>
        );
    } else {
      queues = ['Loading...'];
    }

    let agents;
    if (this.state.agents !== 'loading') {
      agents = this.filterTransferListItems(this.state.agents)
        .map((agent) => {
          if (this.props.warmTransfers.find((transfer) => transfer.id === agent.id)) {
            return (
              <div key={agent.id} id={agent.id} className="readyAgentTransferListItem" style={this.styles.inactiveTransferListItem} title={agent.name}>
                <div style={[this.styles.agentStatusIcon, this.styles.agentAvailable]}></div>
                <span style={this.styles.agentName}>
                  {agent.name}
                </span>
              </div>
            );
          // TODO add voiceCapacity to this check when it is available
          } else if (agent.state === 'ready') {
            return (
              <div key={agent.id} id={agent.id} className="readyAgentTransferListItem" onClick={() => this.transfer(agent.name, agent.id)} style={this.styles.transferListItem} title={agent.name}>
                <div style={[this.styles.agentStatusIcon, this.styles.agentAvailable]}></div>
                <span style={this.styles.agentName}>
                  {agent.name}
                </span>
              </div>
            );
          } else {
            return (
              <div key={agent.id} id={agent.id} className="notReadyAgentTransferListItem" style={this.styles.inactiveTransferListItem} title={agent.name}>
                <div style={[this.styles.agentStatusIcon, this.styles.agentUnavailable]}></div>
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
          const filteredTransferListItems = this.filterTransferListItems(transferListItems)
            .filter((transferListItem) => {
              if (this.state.transferTabIndex === 0) {
                return transferListItem.warmTransfer !== undefined;
              } else {
                return transferListItem.coldTransfer !== undefined;
              }
            }).map((transferListItem) =>
              <div
                key={transferListItem.name}
                className="tranferListItem"
                onClick={() => this.transferTransferListItem(transferListItem.name, transferListItem.contactType, transferListItem.endpoint)}
                style={this.styles.transferListItem}
              >
                { transferListItem.name }
              </div>
            );
          if (filteredTransferListItems.length > 0) {
            hierarchyList.push(
              <div key={hierarchy} >
                <div style={this.styles.hierarchy} >
                  { hierarchy }
                </div>
                { filteredTransferListItems }
              </div>
            );
          }
        });
        if (hierarchyList.length > 0) {
          transferLists.push(
            <div key={transferList.name} style={this.styles.transferList}>
              <div style={this.styles.transferListTitle} >
                { transferList.name }
              </div>
              { hierarchyList }
            </div>
          );
        }
      });
    } else {
      transferLists = 'Loading Transfer Lists...';
    }

    return (
      <div>
        <Tabs id="transferTabs" type="small" selectedIndex={this.state.transferTabIndex} onSelect={(transferTabIndex) => this.setState({ transferTabIndex })} >
          <TabList>
            <Tab>
              <FormattedMessage {...messages.warmTransfer} />
            </Tab>
            <Tab>
              <FormattedMessage {...messages.coldTransfer} />
            </Tab>
          </TabList>
          <TabPanel></TabPanel>
          <TabPanel></TabPanel>
        </Tabs>
        {!this.state.showTransferListDialpad
        ? <div style={this.styles.transferListsContainer}>
          <TextInput
            id="transferSearchInput"
            placeholder={messages.search}
            cb={(transferSearchInput) => this.setState({ transferSearchInput })}
            value={this.state.transferSearchInput}
            style={this.styles.transferSearchInput}
          />
          <div style={this.styles.transferLists}>
            { queues.length > 0
              ? <div style={this.styles.transferList}>
                <div style={this.styles.transferListTitle} >
                  <FormattedMessage {...messages.queues} />
                  <div id="refreshQueues" style={this.styles.refresh} onClick={() => this.refreshQueues()}>&#8635;</div>
                </div>
                { queues }
              </div>
              : ''
            }
            { agents.length > 0
              ? <div style={this.styles.transferList}>
                <div style={this.styles.transferListTitle} >
                  <FormattedMessage {...messages.agents} style={this.styles.transferListTitle} />
                  <div id="refreshAgents" style={this.styles.refresh} onClick={() => this.refreshAgents()}>&#8635;</div>
                </div>
                { agents }
              </div>
              : ''
            }
            { transferLists }
          </div>
        </div>
        : <div style={this.styles.dialpadContainer}>
          <Dialpad id="dialpad" setDialpadText={this.setDialpadText} dialpadText={this.state.dialpadText} />
          <Button
            id="transferDialpadButton"
            text={messages.transfer}
            disabled={!this.state.dialpadTextValid}
            onClick={() => this.transfer(this.state.dialpadText, undefined, undefined, { type: 'pstn', value: this.state.dialpadText })}
            type="primaryBlue"
            style={this.styles.transferDialpadButton}
          />
        </div>
        }
        <div style={this.styles.dialpadButtonContainer}>
          <CircleIconButton
            id="transferDialpadButton"
            name={this.state.showTransferListDialpad ? 'transfer' : 'dialpad'}
            active={false} onClick={() => this.setState({ showTransferListDialpad: !this.state.showTransferListDialpad })}
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
});

function mapDispatchToProps(dispatch) {
  return {
    startWarmTransferring: (interactionId, transferringTo) => dispatch(startWarmTransferring(interactionId, transferringTo)),
    dispatch,
  };
}

TransferMenu.propTypes = {
  interactionId: PropTypes.string.isRequired,
  setShowTransferMenu: PropTypes.func.isRequired,
  agentId: PropTypes.string.isRequired,
  warmTransfers: PropTypes.array.isRequired,
  startWarmTransferring: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Radium(TransferMenu));
