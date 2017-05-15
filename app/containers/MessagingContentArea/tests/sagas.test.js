import {
  initializeOutboundSmsSaga,
  sendOutboundSms,
} from 'containers/MessagingContentArea/sagas';

describe('initializeOutboundSmsSaga', () => {
  global.CxEngage = {
    interactions: {
      messaging: {
        initializeOutboundSms: 'CxEngage.interactions.messaging.initializeOutboundSms',
      },
    },
  };
  const mockAction = {
    interactionId: 'interactionId',
    phoneNumber: 'phoneNumber',
    message: 'message',
  };
  const generator = initializeOutboundSmsSaga(mockAction);
  it('should dispatch a setInteractionStatus action to set to "initializing-outbound"', () => {
    expect(generator.next()).toMatchSnapshot();
  });
  it('should call the promise util with the SDK initializeOutboundSms and the correct arguments', () => {
    expect(generator.next()).toMatchSnapshot();
  });
  it('should use the yielded SDK results to dispatch an initializeOutboundSms action with the correct args', () => {
    expect(generator.next({ interactionId: 'newInteractionId' })).toMatchSnapshot();
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
