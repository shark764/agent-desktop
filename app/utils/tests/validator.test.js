/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import {
  isPossibleNumber,
  isValidNumber,
  isValidEmail,
  isUUID,
} from '../validator';

describe('validator', () => {
  describe('isValidNumber', () => {
    it('returns true for valid E164 numbers', () => {
      expect(isValidNumber('+15064701234')).toEqual(true);
    });
    it('returns false for invalid E164 numbers', () => {
      expect(isValidNumber('15064701234')).toEqual(false);
    });
  });
  describe('isPossibleNumber', () => {
    it('returns true for valid E164 numbers', () => {
      expect(isPossibleNumber('+15064701234')).toEqual(true);
    });
    it('returns false for invalid E164 numbers', () => {
      expect(isPossibleNumber('15064701234')).toEqual(false);
    });
  });
  describe('isValidEmail', () => {
    it('returns true for valid emails', () => {
      expect(isValidEmail('test@serenova.com')).toEqual(true);
    });
    it('returns false for invalid emails', () => {
      expect(isValidEmail('@serenova.com')).toEqual(false);
    });
  });
  describe('isUUID', () => {
    it('returns true for valid uuids', () => {
      expect(isUUID('9b3e4ddf-bb30-4ee3-912c-dfa7ab0fb7b1')).toEqual(true);
    });
    it('returns false for invalid uuids', () => {
      expect(isUUID('9b3e4ddf-bb30-4ee3-912c-dfa7ab0fb7b11')).toEqual(false);
    });
    it('returns false for undefined as a string', () => {
      expect(isUUID('undefined')).toEqual(false);
    });
    it('returns false for undefined as a value', () => {
      expect(isUUID(undefined)).toEqual(false);
    });
    it('returns false for null as a value', () => {
      expect(isUUID(null)).toEqual(false);
    });
  });
});
