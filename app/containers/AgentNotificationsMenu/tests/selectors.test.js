/*
 * Copyright © 2015-2018 Serenova, LLC. All rights reserved.
 */

import { fromJS } from 'immutable';
import { selectAudioPreferences, selectVisualPreferences } from '../selectors';

describe('selectAudioPreferences', () => {
  it('gets the value from state', () => {
    const initialState = fromJS({
      notificationPreferences: {
        audioNotifications: 'mock audio notification preference',
      },
    });
    expect(selectAudioPreferences(initialState)).toEqual(
      'mock audio notification preference'
    );
  });
});

describe('selectVisualPreferences', () => {
  afterAll(() => {
    delete global.Notification;
  });
  describe('Notification.permission is not granted', () => {
    beforeEach(() => {
      global.Notification = {
        permission: 'denied',
      };
    });
    const initialState = fromJS({
      notificationPreferences: {
        visualNotifications: 'mock visual notification preference',
      },
    });
    it('returns false', () => {
      expect(selectVisualPreferences(initialState)).toBe(false);
    });
  });
  describe('Notification.permission is granted', () => {
    beforeEach(() => {
      global.Notification = {
        permission: 'granted',
      };
    });
    const initialState = fromJS({
      notificationPreferences: {
        visualNotifications: 'mock visual notification preference',
      },
    });
    it('gets the value from state', () => {
      expect(selectVisualPreferences(initialState)).toEqual(
        'mock visual notification preference'
      );
    });
  });
});
