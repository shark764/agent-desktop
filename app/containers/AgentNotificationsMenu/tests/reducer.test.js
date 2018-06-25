/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import reducer from '../reducer';
import * as actions from '../actions';

describe('reducer', () => {
  it('sets the correct initial state', () => {
    expect(reducer(undefined, {})).toMatchSnapshot();
  });

  describe('SET_AUDIO_NOTIFICATIONS_PREFERENCE', () => {
    it('sets the audio preference', () => {
      expect(
        reducer(
          undefined,
          actions.setAudioNotificationsPreference('mock audio preference')
        )
      ).toMatchSnapshot();
    });
  });

  describe('SET_VISUAL_NOTIFICATIONS_PREFERENCE', () => {
    it('sets the visual preference', () => {
      expect(
        reducer(
          undefined,
          actions.setVisualNotificationsPreference('mock visual preference')
        )
      ).toMatchSnapshot();
    });
  });
});
