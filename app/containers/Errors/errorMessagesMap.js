import messages from './messages';

const errorMessagesMap = {
  2001: messages.failedToGetUserConfig,
  2004: messages.failedToChangeState,
  2005: messages.invalidExtension,
  2006: messages.failedToUpdateExtension,
  2007: messages.invalidReasonInfo,
};

export default errorMessagesMap;
