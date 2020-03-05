/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import {
  initializeOutboundSmsForMessagingSaga,
  sendOutboundSms,
  copyChatTranscript,
} from 'containers/MessagingContentArea/sagas';

import { copyToClipboard } from 'serenova-js-utils/browser';

jest.mock('serenova-js-utils/browser');
copyToClipboard
  .mockImplementation(() => ({}))
  .mockReturnValueOnce(true)
  .mockReturnValueOnce(false);

describe('initializeOutboundSmsForMessagingSaga', () => {
  beforeEach(() => {
    global.CxEngage = {
      interactions: {
        messaging: {
          initializeOutboundSms:
            'CxEngage.interactions.messaging.initializeOutboundSms',
        },
        assignContact: 'CxEngage.interactions.assignContact',
      },
    };
  });
  describe('When contactId is passed and an outbound ANI is selected', () => {
    const mockAction = {
      interactionId: 'interactionId',
      phoneNumber: 'phoneNumber',
      message: 'message',
      contactId: 'contact1',
    };
    const generator = initializeOutboundSmsForMessagingSaga(mockAction);
    it('should dispatch a setInteractionStatus action to set to "initializing-outbound"', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('should get the selected outbound identifier', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('should call the promise util with the SDK initializeOutboundSms and the correct arguments', () => {
      expect(
        generator.next({
          outboundIdentifier: '+45',
          flowId: 'hg',
          channelType: 'sms',
        })
      ).toMatchSnapshot();
    });
    it('should use the yielded SDK results to dispatch an initializeOutboundSms action with the correct args', () => {
      expect(
        generator.next({ interactionId: 'newInteractionId' })
      ).toMatchSnapshot();
    });
    it('should call the promise util with the SDK assignContact and the correct arguments', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('should dispatch setContactMode action to set to view', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('should dispacth addContactNotification action to set messageType to "assigned"', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('should be done', () => {
      expect(generator.next().done).toBe(true);
    });
  });
  describe("When contactId is passed but there's no outbound ANI selected", () => {
    const mockAction = {
      interactionId: 'interactionId',
      phoneNumber: 'phoneNumber',
      message: 'message',
      contactId: 'contact1',
    };
    const generator = initializeOutboundSmsForMessagingSaga(mockAction);
    it('should dispatch a setInteractionStatus action to set to "initializing-outbound"', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('should get the selected outbound identifier', () => {
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
    it('should call the promise util with the SDK assignContact and the correct arguments', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('should dispatch setContactMode action to set to view', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('should dispacth addContactNotification action to set messageType to "assigned"', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('should be done', () => {
      expect(generator.next().done).toBe(true);
    });
  });
  describe("if contactId is not passed but there's an outbound ANI selected", () => {
    const mockAction = {
      interactionId: 'interactionId',
      phoneNumber: 'phoneNumber',
      message: 'message',
    };
    const generator = initializeOutboundSmsForMessagingSaga(mockAction);
    it('should dispatch a setInteractionStatus action to set to "initializing-outbound"', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('should get the selected outbound identifier', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('should call the promise util with the SDK initializeOutboundSms and the correct arguments', () => {
      expect(
        generator.next({
          outboundIdentifier: '+45',
          flowId: 'hg',
          channelType: 'sms',
        })
      ).toMatchSnapshot();
    });
    it('should use the yielded SDK results to dispatch an initializeOutboundSms action with the correct args', () => {
      expect(
        generator.next({ interactionId: 'newInteractionId' })
      ).toMatchSnapshot();
    });
    it('should be done', () => {
      expect(generator.next().done).toBe(true);
    });
  });
});

describe('sendOutboundSms', () => {
  beforeEach(() => {
    global.CxEngage = {
      interactions: {
        messaging: {
          sendOutboundSms: 'CxEngage.interactions.messaging.sendOutboundSms',
        },
      },
    };
  });
  Date.now = jest.fn(() => 0); // Override so snapshots stay the same
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
  const fixedDate = new Date('2020-03-05T09:39:59'); // Override so snapshots stay the same
  let originalDate;

  beforeAll(() => {
    originalDate = Date;

    global.Date = class extends Date {
      constructor() {
        super();

        return fixedDate;
      }
    };
  });
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
        {
          from: 'agentId',
          type: 'agent',
          file: {
            mediaUrl:
              'https://homepages.cae.wisc.edu/~ece533/images/airplane.png',
          },
          timestamp: '2018-07-31T13:41:51.587Z',
        },
        {
          from: 'Customer',
          type: 'customer',
          file: {
            mediaUrl:
              'https://homepages.cae.wisc.edu/~ece533/images/frymire.png?size=200x200',
          },
          timestamp: '2018-07-31T13:41:23.587Z',
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
    it('passes in the correct transcript is generated and passed to copyToClipboard', async () => {
      expect(copyToClipboard.mock.calls).toMatchSnapshot();
    });

    afterAll(() => {
      global.Date = originalDate;
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
