import errorMessages from 'containers/Errors/messages';

export const generateErrorMessage = (errorObject, formatMessage) => {
  let errorDescriptionMessage;
  const { code, interactionFatal } = errorObject;
  if (interactionFatal) {
    errorDescriptionMessage = formatMessage(errorMessages.interactionFailed);
  } else if (code && errorMessages[code]) {
    // Specific error message is found for this code
    errorDescriptionMessage = formatMessage(errorMessages[code]);
  } else if (errorObject.message) {
    // Fallback to message provided by error (for SDK errors)
    errorDescriptionMessage = errorObject.message;
  } else {
    // Use default for other errors (probably made by us)
    errorDescriptionMessage = errorMessages.default;
  }
  if (code) {
    errorDescriptionMessage += formatMessage(errorMessages.code, { code });
  }
  if (errorObject.data && errorObject.data.errorDescription) {
    errorDescriptionMessage += formatMessage(errorMessages.errorDescription, {
      errorDescription: errorObject.data.errorDescription,
    });
  }
  return errorDescriptionMessage;
};
