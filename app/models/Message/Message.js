/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import Immutable from 'immutable';

export default class Message extends Immutable.Record({
  type: '',
  from: '',
  text: '',
  timestamp: new Date().toISOString(),
}) {
  constructor({ type, from, text, timestamp }) {
    let messageFrom;
    let messageText;
    if (type == null) {
      throw new Error('type is required');
    }
    if (from == null) {
      messageFrom = '';
      console.warn('from was not found', {
        type,
        from,
        text,
        timestamp,
      });
    } else {
      messageFrom = from;
    }
    if (text == null) {
      messageText = '';
      console.warn('text was not found', {
        type,
        from,
        text,
        timestamp,
      });
    } else {
      messageText = text;
    }
    if (timestamp == null) {
      throw new Error('timestamp is required');
    }
    super({ type, from: messageFrom, text: messageText, timestamp });
  }
}
