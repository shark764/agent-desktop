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
      },
    });
    expect(selectAwaitingDisposition(mockedState)).toEqual(true);
  });
});
