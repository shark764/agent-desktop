/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';

import { Transfer } from '../Transfer';

describe('<Transfer />', () => {
  describe('with canTransfer and false connectingTransfers', () => {
    describe('on load', () => {
      const updateQueues = jest.fn();
      const rendered = shallow(
        <Transfer
          interactionId="mock-interaction-id"
          canTransfer
          connectingTransfers={false}
          queuesSet={false}
          hasAgentExperienceTransferMenuQueuesViewPermission
          updateQueues={updateQueues}
        />
      );
      it('only renders icon', () => {
        expect(rendered).toMatchSnapshot();
      });
      it('calls updateQueues and sets showTransferMenu clicking on icon', () => {
        rendered.find('#transferButton').simulate('click');
        expect(updateQueues.mock.calls.length).toBe(1);
        expect(rendered.state(['showTransferMenu'])).toBe(true);
      });
    });

    describe('with showTransferMenu', () => {
      describe('not in toolbarMode', () => {
        const rendered = shallow(
          <Transfer
            interactionId="mock-interaction-id"
            canTransfer
            connectingTransfers={false}
            queuesSet
            hasAgentExperienceTransferMenuQueuesViewPermission
            updateQueues={() => {}}
          />
        );
        rendered.setState({ showTransferMenu: true });
        it('renders correctly', () => {
          expect(rendered).toMatchSnapshot();
        });
      });

      describe('in toolbarMode', () => {
        const rendered = shallow(
          <Transfer
            interactionId="mock-interaction-id"
            canTransfer
            connectingTransfers={false}
            queuesSet
            hasAgentExperienceTransferMenuQueuesViewPermission
            updateQueues={() => {}}
          />,
          {
            context: { toolbarMode: true },
          }
        );
        rendered.setState({ showTransferMenu: true });
        it('renders correctly', () => {
          expect(rendered).toMatchSnapshot();
        });
      });
    });
  });

  describe('with false canTransfer', () => {
    const rendered = shallow(
      <Transfer
        interactionId="mock-interaction-id"
        canTransfer={false}
        connectingTransfers={false}
        queuesSet
        hasAgentExperienceTransferMenuQueuesViewPermission
        updateQueues={() => {}}
      />
    );
    it('renders nothing', () => {
      expect(rendered).toMatchSnapshot();
    });
  });

  describe('with connectingTransfers', () => {
    const rendered = shallow(
      <Transfer
        interactionId="mock-interaction-id"
        canTransfer
        connectingTransfers
        queuesSet
        hasAgentExperienceTransferMenuQueuesViewPermission
        updateQueues={() => {}}
      />
    );
    it('renders nothing', () => {
      expect(rendered).toMatchSnapshot();
    });
  });
});
