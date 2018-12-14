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
  selectNextInteraction,
  selectPreviousInteraction,
  selectHasUnrespondedInteractions,
  areInteractionsInWrapup,
  selectQueues,
  selectExpandWindowForCrm,
} from '../selectors';

describe('areInteractionsInWrapup ', () => {
  it('should return true if any interaction is in wrapup', () => {
    const mockedState = fromJS({
      agentDesktop: {
        interactions: [
          {
            status: 'wrapup',
          },
          {
            status: 'not wrapup',
          },
        ],
      },
    });
    expect(areInteractionsInWrapup(mockedState)).toEqual(true);
  });

  it('should return false if no interactions are in wrapup', () => {
    const mockedState = fromJS({
      agentDesktop: {
        interactions: [
          {
            status: 'not wrapup',
          },
          {
            status: 'not wrapup',
          },
        ],
      },
    });
    expect(areInteractionsInWrapup(mockedState)).toEqual(false);
  });
});

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
        currentCrmItemHistoryPanel: {},
      },
    });
    expect(selectAwaitingDisposition(mockedState)).toEqual(true);
  });
});

describe('select next and previous interactions', () => {
  const mockInteractions = [
    { channelType: 'sms', interactionId: 'a' },
    { channelType: 'voice', interactionId: 'b' },
    { channelType: 'sms', interactionId: 'c' },
    { channelType: 'sms', interactionId: 'd' },
  ];

  it('should return the next interaction id', () => {
    const mockedState = fromJS({
      agentDesktop: {
        interactions: mockInteractions,
        selectedInteractionId: 'c',
      },
    });
    expect(selectNextInteraction(mockedState)).toEqual('d');
  });

  it('should return the previous interaction id', () => {
    const mockedState = fromJS({
      agentDesktop: {
        interactions: mockInteractions,
        selectedInteractionId: 'd',
      },
    });
    expect(selectPreviousInteraction(mockedState)).toEqual('c');
  });

  it('should correctly move the voice interaction to the start of the array', () => {
    const mockedState = fromJS({
      agentDesktop: {
        interactions: mockInteractions,
        selectedInteractionId: 'c',
      },
    });
    expect(selectPreviousInteraction(mockedState)).toEqual('a');
  });
});

describe('selectHasUnrespondedInteractions', () => {
  const mockInteractions = [
    {
      channelType: 'sms',
      interactionId: 'a',
      messageHistory: [{ type: 'agent' }],
    },
    { channelType: 'voice', interactionId: 'b' },
    {
      channelType: 'sms',
      interactionId: 'c',
      messageHistory: [{ type: 'agent' }],
    },
  ];

  it('should return true if any interaction has an unresponded message', () => {
    mockInteractions.push({
      channelType: 'sms',
      interactionId: 'd',
      messageHistory: [{ type: 'customer' }],
    });
    const mockedState = fromJS({
      agentDesktop: {
        interactions: mockInteractions,
      },
    });
    expect(selectHasUnrespondedInteractions(mockedState)).toEqual(true);
  });

  it('should return false if all interactions are responded to', () => {
    mockInteractions.splice(mockInteractions.length - 1, 1);
    mockInteractions.push({
      channelType: 'sms',
      interactionId: 'd',
      messageHistory: [{ type: 'agent' }],
    });
    const mockedState = fromJS({
      agentDesktop: {
        interactions: mockInteractions,
      },
    });
    expect(selectHasUnrespondedInteractions(mockedState)).toEqual(false);
  });
  it('should ignore all email , work-items, and voice interactions and return true or false on chat/messages only', () => {
    mockInteractions.push({ channelType: 'email', interactionId: 'e' });
    mockInteractions.push({ channelType: 'work-offer', interactionId: 'f' });
    const mockedState = fromJS({
      agentDesktop: {
        interactions: mockInteractions,
      },
    });
    expect(selectHasUnrespondedInteractions(mockedState)).toEqual(false);
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
          {
            channelType: 'sms',
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
  describe('selectQueues', () => {
    it('Queues should be arranged in alphabetical order in the transfer-list', () => {
      const queues = fromJS({
        agentDesktop: {
          queues: [
            {
              active: true,
              name: 'Zoom',
            },
            {
              active: true,
              name: 'AGENT_QUEUE',
            },
            {
              active: true,
              name: 'supervisor',
            },
            {
              active: true,
              name: '165',
            },
            {
              active: true,
              name: '56',
            },
          ],
        },
      });
      expect(selectQueues(queues)).toMatchSnapshot();
    });
  });
});
describe('selectExpandWindowForCrm', () => {
  const newInteractionPanel = {
    newInteractionFormInput: 'mock-value',
  };
  const currentCrmItemHistoryPanel = {
    currentCrmItemHistoryPanelValue: 'mock-value 2',
  };
  const noInteractionContactPanel = {
    noInteractionContactPanelValue: 'mock-value 3',
  };
  it("should return a falsy value if there's no CRM set up and there's no standalonePopUp", () => {
    const mockedState = fromJS({
      agentDesktop: {
        interactions: [
          {
            interactionId: 'a',
          },
        ],
        selectedInteractionId: 'a',
        crmModule: 'none',
        newInteractionPanel,
        currentCrmItemHistoryPanel,
        noInteractionContactPanel,
      },
    });
    expect(selectExpandWindowForCrm(mockedState)).toBeFalsy();
  });
  it("should return false if crm isn't none but side panel is collapsed for interaction", () => {
    const mockedState = fromJS({
      agentDesktop: {
        interactions: [
          {
            interactionId: 'a',
            isSidePanelCollapsed: true,
          },
        ],
        selectedInteractionId: 'a',
        crmModule: 'mock-crm',
        newInteractionPanel,
        currentCrmItemHistoryPanel,
        noInteractionContactPanel,
      },
    });
    expect(selectExpandWindowForCrm(mockedState)).toBe(false);
  });
  it("should return false if there's a crm and side panel isn't collapsed for interaction but the interaction doesn't have scripts", () => {
    const mockedState = fromJS({
      agentDesktop: {
        interactions: [
          {
            interactionId: 'a',
            isSidePanelCollapsed: false,
          },
        ],
        selectedInteractionId: 'a',
        crmModule: 'mock-crm',
        newInteractionPanel,
        currentCrmItemHistoryPanel,
        noInteractionContactPanel,
      },
    });
    expect(selectExpandWindowForCrm(mockedState)).toBe(false);
  });
  it("should return false if there's a crm, side panel isn't collapsed for interaction and the interaction has scripts but it's a voice interaction", () => {
    const mockedState = fromJS({
      agentDesktop: {
        interactions: [
          {
            interactionId: 'a',
            isSidePanelCollapsed: false,
            script: 'mock-script',
            channelType: 'voice',
          },
        ],
        selectedInteractionId: 'a',
        crmModule: 'mock-crm',
        newInteractionPanel,
        currentCrmItemHistoryPanel,
        noInteractionContactPanel,
      },
    });
    expect(selectExpandWindowForCrm(mockedState)).toBe(false);
  });
  it("should return false if there's a crm, side panel isn't collapsed for interaction, the interaction has scripts and it isn't a voice interaction but is a script only interaction", () => {
    const mockedState = fromJS({
      agentDesktop: {
        interactions: [
          {
            interactionId: 'a',
            isSidePanelCollapsed: false,
            script: 'mock-script',
            channelType: 'mesagging',
            isScriptOnly: true,
          },
        ],
        selectedInteractionId: 'a',
        crmModule: 'mock-crm',
        newInteractionPanel,
        currentCrmItemHistoryPanel,
        noInteractionContactPanel,
      },
    });
    expect(selectExpandWindowForCrm(mockedState)).toBe(false);
  });
  it("should return true if there's a crm, side panel isn't collapsed for interaction, the interaction has scripts, it isn't a voice interaction and it isn't a script only interaction either", () => {
    const mockedState = fromJS({
      agentDesktop: {
        interactions: [
          {
            interactionId: 'a',
            isSidePanelCollapsed: false,
            script: 'mock-script',
            channelType: 'mesagging',
          },
        ],
        selectedInteractionId: 'a',
        crmModule: 'mock-crm',
        newInteractionPanel,
        currentCrmItemHistoryPanel,
        noInteractionContactPanel,
      },
    });
    expect(selectExpandWindowForCrm(mockedState)).toBe(true);
  });
  it("should return false if there's a crm, side panel isn't collapsed for interaction but the interaction has no contact assigned", () => {
    const mockedState = fromJS({
      agentDesktop: {
        interactions: [
          {
            interactionId: 'a',
            isSidePanelCollapsed: false,
          },
        ],
        selectedInteractionId: 'a',
        crmModule: 'mock-crm',
        newInteractionPanel,
        currentCrmItemHistoryPanel,
        noInteractionContactPanel,
      },
    });
    expect(selectExpandWindowForCrm(mockedState)).toBe(false);
  });
  it("should return false if there's a crm, side panel isn't collapsed for interaction and the interaction has a contact assigned but the CRM isn't zendesk", () => {
    const mockedState = fromJS({
      agentDesktop: {
        interactions: [
          {
            interactionId: 'a',
            isSidePanelCollapsed: false,
            contact: 'contactId',
          },
        ],
        selectedInteractionId: 'a',
        crmModule: 'mock-crm',
        newInteractionPanel,
        currentCrmItemHistoryPanel,
        noInteractionContactPanel,
      },
    });
    expect(selectExpandWindowForCrm(mockedState)).toBe(false);
  });
  it("should return true if there's a crm, side panel isn't collapsed for interaction, the interaction has a contact assigned ant the CRM is zendesk", () => {
    const mockedState = fromJS({
      agentDesktop: {
        interactions: [
          {
            interactionId: 'a',
            isSidePanelCollapsed: false,
            contact: 'contactId',
          },
        ],
        selectedInteractionId: 'a',
        crmModule: 'zendesk',
        newInteractionPanel,
        currentCrmItemHistoryPanel,
        noInteractionContactPanel,
      },
    });
    expect(selectExpandWindowForCrm(mockedState)).toBe(true);
  });
});
