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

import { selectAgentId, selectWarmTransfers } from './selectors';
import messages from './messages';

import search from 'assets/icons/search.png';
import { startWarmTransferring } from 'containers/AgentDesktop/actions';

import Tabs from 'components/Tabs';
import TextInput from 'components/TextInput';

export class TransferMenu extends React.Component {

  constructor(props) {
    super(props);
    this.setQueuesCallback = this.setQueuesCallback.bind(this);
    this.setAgentsCallback = this.setAgentsCallback.bind(this);
    this.refreshQueues = this.refreshQueues.bind(this);
    this.refreshAgents = this.refreshAgents.bind(this);
    this.filterTransferListItems = this.filterTransferListItems.bind(this);

    this.state = {
      transferTabIndex: 0,
      transferSearchInput: '',
      queues: 'loading',
      agents: 'loading',

      /* XXX Mock data for transfer lists */
      transferLists: [
        {
          name: 'Emergency contacts',
          endpoints: [
            {
              category: 'Tier 1 Emergency',
              name: 'Betina Lopez',
              warmTransfer: true,
              coldTransfer: false,
            }, {
              category: 'Tier 2 Emergency',
              name: 'Robert Sheffman',
              warmTransfer: true,
              coldTransfer: true,
            }, {
              category: 'Tier 2 Emergency',
              name: 'Glenda Jones',
              warmTransfer: true,
              coldTransfer: true,
            },
          ],
        }, {
          name: 'Another Transfer List',
          endpoints: [
            {
              category: 'Category',
              name: 'Tom Tucker',
              warmTransfer: false,
              coldTransfer: true,
            },
          ],
        },
      ],
      /* XXX Mock data */
    };
  }

  componentDidMount() {
    SDK.api.getQueues({}, (error, topic, response) => this.setQueuesCallback(error, topic, response));
    SDK.api.getUsers({}, (error, topic, response) => this.setAgentsCallback(error, topic, response));

    this.reloadTransferablesInterval = setInterval(() => {
      SDK.api.getQueues({}, (error, topic, response) => this.setQueuesCallback(error, topic, response));
      SDK.api.getUsers({}, (error, topic, response) => this.setAgentsCallback(error, topic, response));
    }, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.reloadTransferablesInterval);
  }

  refreshQueues() {
    this.setState({ queues: 'loading' });
    SDK.api.getQueues({}, (error, topic, response) => this.setQueuesCallback(error, topic, response));
  }

  refreshAgents() {
    this.setState({ agents: 'loading' });
    SDK.api.getUsers({}, (error, topic, response) => this.setAgentsCallback(error, topic, response));
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

  styles = {
    transferListsContainer: {
      padding: '20px',
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
      maxHeight: 'calc(100vh - 290px)',
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
    category: {
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

  // XXX when transfer lists is done
  mockTransfer(name) {
    alert(`TODO ${this.state.transferTabIndex ? 'Cold' : 'Warm'} transfer to ${name}`);
  }

  transfer(name, resourceId, queueId) {
    console.log('transfer()', this.state.transferTabIndex === 0 ? 'warm' : 'cold', resourceId, queueId, this.props.interactionId);
    if (this.state.transferTabIndex === 0) {
      let id;
      let type;
      if (queueId !== undefined) {
        id = queueId;
        type = 'queue';
      } else if (resourceId !== undefined) {
        id = resourceId;
        type = 'agent';
      } else {
        throw new Error('neither resourceId nor queueId passed in');
      }
      const transferringTo = {
        id,
        type,
        name,
      };
      this.props.startWarmTransferring(this.props.interactionId, transferringTo);

      SDK.interactions.voice.warmTransfer({
        interactionId: this.props.interactionId,
        resourceId,
        queueId,
      });
    } else {
      SDK.interactions.voice.coldTransfer({
        interactionId: this.props.interactionId,
        resourceId,
        queueId,
      });
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

    const transferLists = [];
    this.state.transferLists.forEach((transferList) => {
      const categoryMap = new Map();
      transferList.endpoints.forEach((transferListItem) => {
        const category = transferListItem.category;
        if (!categoryMap.has(category)) {
          categoryMap.set(category, [transferListItem]);
        } else {
          categoryMap.get(category).push(transferListItem);
        }
      });
      const categoryList = [];
      categoryMap.forEach((transferListItems, category) => {
        const filteredTransferListItems = this.filterTransferListItems(transferListItems)
          .map((transferListItem) =>
            <div key={transferListItem.name} className="tranferListItem" onClick={() => this.mockTransfer(transferListItem.name)} style={this.styles.transferListItem} >
              { transferListItem.name }
            </div>
          );
        if (filteredTransferListItems.length > 0) {
          categoryList.push(
            <div key={category} >
              <div style={this.styles.category} >
                { category }
              </div>
              { filteredTransferListItems }
            </div>
          );
        }
      });
      if (categoryList.length > 0) {
        transferLists.push(
          <div key={transferList.name} style={this.styles.transferList}>
            <div style={this.styles.transferListTitle} >
              { transferList.name }
            </div>
            { categoryList }
          </div>
        );
      }
    });

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
        <div style={this.styles.transferListsContainer}>
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
            { /* TODO when transferLists is available
              transferLists */ }
          </div>
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
