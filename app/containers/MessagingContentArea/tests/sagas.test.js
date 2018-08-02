/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import {
  initializeOutboundSmsForMessagingSaga,
  sendOutboundSms,
  copyChatTranscript,
} from 'containers/MessagingContentArea/sagas';

jest.mock('serenova-js-utils/browser', () => ({
  copyToClipboard: jest
    .fn()
    .mockReturnValueOnce(true)
    .mockReturnValueOnce(false),
}));

describe('initializeOutboundSmsForMessagingSaga', () => {
  global.CxEngage = {
    interactions: {
      messaging: {
        initializeOutboundSms:
          'CxEngage.interactions.messaging.initializeOutboundSms',
      },
    },
  };
  const mockAction = {
    interactionId: 'interactionId',
    phoneNumber: 'phoneNumber',
    message: 'message',
  };
  const generator = initializeOutboundSmsForMessagingSaga(mockAction);
  it('should dispatch a setInteractionStatus action to set to "initializing-outbound"', () => {
    expect(generator.next()).toMatchSnapshot();
  });
  it('should call the promise util with the SDK initializeOutboundSms and the correct arguments', () => {
    expect(generator.next()).toMatchSnapshot();
  });
  it('should use the yielded SDK results to dispatch an initializeOutboundSms action with the correct args', () => {
    expect(
      generator.next({ interactionId: 'newInteractionId' })
    ).toMatchSnapshot();
  });
});

describe('sendOutboundSms', () => {
  Date.now = jest.fn(() => 0); // Override so snapshots stay the same
  global.CxEngage = {
    interactions: {
      messaging: {
        sendOutboundSms: 'CxEngage.interactions.messaging.sendOutboundSms',
      },
    },
  };
  const mockAction = {
    interactionId: 'interactionId',
    message: 'message',
  };
  const generator = sendOutboundSms(mockAction);
  it('should call the promise util with the SDK sendOutboundSms and the correct arguments', () => {
    expect(generator.next()).toMatchSnapshot();
  });
  it('should use the yielded SDK results to dispatch a sendOutboundSms action with the correct args', () => {
    expect(generator.next()).toMatchSnapshot();
  });
});

describe('copyChatTranscript', () => {
  Date.now = jest.fn(() => 0); // Override so snapshots stay the same
  const mockAction = {
    interaction: {
      interactionId: 'interactionId',
      channelType: 'messaging',
      messageHistory: [
        {
          from: 'agentId',
          text: 'sampleText1',
          timestamp: '2018-07-31T13:40:52.292Z',
          type: 'agent',
        },
        {
          from: 'Customer',
          text: 'sampleText2',
          type: 'customer',
          timestamp: '2018-07-31T13:41:21.587Z',
        },
      ],
    },
  };
  describe('Chat Transcript is copied succesfully', () => {
    const generator = copyChatTranscript(mockAction);
    it('selects the agent', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('transcript is copied', () => {
      expect(
        generator.next({
          agentId: 'agentId',
          firstName: 'Agent',
          lastName: 'Smith',
        })
      ).toMatchSnapshot();
    });
    it('wait five seconds to change state', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('state is change to not copied', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('is done', () => {
      expect(generator.next().done).toBe(true);
    });
  });

  describe("Chat Transcript isn't copied", () => {
    const generator = copyChatTranscript(mockAction);
    it('selects the agent', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('transcript fails to be copied', () => {
      expect(
        generator.next({
          agentId: 'agentId',
          firstName: 'Agent',
          lastName: 'Smith',
        })
      ).toMatchSnapshot();
    });
    it('is done', () => {
      expect(generator.next().done).toBe(true);
    });
  });
});
