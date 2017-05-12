import Message from '../Message';

describe('Message', () => {
  describe('constructor', () => {
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
        new Message({ // eslint-disable-line no-new
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
    it('should error when "from" is not passed in', () => {
      let error;
      try {
        new Message({ // eslint-disable-line no-new
          type: 'type',
          // from: 'from',
          text: 'text',
          timestamp: 'timestamp',
          unread: false,
        });
      } catch (e) {
        error = e;
      }
      expect(error.message).toEqual('from is required');
    });
    it('should error when "text" is not passed in', () => {
      let error;
      try {
        new Message({ // eslint-disable-line no-new
          type: 'type',
          from: 'from',
          // text: 'text',
          timestamp: 'timestamp',
          unread: false,
        });
      } catch (e) {
        error = e;
      }
      expect(error.message).toEqual('text is required');
    });
    it('should error when "timestamp" is not passed in', () => {
      let error;
      try {
        new Message({ // eslint-disable-line no-new
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
        new Message({ // eslint-disable-line no-new
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
