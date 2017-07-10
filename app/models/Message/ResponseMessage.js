/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import Message from './Message';

export default class ResponseMessage extends Message {
  constructor(
    { to, metadata, from, type, body, timestamp },
    selectedInteractionId,
    agentId
  ) {
    if (to == null) {
      throw new Error('to is required');
    }
    const text = body ? body.text : undefined;
    const unread =
      selectedInteractionId !== undefined && to !== selectedInteractionId;
    let messageType;
    let messageFrom;
    // Doing this check because agent messages from the message history do not have the agent meta data
    if (from && agentId && from === agentId) {
      messageType = 'agent';
      messageFrom = 'Agent';
    } else {
      messageType = metadata != null ? metadata.type : type;
      messageFrom =
        metadata != null && metadata.name != null ? metadata.name : from;
    }
    super({ type: messageType, from: messageFrom, text, timestamp, unread });
  }
}
