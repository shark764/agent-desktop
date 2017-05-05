import Immutable from 'immutable';

export default class Message extends Immutable.Record({
  type: '',
  from: '',
  text: '',
  timestamp: (new Date()).toISOString(),
  unread: false,
}) {
  constructor({ type, from, text, timestamp, unread }) {
    if (type == null) {
      throw new Error('type is required');
    }
    if (from == null) {
      throw new Error('from is required');
    }
    if (text == null) {
      throw new Error('text is required');
    }
    if (timestamp == null) {
      throw new Error('timestamp is required');
    }
    if (unread == null) {
      throw new Error('unread is required');
    }
    super({ type, from, text, timestamp, unread });
  }
}
