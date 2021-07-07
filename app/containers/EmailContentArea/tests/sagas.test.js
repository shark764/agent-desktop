/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import { startOutboundEmailSaga } from 'containers/EmailContentArea/sagas';

describe('startOutboundEmailSaga', () => {
  global.CxEngage = {
    interactions: {
      email: {
        startOutboundEmail: 'CxEngage.interactions.email.startOutboundEmail',
      },
    },
  };
  const mockAction = {
    customer: 'email@test.com',
    contact: {
      id: '12345-6789',
    },
    addedByNewInteractionPanel: true,
  };
  const generator = startOutboundEmailSaga(mockAction);
  it('should call the promise util with the SDK startOutboundEmailSaga and the correct arguments', () => {
    expect(generator.next()).toMatchSnapshot();
  });
  it('should use the yielded SDK results to dispatch a startOutboundInteraction action with the correct args', () => {
    expect(
      generator.next({ interactionId: 'mockId123456789' })
    ).toMatchSnapshot();
  });
  it('should use the yielded SDK results to dispatch a setInteractionStatus action with the correct args', () => {
    expect(generator.next()).toMatchSnapshot();
  });
  it('should be done', () => {
    expect(generator.next()).toMatchSnapshot();
  });
});
