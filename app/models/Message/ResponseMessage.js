/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import Message from './Message';

export default class ResponseMessage extends Message {
  constructor({ id, metadata, from, type, body, timestamp }) {
    const text = body ? body.text : undefined;
    let messageType;
    let messageFrom;

    if (metadata && metadata.type === 'agent') {
      messageType = 'agent';
      messageFrom = from;
    } else if (metadata && metadata.type == null) {
      /* CXV1-20378 We are getting messages coming from system (send SMS action) that are missing values in metadata
      with this solution we avoid throwing error because of null/undefined values */

      messageType = 'system';
      messageFrom = 'system';
    } else {
      messageType = metadata != null ? metadata.type : type;
      messageFrom =
        metadata != null && metadata.name != null ? metadata.name : from;
    }
    super({ id, type: messageType, from: messageFrom, text, timestamp });
  }
}
