/*
 * Copyright © 2015-2019 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';
import { AgentTransferMenuPreferenceMenu } from 'containers/AgentTransferMenuPreferenceMenu';

describe('<AgentTransferMenuPreferenceMenu />', () => {
  describe('agent preference menu enabled', () => {
    const rendered = shallow(
      <AgentTransferMenuPreferenceMenu
        initializeTransferMenuPreferences={() => {}}
        agentsTransferMenuEnabled
        toggleAgents={() => {}}
        toggleQueue={() => {}}
        toggleTransferList={() => {}}
        visibleQueues={[]}
        visibleTransferLists={[]}
      />
    );
    it('renders the multiple preference options with select all button and open by default', () => {
      expect(rendered).toMatchSnapshot();
    });
  });
  describe('renders queues multi item preference list with selected items', () => {
    describe('preference list rendered', () => {
      const rendered = shallow(
        <AgentTransferMenuPreferenceMenu
          initializeTransferMenuPreferences={() => {}}
          queues={['123', 'abc']}
          toggleQueue={() => {}}
          toggleAllQueues={() => {}}
          toggleShowQueues={() => {}}
          visibleQueues={['123', 'abc']}
          visibleTransferLists={[]}
          preferenceMenuQueuesLoading={false}
          toggleAgents={() => {}}
          toggleTransferList={() => {}}
          toggleAllTransferLists={() => {}}
          toggleShowTransferLists={() => {}}
        />
      );
      it('renders the multiple preference options with select all button', () => {
        expect(rendered).toMatchSnapshot();
      });
    });
  });
  describe('renders queues multi item preference list with loading state and empty list and loading state', () => {
    describe('preference list not rendered', () => {
      const rendered = shallow(
        <AgentTransferMenuPreferenceMenu
          initializeTransferMenuPreferences={() => {}}
          queues={[]}
          toggleQueue={() => {}}
          toggleAllQueues={() => {}}
          toggleShowQueues={() => {}}
          visibleQueues={[]}
          visibleTransferLists={[]}
          preferenceMenuQueuesLoading
          toggleAgents={() => {}}
          toggleTransferList={() => {}}
          toggleAllTransferLists={() => {}}
          toggleShowTransferLists={() => {}}
        />
      );
      it('does not renders the multiple preference options and sets loading state for queues list', () => {
        expect(rendered).toMatchSnapshot();
      });
    });
  });
  describe('renders transfer lists multi item preference list with selected items', () => {
    describe('preference list rendered', () => {
      const rendered = shallow(
        <AgentTransferMenuPreferenceMenu
          initializeTransferMenuPreferences={() => {}}
          transferLists={['123', 'abc']}
          toggleTransferList={() => {}}
          toggleAllTransferLists={() => {}}
          toggleShowTransferLists={() => {}}
          visibleTransferLists={['123', 'abc']}
          visibleQueues={[]}
          preferenceMenuTransferListsLoading={false}
          toggleAgents={() => {}}
          toggleQueue={() => {}}
          toggleAllQueues={() => {}}
          toggleShowQueues={() => {}}
        />
      );
      it('renders the multiple preference options with select all button', () => {
        expect(rendered).toMatchSnapshot();
      });
    });
  });
  describe('renders transfer lists multi item preference list with loading state and empty list', () => {
    describe('preference list not rendered', () => {
      const rendered = shallow(
        <AgentTransferMenuPreferenceMenu
          initializeTransferMenuPreferences={() => {}}
          transferLists={[]}
          toggleTransferList={() => {}}
          toggleAllTransferLists={() => {}}
          toggleShowTransferLists={() => {}}
          visibleTransferLists={[]}
          visibleQueues={[]}
          preferenceMenuTransferListsLoading
          toggleAgents={() => {}}
          toggleQueue={() => {}}
          toggleAllQueues={() => {}}
          toggleShowQueues={() => {}}
        />
      );
      it('does not renders the multiple preference options and sets loading state for transfer lists items', () => {
        expect(rendered).toMatchSnapshot();
      });
    });
  });
});
