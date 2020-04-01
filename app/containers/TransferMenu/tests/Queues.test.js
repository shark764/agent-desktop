import React from 'react';
import { shallow } from 'enzyme';
import Queues from '../Queues';

describe('Queues Component render', () => {
  const globalQueues = [
    { queueTime: 'queueTimeValue01' },
    { queueTime: 'queueTimeValue02' },
  ];

  const queuesList = [];
  queuesList.push(
    <div
      id='1'
      key='1'
      className="queueTransferListItem transferItem"
      onClick={() => 'mock transfer'}
      style={{}}
      title="queueName"
      tabIndex="0" // eslint-disable-line
    >
      <span style={{}}>
queueName
      </span>
      <span style={{}}>
millis
      </span>
    </div>
  );

  it('renders Queues component with permissions, without searching input', () => {
    const component = shallow(
      <Queues
        hasAgentExperienceTransferMenuQueuesViewPermission
        queuesListVisibleState
        transferSearchInput=""
        batchRequestsAreSuccessful={false}
        globalQueues={[]}
        queues={queuesList}
        updateQueuesListVisibleState={() => 'mock updateQueuesListVisibleState'}
        refreshQueuesButton={() => 'mock refreshQueuesButton'}
        styles={{}}
      />
    );
    expect(component).toMatchSnapshot();
  });
  it('renders Queues component without permissions. Actually should not render anything', () => {
    const component = shallow(
      <Queues
        hasAgentExperienceTransferMenuQueuesViewPermission={false}
        queuesListVisibleState
        transferSearchInput=""
        batchRequestsAreSuccessful={false}
        globalQueues={[]}
        queues={queuesList}
        updateQueuesListVisibleState={() => 'mock updateQueuesListVisibleState'}
        refreshQueuesButton={() => 'mock refreshQueuesButton'}
        styles={{}}
      />
    );
    expect(component).toMatchSnapshot();
  });
  it('renders Queues component with permissions, with a search input, without refresh button', () => {
    const component = shallow(
      <Queues
        hasAgentExperienceTransferMenuQueuesViewPermission
        queuesListVisibleState={false}
        transferSearchInput="queueName"
        batchRequestsAreSuccessful={false}
        globalQueues={globalQueues}
        queues={queuesList}
        updateQueuesListVisibleState={() => 'mock updateQueuesListVisibleState'}
        refreshQueuesButton={() => 'mock refreshQueuesButton'}
        styles={{}}
      />
    );
    expect(component).toMatchSnapshot();
  });
  it('renders Queues component with permissions, with empty queues', () => {
    const component = shallow(
      <Queues
        hasAgentExperienceTransferMenuQueuesViewPermission
        queuesListVisibleState
        transferSearchInput=""
        batchRequestsAreSuccessful={false}
        globalQueues={[]}
        queues={[]}
        updateQueuesListVisibleState={() => 'mock updateQueuesListVisibleState'}
        refreshQueuesButton={() => 'mock refreshQueuesButton'}
        styles={{}}
      />
    );
    expect(component).toMatchSnapshot();
  });
});
