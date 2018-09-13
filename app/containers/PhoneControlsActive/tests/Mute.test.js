/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';

import { Mute } from '../Mute';

describe('<Mute />', () => {
  describe('with meOnHold', () => {
    const mocktoggleInteractionIsMuting = jest.fn();
    const rendered = shallow(
      <Mute
        interactionId="mock-interaction-id"
        agentId="mock-agent-id"
        isMuted={false}
        toggleInteractionIsMuting={mocktoggleInteractionIsMuting}
        meOnHold
        isMuting
      />
    );
    it('renders nothing', () => {
      expect(rendered).toMatchSnapshot();
    });
  });

  describe('with false meOnHold', () => {
    const mocktoggleInteractionIsMuting = jest.fn();
    const rendered = shallow(
      <Mute
        interactionId="mock-interaction-id"
        agentId="mock-agent-id"
        isMuted={false}
        toggleInteractionIsMuting={mocktoggleInteractionIsMuting}
        meOnHold={false}
        isMuting
      />
    );
    it('renders icon', () => {
      expect(rendered).toMatchSnapshot();
    });
  });

  describe('with isMuted', () => {
    const mocktoggleInteractionIsMuting = jest.fn();
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
        toggleInteractionIsMuting={mocktoggleInteractionIsMuting}
        isMuting
      />
    );
    it('calls toggleInteractionIsMuting with interactionId with the interaction id and agent id', () => {
      rendered.find('#muteButton').simulate('click');
      expect(mocktoggleInteractionIsMuting).toMatchSnapshot();
    });
    it('calls CxEngage.interactions.voice.unmute with the interaction id and agent id', () => {
      rendered.find('#muteButton').simulate('click');
      expect(global.CxEngage.interactions.voice.unmute).toMatchSnapshot();
    });
  });

  describe('with false isMuted', () => {
    const mocktoggleInteractionIsMuting = jest.fn();
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
        toggleInteractionIsMuting={mocktoggleInteractionIsMuting}
        meOnHold={false}
        isMuting
      />
    );
    it('calls toggleInteractionIsMuting with the interaction id and agent id', () => {
      rendered.find('#muteButton').simulate('click');
      expect(mocktoggleInteractionIsMuting).toMatchSnapshot();
    });
    it('calls CxEngage.interactions.voice.mute with the interaction id and agent id', () => {
      rendered.find('#muteButton').simulate('click');
      expect(global.CxEngage.interactions.voice.mute).toMatchSnapshot();
    });
  });
});
