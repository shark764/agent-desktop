/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';

import { Hold } from '../Hold';

describe('<Hold />', () => {
  describe('with canUpdateHold', () => {
    const mocktoggleInteractionIsHolding = jest.fn();
    const rendered = shallow(
      <Hold
        interactionId="mock-interaction-id"
        isOnHold={false}
        toggleInteractionIsHolding={mocktoggleInteractionIsHolding}
        canUpdateHold
        isHolding
      />
    );
    it('renders icon', () => {
      expect(rendered).toMatchSnapshot();
    });
  });

  describe('with false canUpdateHold', () => {
    const mocktoggleInteractionIsHolding = jest.fn();
    const rendered = shallow(
      <Hold
        interactionId="mock-interaction-id"
        isOnHold={false}
        canUpdateHold={false}
        toggleInteractionIsHolding={mocktoggleInteractionIsHolding}
        isHolding
      />
    );
    it('renders nothing', () => {
      expect(rendered).toMatchSnapshot();
    });
  });

  describe('with isOnHold', () => {
    const mocktoggleInteractionIsHolding = jest.fn();
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
      <Hold
        interactionId="mock-interaction-id"
        toggleInteractionIsHolding={mocktoggleInteractionIsHolding}
        isOnHold
        canUpdateHold
        isHolding
      />
    );
    it('calls toggleInteractionIsHolding with interactionId', () => {
      rendered.find('#holdButton').simulate('click');
      expect(mocktoggleInteractionIsHolding).toMatchSnapshot();
    });
    it('calls CxEngage.interactions.voice.customerResume with the interactionId', () => {
      rendered.find('#holdButton').simulate('click');
      expect(
        global.CxEngage.interactions.voice.customerResume
      ).toMatchSnapshot();
    });
  });

  describe('with false isOnHold', () => {
    const mocktoggleInteractionIsHolding = jest.fn();
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
        toggleInteractionIsHolding={mocktoggleInteractionIsHolding}
        isHolding
      />
    );
    it('calls toggleInteractionIsHolding with interactionId', () => {
      rendered.find('#holdButton').simulate('click');
      expect(mocktoggleInteractionIsHolding).toMatchSnapshot();
    });
    it('calls CxEngage.interactions.voice.customerHold with the interactionId', () => {
      rendered.find('#holdButton').simulate('click');
      expect(global.CxEngage.interactions.voice.customerHold).toMatchSnapshot();
    });
  });
});
