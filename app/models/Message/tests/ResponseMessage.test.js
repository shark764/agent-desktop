/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import ResponseMessage from '../ResponseMessage';

describe('ResponseMessage', () => {
  describe('constructor', () => {
    it('should construct properly with minimum params', () => {
      const message = new ResponseMessage({
        id: 'id',
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
        id: 'id',
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
    it('should construct with "agent" type and from when metadata.type is "agent"', () => {
      const message = new ResponseMessage({
        id: 'id',
        type: 'message',
        from: 'userId',
        body: {
          text: 'text',
        },
        timestamp: 'timestamp',
        metadata: {
          type: 'agent',
          name: 'Agent',
        },
      });
      expect(message).toMatchSnapshot();
    });
  });
});
