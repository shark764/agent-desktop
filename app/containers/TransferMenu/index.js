/*
 *
 * TransferMenu
 *
 */

import React from 'react';
import { Tab, TabList, TabPanel } from 'react-tabs';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import Radium from 'radium';

import search from 'assets/icons/search.png';

import Tabs from 'components/Tabs';
import TextInput from 'components/TextInput';

export class TransferMenu extends React.Component {

  constructor(props) {
    super(props);
    this.filterTransferListItems = this.filterTransferListItems.bind(this);
    this.state = {
      transferTabIndex: 0,
      transferSearchInput: '',

      /* XXX Mock data for transfer lists */
      queues: [
        {
          name: 'Level 2 Support Queue',
          averageQueueTime: '25 min',
        }, {
          name: 'Level 3 Support Queue',
          averageQueueTime: '13 min',
        },
      ],
      agents: [
        {
          name: 'Leah Roberts',
          voiceCapacity: 1,
        }, {
          name: 'Levian Lian',
          voiceCapacity: 0,
        }, {
          name: 'Rachel Saunders',
          voiceCapacity: 1,
        }, {
          name: 'John Ruiz',
          voiceCapacity: 0,
        }, {
          name: 'Neil Keller',
          voiceCapacity: 0,
        },
      ],
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
      width: '200px',
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

  transfer(name) {
    // TODO connect to SDK here
    alert(`${this.state.transferTabIndex ? 'Warm' : 'Cold'} transfer to ${name}`);
  }

  render() {
    const queues = this.filterTransferListItems(this.state.queues)
      .map((queue) =>
        <div key={queue.name} className="queueTransferListItem" onClick={() => this.transfer(queue.name)} style={this.styles.transferListItem} >
          <span style={this.styles.queueName}>
            {queue.name}
          </span>
          <span style={this.styles.averageQueueTime}>
            {queue.averageQueueTime}
          </span>
        </div>
      );
    const agents = this.filterTransferListItems(this.state.agents)
      .map((agent) =>
        <div key={agent.name} className="agentTransferListItem" onClick={() => this.transfer(agent.name)} style={this.styles.transferListItem} >
          {agent.voiceCapacity === 0
            ? <div style={[this.styles.agentStatusIcon, this.styles.agentAvailable]}></div>
            : <div style={[this.styles.agentStatusIcon, this.styles.agentUnavailable]}></div>
          }
          <span style={this.styles.agentName}>
            {agent.name}
          </span>
        </div>
      );

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
            <div key={transferListItem.name} className="tranferListItem" onClick={() => this.transfer(transferListItem.name)} style={this.styles.transferListItem} >
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
              <FormattedMessage {...messages.coldTransfer} />
            </Tab>
            <Tab>
              <FormattedMessage {...messages.warmTransfer} />
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
                </div>
                { queues }
              </div>
              : ''
            }
            { agents.length > 0
              ? <div style={this.styles.transferList}>
                <div style={this.styles.transferListTitle} >
                  <FormattedMessage {...messages.agents} style={this.styles.transferListTitle} />
                </div>
                { agents }
              </div>
              : ''
            }
            { transferLists }
          </div>
        </div>
      </div>
    );
  }
}

export default (Radium(TransferMenu));
