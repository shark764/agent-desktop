/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';

import { Transfer } from '../Transfer';

describe('<Transfer />', () => {
  describe('with canTransfer and false connectingTransfers', () => {
    describe('on load', () => {
      beforeEach(() => {
        global.CxEngage = {
          entities: {
            getQueues: jest.fn(),
          },
        };
      });
      const rendered = shallow(
        <Transfer
          interactionId="mock-interaction-id"
          canTransfer
          connectingTransfers={false}
          queuesSet={false}
        />
      );
      it('only renders icon', () => {
        expect(rendered).toMatchSnapshot();
      });
      it('calls CxEngage.entities.getQueues and sets showTransferMenu clicking on icon', () => {
        rendered.find('#transferButton').simulate('click');
        expect(global.CxEngage.entities.getQueues.mock.calls.length).toBe(1);
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
      />
    );
    it('renders nothing', () => {
      expect(rendered).toMatchSnapshot();
    });
  });
});
