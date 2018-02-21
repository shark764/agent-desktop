/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import { timeSince } from '../time';

describe('time', () => {
  describe('timeSince', () => {
    Date.now = jest.fn(() => 0);
    describe('falsey input', () => {
      const time = null;
      it('returns 0s', () => {
        expect(timeSince(time)).toEqual('0s');
      });
    });
    describe('time after now', () => {
      const time = 10000;
      it('returns 0s', () => {
        expect(timeSince(time)).toEqual('0s');
      });
    });
    describe('time difference less than 60 seconds', () => {
      const time = -59000;
      it('returns time formatted in seconds', () => {
        expect(timeSince(time)).toEqual('59s');
      });
    });
    describe('time difference greater than 60 seconds', () => {
      const time = -61000;
      it('returns time formatted in minutes', () => {
        expect(timeSince(time)).toEqual('1m');
      });
    });
    describe('time difference less than 60 minutes', () => {
      const time = -3540000;
      it('returns time formatted in minutes', () => {
        expect(timeSince(time)).toEqual('59m');
      });
    });
    describe('time difference greater than 60 minutes', () => {
      const time = -3800000;
      it('returns time formatted in hours and minutes', () => {
        expect(timeSince(time)).toEqual('1h 3m');
      });
    });
  });
});
