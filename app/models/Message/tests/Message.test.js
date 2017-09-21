/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import Message from '../Message';

describe('Message', () => {
  describe('constructor', () => {
    beforeAll(() => {
      global.console = { warn: jest.fn() };
    });
    it('should construct properly', () => {
      const message = new Message({
        type: 'type',
        from: 'from',
        text: 'text',
        timestamp: 'timestamp',
        unread: false,
      });
      expect(message).toMatchSnapshot();
    });
    it('should error when "type" is not passed in', () => {
      let error;
      try {
        // eslint-disable-next-line no-new
        new Message({
          // type: 'type',
          from: 'from',
          text: 'text',
          timestamp: 'timestamp',
          unread: false,
        });
      } catch (e) {
        error = e;
      }
      expect(error.message).toEqual('type is required');
    });
    it('should set "from" to empty string when "from" is not passed in', () => {
      const message = new Message({
        // eslint-disable-line no-new
        type: 'type',
        // from: 'from',
        text: 'text',
        timestamp: 'timestamp',
        unread: false,
      });
      expect(message).toMatchSnapshot();
    });
    it('should set "text" to empty when "text" is not passed in', () => {
      // eslint-disable-next-line no-new
      const message = new Message({
        type: 'type',
        from: 'from',
        // text: 'text',
        timestamp: 'timestamp',
        unread: false,
      });
      expect(message).toMatchSnapshot();
    });
    it('should error when "timestamp" is not passed in', () => {
      let error;
      try {
        // eslint-disable-next-line no-new
        new Message({
          type: 'type',
          from: 'from',
          text: 'text',
          // timestamp: 'timestamp',
          unread: false,
        });
      } catch (e) {
        error = e;
      }
      expect(error.message).toEqual('timestamp is required');
    });
    it('should error when "unread" is not passed in', () => {
      let error;
      try {
        // eslint-disable-next-line no-new
        new Message({
          type: 'type',
          from: 'from',
          text: 'text',
          timestamp: 'timestamp',
          // unread: false,
        });
      } catch (e) {
        error = e;
      }
      expect(error.message).toEqual('unread is required');
    });
  });
});
