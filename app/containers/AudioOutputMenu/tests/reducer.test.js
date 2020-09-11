/*
 * Copyright © 2015-2020 Serenova, LLC. All rights reserved.
 */

import AudioOutputSlice from '../reducer';
const { actions, reducer } = AudioOutputSlice;

const mockState = {
  availableOutputDevices: [],
  activeOutputRingtoneDevices: ['default'],
  activeOutputSpeakerDevices: ['default'],
  activeOutputNotificationDevices: ['default'],
  isOutputSelectionSupported: false,
};

const availableOutputDevices = [
  { deviceId: 'default', label: 'Default' },
  {
    deviceId:
      'aead4bb457d9b0aeeddb669d8e6fef68d9cf2379d25264d6948af1dbdea3259b',
    label: 'Built-in Audio Analog Stereo',
  },
  {
    deviceId:
      '6d4096a33f2ba164d976a9929c3936b2956644e0581085c8870c4272782db9fb',
    label: 'Plantronics C320 Analog Stereo',
  },
  {
    deviceId:
      '807fbf9ab5fd57290d125721e10edaab372b2c52569513de20934e0a14971957',
    label: 'USG PnIXAu20o  Analog Stereo',
  },
];
const activeOutputRingtoneDevices = [
  {
    deviceId:
      '6d4096a33f2ba164d976a9929c3936b2956644e0581085c8870c4272782db9fb',
    label: 'Plantronics C320 Analog Stereo',
  },
];
const activeOutputSpeakerDevices = [
  {
    id: '807fbf9ab5fd57290d125721e10edaab372b2c52569513de20934e0a14971957',
    label: 'USG PnIXAu20o  Analog Stereo',
  },
];

describe('reducer', () => {
  it('sets the correct initial state', () => {
    expect(reducer(mockState, {})).toMatchSnapshot();
  });

  describe('audioOutputPreferences/setAvailableOutputDevices', () => {
    it('sets new available output devices', () => {
      expect(
        reducer(
          mockState,
          actions.setAvailableOutputDevices(availableOutputDevices)
        )
      ).toMatchSnapshot();
    });
  });

  describe('audioOutputPreferences/setActiveOutputRingtoneDevices', () => {
    it('sets new active ringtone devices', () => {
      expect(
        reducer(
          mockState,
          actions.setActiveOutputRingtoneDevices(activeOutputRingtoneDevices)
        )
      ).toMatchSnapshot();
    });
  });

  describe('audioOutputPreferences/setActiveOutputSpeakerDevices', () => {
    it('sets new active speaker devices', () => {
      expect(
        reducer(
          mockState,
          actions.setActiveOutputSpeakerDevices(activeOutputSpeakerDevices)
        )
      ).toMatchSnapshot();
    });
  });

  describe('audioOutputPreferences/setActiveOutputNotificationDevices', () => {
    it('sets new active notification device', () => {
      expect(
        reducer(
          mockState,
          actions.setActiveOutputNotificationDevices([
            '807fbf9ab5fd57290d125721e10edaab372b2c52569513de20934e0a14971957',
          ])
        )
      ).toMatchSnapshot();
    });
  });

  describe('audioOutputPreferences/setOutputSelectionSupported', () => {
    it('sets bool value to support feature control variable ', () => {
      expect(
        reducer(mockState, actions.setOutputSelectionSupported(true))
      ).toMatchSnapshot();
    });
  });
});
