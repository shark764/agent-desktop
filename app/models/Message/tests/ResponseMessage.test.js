import ResponseMessage from '../ResponseMessage';

describe('ResponseMessage', () => {
  describe('constructor', () => {
    it('should construct properly with minimum params', () => {
      const message = new ResponseMessage({
        to: 'interaction-id',
        type: 'type',
        from: 'from',
        body: {
          text: 'text',
        },
        timestamp: 'timestamp',
      });
      expect(message).toMatchSnapshot();
    });
    it('should construct properly with metadata', () => {
      const message = new ResponseMessage({
        to: 'interaction-id',
        type: 'type',
        from: 'from',
        body: {
          text: 'text',
        },
        timestamp: 'timestamp',
        metadata: {
          type: 'metadata.type',
          name: 'metadata.name',
        },
      });
      expect(message).toMatchSnapshot();
    });
    it('should construct unread as true when selectedInteractionId is different', () => {
      const message = new ResponseMessage({
        to: 'interaction-id',
        type: 'type',
        from: 'from',
        body: {
          text: 'text',
        },
        timestamp: 'timestamp',
      }, 'another-interaction-id');
      expect(message).toMatchSnapshot();
    });
    it('should construct with "agent" type and "Agent" from when from is userId', () => {
      const message = new ResponseMessage({
        to: 'interaction-id',
        // type: 'type',
        from: 'userId',
        body: {
          text: 'text',
        },
        timestamp: 'timestamp',
      }, 'another-interaction-id',
      'userId');
      expect(message).toMatchSnapshot();
    });
    it('should error when "to" is not passed in', () => {
      let error;
      try {
        new ResponseMessage({ // eslint-disable-line no-new
          // to: 'interaction-id',
          type: 'type',
          from: 'from',
          body: {
            text: 'text',
          },
          timestamp: 'timestamp',
        });
      } catch (e) {
        error = e;
      }
      expect(error.message).toEqual('to is required');
    });
  });
});
