/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';

import Hold from '../Hold';

describe('<Hold />', () => {
  describe('with canUpdateHold', () => {
    const rendered = shallow(
      <Hold
        interactionId="mock-interaction-id"
        isOnHold={false}
        canUpdateHold
      />
    );
    it('renders icon', () => {
      expect(rendered).toMatchSnapshot();
    });
  });

  describe('with false canUpdateHold', () => {
    const rendered = shallow(
      <Hold
        interactionId="mock-interaction-id"
        isOnHold={false}
        canUpdateHold={false}
      />
    );
    it('renders nothing', () => {
      expect(rendered).toMatchSnapshot();
    });
  });

  describe('with isOnHold', () => {
    beforeEach(() => {
      global.CxEngage = {
        interactions: {
          voice: {
            customerResume: jest.fn(),
          },
        },
      };
    });
    const rendered = shallow(
      <Hold interactionId="mock-interaction-id" isOnHold canUpdateHold />
    );
    it('calls CxEngage.interactions.voice.customerResume with the interactionId', () => {
      rendered.find('#holdButton').simulate('click');
      expect(
        global.CxEngage.interactions.voice.customerResume.mock.calls.length
      ).toBe(1);
      expect(
        global.CxEngage.interactions.voice.customerResume.mock.calls[0][0]
      ).toEqual({ interactionId: 'mock-interaction-id' });
    });
  });

  describe('with false isOnHold', () => {
    beforeEach(() => {
      global.CxEngage = {
        interactions: {
          voice: {
            customerHold: jest.fn(),
          },
        },
      };
    });
    const rendered = shallow(
      <Hold
        interactionId="mock-interaction-id"
        isOnHold={false}
        canUpdateHold
      />
    );
    it('calls CxEngage.interactions.voice.customerHold with the interactionId', () => {
      rendered.find('#holdButton').simulate('click');
      expect(
        global.CxEngage.interactions.voice.customerHold.mock.calls.length
      ).toBe(1);
      expect(
        global.CxEngage.interactions.voice.customerHold.mock.calls[0][0]
      ).toEqual({ interactionId: 'mock-interaction-id' });
    });
  });
});
