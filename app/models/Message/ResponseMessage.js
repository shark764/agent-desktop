/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import Message from './Message';

export default class ResponseMessage extends Message {
  constructor(
    { id, metadata, from, type, body, timestamp }
  ) {
    const text = body ? body.text : undefined;
    let messageType;
    let messageFrom;
    if (metadata && metadata.type === 'agent') {
      messageType = 'agent';
      messageFrom = from;
    } else {
      messageType = metadata != null ? metadata.type : type;
      messageFrom =
        metadata != null && metadata.name != null ? metadata.name : from;
    }
    super({ id, type: messageType, from: messageFrom, text, timestamp });
  }
}
