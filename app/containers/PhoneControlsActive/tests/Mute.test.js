/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';

import { Mute } from '../Mute';

describe('<Mute />', () => {
  describe('with meOnHold', () => {
    const rendered = shallow(
      <Mute
        interactionId="mock-interaction-id"
        agentId="mock-agent-id"
        isMuted={false}
        meOnHold
      />
    );
    it('renders nothing', () => {
      expect(rendered).toMatchSnapshot();
    });
  });

  describe('with false meOnHold', () => {
    const rendered = shallow(
      <Mute
        interactionId="mock-interaction-id"
        agentId="mock-agent-id"
        isMuted={false}
        meOnHold={false}
      />
    );
    it('renders icon', () => {
      expect(rendered).toMatchSnapshot();
    });
  });

  describe('with isMuted', () => {
    beforeEach(() => {
      global.CxEngage = {
        interactions: {
          voice: {
            unmute: jest.fn(),
          },
        },
      };
    });
    const rendered = shallow(
      <Mute
        interactionId="mock-interaction-id"
        agentId="mock-agent-id"
        isMuted
        meOnHold={false}
      />
    );
    it('calls CxEngage.interactions.voice.unmute with the interaction id and agent id', () => {
      rendered.find('#muteButton').simulate('click');
      expect(global.CxEngage.interactions.voice.unmute.mock.calls.length).toBe(
        1
      );
      expect(
        global.CxEngage.interactions.voice.unmute.mock.calls[0][0]
      ).toEqual({
        interactionId: 'mock-interaction-id',
        targetResourceId: 'mock-agent-id',
      });
    });
  });

  describe('with false isMuted', () => {
    beforeEach(() => {
      global.CxEngage = {
        interactions: {
          voice: {
            mute: jest.fn(),
          },
        },
      };
    });
    const rendered = shallow(
      <Mute
        interactionId="mock-interaction-id"
        agentId="mock-agent-id"
        isMuted={false}
        meOnHold={false}
      />
    );
    it('calls CxEngage.interactions.voice.mute with the interaction id and agent id', () => {
      rendered.find('#muteButton').simulate('click');
      expect(global.CxEngage.interactions.voice.mute.mock.calls.length).toBe(1);
      expect(global.CxEngage.interactions.voice.mute.mock.calls[0][0]).toEqual({
        interactionId: 'mock-interaction-id',
        targetResourceId: 'mock-agent-id',
      });
    });
  });
});
