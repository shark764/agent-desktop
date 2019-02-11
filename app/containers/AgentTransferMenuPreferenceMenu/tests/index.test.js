/*
 * Copyright © 2015-2019 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';
import { AgentTransferMenuPreferenceMenu } from 'containers/AgentTransferMenuPreferenceMenu';

describe('<AgentTransferMenuPreferenceMenu />', () => {
  const queues = ['123', 'abc'];
  const transferLists = ['123', 'abc'];
  const selectedQueues = [];
  const selectedTransferLists = [];
  describe('agent preference menu enabled', () => {
    const rendered = shallow(
      <AgentTransferMenuPreferenceMenu
        initializeTransferMenuPreferences={() => {}}
        agentsTransferMenuEnabled
        toggleAgents={() => {}}
      />
    );
    it('renders the multiple preference options with select all button and open by default', () => {
      expect(rendered).toMatchSnapshot();
    });
  });
  describe('renders queues multi item preference list', () => {
    describe('preference list rendered', () => {
      const rendered = shallow(
        <AgentTransferMenuPreferenceMenu
          initializeTransferMenuPreferences={() => {}}
          queues={queues}
          selectedQueues={selectedQueues}
          toggleQueue={() => {}}
          showQueues
          toggleShowQueues={() => {}}
          toggleAgents={() => {}}
        />
      );
      it('renders the multiple preference options with select all button and open by default', () => {
        expect(rendered).toMatchSnapshot();
      });
    });
  });
  describe('renders transfer lists multi item preference', () => {
    describe('preference list rendered', () => {
      const rendered = shallow(
        <AgentTransferMenuPreferenceMenu
          initializeTransferMenuPreferences={() => {}}
          transferLists={transferLists}
          selectedTransferLists={selectedTransferLists}
          toggleTransferList={() => {}}
          toggleShowTransferLists={() => {}}
          showTransferLists
          toggleAgents={() => {}}
        />
      );
      it('renders the multiple preference options with select all button and open by default', () => {
        expect(rendered).toMatchSnapshot();
      });
    });
  });
});
