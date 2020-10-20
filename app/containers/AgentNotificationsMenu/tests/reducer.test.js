/*
 * Copyright © 2015-2020 Serenova, LLC. All rights reserved.
 */

import AgentNotificationsSlice from '../reducer';
const { actions, reducer } = AgentNotificationsSlice;

const mockState = {
  audioNotifications: true,
  visualNotifications: true,
};

describe('reducer', () => {
  it('sets the correct initial state', () => {
    expect(reducer(undefined, {})).toMatchSnapshot();
  });

  describe('notificationPreferences/setAvailableOutputDevices', () => {
    it('sets the audio preference', () => {
      expect(
        reducer(
          mockState,
          actions.setAudioNotificationsPreference('mock audio preference')
        )
      ).toMatchSnapshot();
    });
  });

  describe('notificationPreferences/setActiveOutputRingtoneDevice', () => {
    it('sets the visual preference', () => {
      expect(
        reducer(
          mockState,
          actions.setVisualNotificationsPreference('mock visual preference')
        )
      ).toMatchSnapshot();
    });
  });
});
