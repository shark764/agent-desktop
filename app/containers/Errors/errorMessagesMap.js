import messages from './messages';

const errorMessagesMap = {
  'cxengage/session/state-change-request-acknowledged': {
    2001: messages.failedToGetUserConfig,
    2004: messages.failedToChangeState,
    2005: messages.invalidExtension,
    2006: messages.failedToUpdateExtension,
    2007: messages.invalidReasonInfo,
    default: messages.defaultStateError,
  },
  'cxengage/interactions/email/start-outbound-email': {
    default: messages.emailFailed,
  },
  'cxengage/errors/error/failed-to-create-outbound-email-interaction': {
    default: messages.emailFailed,
  },
  'cxengage/interactions/email/send-reply': {
    default: messages.emailFailed,
  },
  default: messages.default,
};

export default errorMessagesMap;
