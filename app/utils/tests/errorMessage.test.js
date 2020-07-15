import { generateErrorMessage } from '../errorMessage';

describe('generateErrorMessage', () => {
  const formatMessage = (x, y) => {
    if (y === undefined) {
      return x.defaultMessage;
    } else {
      const v = Object.keys(y)[0];
      return x.defaultMessage.replace(`{${v}}`, y[v]);
    }
  };
  it('with an error object that has interactionFatal, returns the interactionFailed message', () => {
    expect(
      generateErrorMessage(
        {
          interactionFatal: true,
        },
        formatMessage
      )
    ).toMatchSnapshot();
  });
  it('with an error object that has a code that exists on errorMessages, it should return the errorMessage related to that code and its code', () => {
    expect(
      generateErrorMessage(
        {
          code: 'AD-1000',
        },
        formatMessage
      )
    ).toMatchSnapshot();
  });
  it('with an error object that only has the message property, it should return the message property of the error object (FOR SDK errors)', () => {
    expect(
      generateErrorMessage({
        message: 'This is an error',
      })
    ).toMatchSnapshot();
  });
  it('when the error object has neither a interactionFatal, code or message property, should return a defautl message error', () => {
    expect(
      generateErrorMessage({
        mockAttribute: 'mock-value',
      })
    ).toMatchSnapshot();
  });
  it('when the error object has a code, and a data obejct with errorDescription property, it should return an error message with the message related to the code, the code itself and the error description', () => {
    expect(
      generateErrorMessage(
        {
          code: 'AD-1000',
          data: {
            errorDescription: 'This is a description of the error',
          },
        },
        formatMessage
      )
    ).toMatchSnapshot();
  });
});
