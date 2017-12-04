/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import { generateUUID } from '../uuid';
import { isUUID } from '../validator';

describe('uuid', () => {
  describe('generateUUID', () => {
    it('returns a valid UUID', () => {
      expect(isUUID(generateUUID())).toEqual(true);
    });
    it('returns unique values', () => {
      // eslint-disable-next-line no-self-compare
      expect(generateUUID() === generateUUID()).toEqual(false);
    });
  });
});
