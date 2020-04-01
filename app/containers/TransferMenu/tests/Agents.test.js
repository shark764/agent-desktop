import React from 'react';
import { shallow } from 'enzyme';
import Agents from '../Agents';

describe('Agents Component render', () => {
  const agentsList = [];
  agentsList.push(
    <div
      key='1'
      id='1'
      className="readyAgentTransferListItem"
      style={{}}
      title="agentName"
    >
      <div style={{}} />
      <span style={{}}>
agentName
      </span>
    </div>
  );

  it('renders Agents component with permissions, showing menu agent transfer, without searching input', () => {
    const component = shallow(
      <Agents
        showAgentsTransferMenuPreference
        hasAgentExperienceTransferMenuAgentsViewPermission
        updateAgentsListVisibleState={() => 'mock updateAgentsListVisibleState'}
        agentsListVisibleState
        transferSearchInput="agentName"
        selectAgents={undefined}
        refreshAgents={() => 'mock refreshAgents'}
        agents={agentsList}
        styles={{}}
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('renders Agents component without permissions, it should not render anything', () => {
    const component = shallow(
      <Agents
        showAgentsTransferMenuPreference
        hasAgentExperienceTransferMenuAgentsViewPermission={false}
        updateAgentsListVisibleState={() => 'mock updateAgentsListVisibleState'}
        agentsListVisibleState
        transferSearchInput="agentName"
        selectAgents={undefined}
        refreshAgents={() => 'mock refreshAgents'}
        agents={agentsList}
        styles={{}}
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('renders Agents component with permissions, but not showing the menu preference, it should not render anything', () => {
    const component = shallow(
      <Agents
        showAgentsTransferMenuPreference={false}
        hasAgentExperienceTransferMenuAgentsViewPermission
        updateAgentsListVisibleState={() => 'mock updateAgentsListVisibleState'}
        agentsListVisibleState
        transferSearchInput="agentName"
        selectAgents={undefined}
        refreshAgents={() => 'mock refreshAgents'}
        agents={agentsList}
        styles={{}}
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('renders Agents component with permissions, not showing the refresh buttons', () => {
    const component = shallow(
      <Agents
        showAgentsTransferMenuPreference
        hasAgentExperienceTransferMenuAgentsViewPermission
        updateAgentsListVisibleState={() => 'mock updateAgentsListVisibleState'}
        agentsListVisibleState={false}
        transferSearchInput=""
        selectAgents={undefined}
        refreshAgents={() => 'mock refreshAgents'}
        agents={agentsList}
        styles={{}}
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('renders Agents component with permissions, with an empty agentsList', () => {
    const component = shallow(
      <Agents
        showAgentsTransferMenuPreference
        hasAgentExperienceTransferMenuAgentsViewPermission
        updateAgentsListVisibleState={() => 'mock updateAgentsListVisibleState'}
        agentsListVisibleState
        transferSearchInput="agentName"
        selectAgents={undefined}
        refreshAgents={() => 'mock refreshAgents'}
        agents={[]}
        styles={{}}
      />
    );
    expect(component).toMatchSnapshot();
  });
});
