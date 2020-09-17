/*
 * Copyright © 2015-2020 Serenova, LLC. All rights reserved.
 */

import { Map } from 'immutable';
import { selectActiveExtension } from 'containers/AgentStatusMenu/selectors';
import {
  getAvailableOutputDevices,
  getActiveOutputRingtoneDevice,
  selectActiveOutputRingtoneDevices,
  getActiveOutputSpeakerDevice,
  selectActiveOutputSpeakerDevices,
  getActiveOutputNotificationDevice,
  selectActiveOutputNotificationDevices,
  selectOutputSelectionSupported,
  selectActiveExtensionIsTwilio,
} from '../selectors';

const mockState = new Map({
  agentDesktop: {
    activeExtension: {
      description: 'Default Twilio extension',
      provider: 'twilio',
      type: 'webrtc',
    },
  },
  audioOutputPreferences: {
    availableOutputDevices: [
      { id: 'default', label: 'Default' },
      {
        id: 'aead4bb457d9b0aeeddb669d8e6fef68d9cf2379d25264d6948af1dbdea3259b',
        label: 'Built-in Audio Analog Stereo',
      },
      {
        id: '6d4096a33f2ba164d976a9929c3936b2956644e0581085c8870c4272782db9fb',
        label: 'Plantronics C320 Analog Stereo',
      },
      {
        id: '807fbf9ab5fd57290d125721e10edaab372b2c52569513de20934e0a14971957',
        label: 'USG PnIXAu20o  Analog Stereo',
      },
    ],
    activeOutputRingtoneDevice: 'default',
    activeOutputSpeakerDevice: '6d4096a33f2ba164d976a9929c3936b2956644e0581085c8870c4272782db9fb',
    activeOutputNotificationDevice: '807fbf9ab5fd57290d125721e10edaab372b2c52569513de20934e0a14971957',
    isOutputSelectionSupported: true,
  },
});

describe('getAvailableOutputDevices', () => {
  it('Should return an array with current available devices', () => {
    expect(getAvailableOutputDevices(mockState)).toEqual([
      { id: 'default', label: 'Default' },
      {
        id: 'aead4bb457d9b0aeeddb669d8e6fef68d9cf2379d25264d6948af1dbdea3259b',
        label: 'Built-in Audio Analog Stereo',
      },
      {
        id: '6d4096a33f2ba164d976a9929c3936b2956644e0581085c8870c4272782db9fb',
        label: 'Plantronics C320 Analog Stereo',
      },
      {
        id: '807fbf9ab5fd57290d125721e10edaab372b2c52569513de20934e0a14971957',
        label: 'USG PnIXAu20o  Analog Stereo',
      },
    ]);
  });
});

describe('getActiveOutputRingtoneDevices', () => {
  it('Should return an array with active ringtone device ids', () => {
    expect(getActiveOutputRingtoneDevice(mockState)).toEqual('default');
  });
});

describe('selectActiveOutputRingtoneDevices', () => {
  it('Should return an array with current active ringtone devices', () => {
    expect(selectActiveOutputRingtoneDevices(mockState)).toEqual([
      { id: 'default', label: 'Default', isActive: true },
      {
        id: 'aead4bb457d9b0aeeddb669d8e6fef68d9cf2379d25264d6948af1dbdea3259b',
        label: 'Built-in Audio Analog Stereo',
        isActive: false,
      },
      {
        id: '6d4096a33f2ba164d976a9929c3936b2956644e0581085c8870c4272782db9fb',
        label: 'Plantronics C320 Analog Stereo',
        isActive: false,
      },
      {
        id: '807fbf9ab5fd57290d125721e10edaab372b2c52569513de20934e0a14971957',
        label: 'USG PnIXAu20o  Analog Stereo',
        isActive: false,
      },
    ]);
  });
});

describe('getActiveOutputSpeakerDevices', () => {
  it('Should return an array with active speaker device ids', () => {
    expect(getActiveOutputSpeakerDevice(mockState)).toEqual('6d4096a33f2ba164d976a9929c3936b2956644e0581085c8870c4272782db9fb');
  });
});

describe('selectActiveOutputSpeakerDevices', () => {
  it('Should return an array with current active speaker devices', () => {
    expect(selectActiveOutputSpeakerDevices(mockState)).toEqual([
      { id: 'default', label: 'Default', isActive: false },
      {
        id: 'aead4bb457d9b0aeeddb669d8e6fef68d9cf2379d25264d6948af1dbdea3259b',
        label: 'Built-in Audio Analog Stereo',
        isActive: false,
      },
      {
        id: '6d4096a33f2ba164d976a9929c3936b2956644e0581085c8870c4272782db9fb',
        label: 'Plantronics C320 Analog Stereo',
        isActive: true,
      },
      {
        id: '807fbf9ab5fd57290d125721e10edaab372b2c52569513de20934e0a14971957',
        label: 'USG PnIXAu20o  Analog Stereo',
        isActive: false,
      },
    ]);
  });
});

describe('getActiveOutputNotificationDevices', () => {
  it('Should return an array with active notification device ids', () => {
    expect(getActiveOutputNotificationDevice(mockState)).toEqual('807fbf9ab5fd57290d125721e10edaab372b2c52569513de20934e0a14971957');
  });
});

describe('selectActiveOutputNotificationDevices', () => {
  it('Should return an array with current active speaker devices', () => {
    expect(selectActiveOutputNotificationDevices(mockState)).toEqual([
      { id: 'default', label: 'Default', isActive: false },
      {
        id: 'aead4bb457d9b0aeeddb669d8e6fef68d9cf2379d25264d6948af1dbdea3259b',
        label: 'Built-in Audio Analog Stereo',
        isActive: false,
      },
      {
        id: '6d4096a33f2ba164d976a9929c3936b2956644e0581085c8870c4272782db9fb',
        label: 'Plantronics C320 Analog Stereo',
        isActive: false,
      },
      {
        id: '807fbf9ab5fd57290d125721e10edaab372b2c52569513de20934e0a14971957',
        label: 'USG PnIXAu20o  Analog Stereo',
        isActive: true,
      },
    ]);
  });
});

describe('selectOutputSelectionSupported', () => {
  it('Should return whether output selection is supported or not', () => {
    expect(selectOutputSelectionSupported(mockState)).toBe(true);
  });
});

jest.mock('containers/AgentStatusMenu/selectors');
selectActiveExtension.mockImplementation(() => ({
  description: 'Default Twilio extension',
  provider: 'twilio',
  type: 'webrtc',
}));

describe('selectActiveExtensionIsTwilio', () => {
  it('Should return true when active extension is twilio', () => {
    expect(selectActiveExtensionIsTwilio(mockState)).toBe(true);
  });

  it('Should return false when active extension is not twilio', () => {
    selectActiveExtension.mockImplementationOnce(() => ({
      description: 'PSTN Test Extension',
      type: 'pstn',
    }));
    expect(
      selectActiveExtensionIsTwilio(
        mockState.set(
          'agentDesktop',
          new Map({
            activeExtension: {
              description: 'PSTN Test Extension',
              type: 'pstn',
            },
          })
        )
      )
    ).toBe(false);
  });
});
