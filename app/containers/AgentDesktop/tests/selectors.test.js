/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import { fromJS } from 'immutable';
import {
  selectInteractionsList,
  selectLoginMap,
  selectAgentDesktopMap,
  selectAgentId,
  selectAwaitingDisposition,
  selectHasVoiceInteraction,
  selectSmsInteractionNumbers,
  selectInteractionEmails,
} from '../selectors';

describe('selectInteractionsList', () => {
  it('should select interactions on the AgentDesktop domain', () => {
    const mockInteractions = [{ interactionId: 'mockId' }];
    const mockedState = fromJS({
      agentDesktop: {
        interactions: mockInteractions,
      },
    });
    expect(selectInteractionsList(mockedState)).toMatchSnapshot();
  });
});

describe('selectLoginMap', () => {
  it('should select the login domain', () => {
    const mockLoginDomain = {
      agent: { userId: 'mockId' },
    };
    const mockedState = fromJS({
      login: mockLoginDomain,
    });
    expect(selectLoginMap(mockedState)).toMatchSnapshot();
  });
});

describe('selectAgentDesktopMap', () => {
  it('should select the agentDesktop domain', () => {
    const mockAgentDesktopDomain = {
      interactions: ['mockInteraction'],
    };
    const mockedState = fromJS({
      agentDesktop: mockAgentDesktopDomain,
    });
    expect(selectAgentDesktopMap(mockedState)).toMatchSnapshot();
  });
});

describe('selectAgentId', () => {
  it('should select the agent userId from the login domain', () => {
    const mockLoginDomain = {
      agent: { userId: 'mockId' },
    };
    const mockedState = fromJS({
      login: mockLoginDomain,
    });
    expect(selectAgentId(mockedState)).toEqual('mockId');
  });
});

describe('selectAwaitingDisposition', () => {
  it('should return true if the selected interaction is in wrapup & awaiting a disposition', () => {
    const mockedState = fromJS({
      agentDesktop: {
        selectedInteractionId: 'mockId',
        interactions: [
          {
            status: 'wrapup',
            interactionId: 'mockId',
            dispositionDetails: {
              forceSelect: true,
              selected: [],
            },
          },
        ],
        noInteractionContactPanel: {},
        newInteractionPanel: {},
      },
    });
    expect(selectAwaitingDisposition(mockedState)).toEqual(true);
  });
});

describe('selectHasVoiceInteraction', () => {
  it('should return true when there is a voice interaction', () => {
    const mockedState = fromJS({
      agentDesktop: {
        interactions: [
          {
            channelType: 'sms',
          },
          {
            channelType: 'voice',
          },
        ],
      },
    });
    expect(selectHasVoiceInteraction(mockedState)).toEqual(true);
  });
  it('should return false when there is not a voice interaction', () => {
    const mockedState = fromJS({
      agentDesktop: {
        interactions: [
          {
            channelType: 'sms',
          },
        ],
      },
    });
    expect(selectHasVoiceInteraction(mockedState)).toEqual(false);
  });
});

describe('selectSmsInteractionNumbers', () => {
  it('should return the customer numbers for all sms interactions', () => {
    const mockedState = fromJS({
      agentDesktop: {
        interactions: [
          {
            channelType: 'email',
            customer: 'test@serenova.com',
          },
          {
            channelType: 'sms',
            customer: '+15064701234',
          },
          {
            channelType: 'sms',
            customer: '+15064709876',
          },
          {
            channelType: 'email',
            customer: 'test2@serenova.com',
          },
        ],
      },
    });
    expect(selectSmsInteractionNumbers(mockedState)).toEqual([
      '+15064701234',
      '+15064709876',
    ]);
  });
});

describe('selectInteractionEmails', () => {
  it('should return the customer emails for all email interactions', () => {
    const mockedState = fromJS({
      agentDesktop: {
        interactions: [
          {
            channelType: 'email',
            customer: 'test@serenova.com',
          },
          {
            channelType: 'sms',
            customer: '+15064701234',
          },
          {
            channelType: 'sms',
            customer: '+15064709876',
          },
          {
            channelType: 'email',
            customer: 'test2@serenova.com',
          },
        ],
      },
    });
    expect(selectInteractionEmails(mockedState)).toEqual([
      'test@serenova.com',
      'test2@serenova.com',
    ]);
  });
});
