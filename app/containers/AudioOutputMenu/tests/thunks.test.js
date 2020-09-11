import { Map } from 'immutable';
import {
  updateActiveOutputRingtoneDevice,
  updateActiveOutputSpeakerDevice,
  updateActiveOutputNotificationDevice,
  updateActiveOutputNotificationDevices,
} from '../thunks';

import { setActiveOutputNotificationDevices } from '../reducer';

import {
  getActiveOutputNotificationDevices,
  getAvailableOutputDevices,
} from '../selectors';

describe('updateActiveOutputRingtoneDevice', () => {
  beforeEach(() => {
    global.CxEngage = {
      twilio: {
        setActiveOutputRingtoneDevices: jest.fn(),
      },
    };
  });
  it('dispatches action to set new active ringtone device', async () => {
    const dispatch = jest.fn();
    await updateActiveOutputRingtoneDevice(
      '6d4096a33f2ba164d976a9929c3936b2956644e0581085c8870c4272782db9fb'
    )(dispatch);

    expect(CxEngage.twilio.setActiveOutputRingtoneDevices).toBeCalledWith({
      deviceIds:
        '6d4096a33f2ba164d976a9929c3936b2956644e0581085c8870c4272782db9fb',
    });
  });
});

describe('updateActiveOutputSpeakerDevice', () => {
  beforeEach(() => {
    global.CxEngage = {
      twilio: {
        setActiveOutputSpeakerDevices: jest.fn(),
      },
    };
  });
  it('dispatches action to set new active speaker device', async () => {
    const dispatch = jest.fn();
    await updateActiveOutputSpeakerDevice(
      'aead4bb457d9b0aeeddb669d8e6fef68d9cf2379d25264d6948af1dbdea3259b'
    )(dispatch);

    expect(CxEngage.twilio.setActiveOutputSpeakerDevices).toBeCalledWith({
      deviceIds:
        'aead4bb457d9b0aeeddb669d8e6fef68d9cf2379d25264d6948af1dbdea3259b',
    });
  });
});

describe('updateActiveOutputNotificationDevice', () => {
  it('dispatches action to set new active notification device', async () => {
    const dispatch = jest.fn();
    await updateActiveOutputNotificationDevice(
      '6d4096a33f2ba164d976a9929c3936b2956644e0581085c8870c4272782db9fb'
    )(dispatch);
    expect(dispatch).toHaveBeenCalledWith(
      setActiveOutputNotificationDevices([
        '6d4096a33f2ba164d976a9929c3936b2956644e0581085c8870c4272782db9fb',
      ])
    );
  });
});

jest.mock('../selectors');
getActiveOutputNotificationDevices.mockImplementation(() => [
  '807fbf9ab5fd57290d125721e10edaab372b2c52569513de20934e0a14971957',
]);
getAvailableOutputDevices.mockImplementation(() => [
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

describe('updateActiveOutputNotificationDevices', () => {
  it('dispatches a notification devices update', async () => {
    const dispatch = jest.fn().mockImplementation();
    const getState = () =>
      new Map({
        audioOutputPreferences: {
          availableOutputDevices: [
            { id: 'default', label: 'Default' },
            {
              id:
                'aead4bb457d9b0aeeddb669d8e6fef68d9cf2379d25264d6948af1dbdea3259b',
              label: 'Built-in Audio Analog Stereo',
            },
            {
              id:
                '6d4096a33f2ba164d976a9929c3936b2956644e0581085c8870c4272782db9fb',
              label: 'Plantronics C320 Analog Stereo',
            },
            {
              id:
                '807fbf9ab5fd57290d125721e10edaab372b2c52569513de20934e0a14971957',
              label: 'USG PnIXAu20o  Analog Stereo',
            },
          ],
          activeOutputRingtoneDevices: [
            'default',
            'aead4bb457d9b0aeeddb669d8e6fef68d9cf2379d25264d6948af1dbdea3259b',
            '807fbf9ab5fd57290d125721e10edaab372b2c52569513de20934e0a14971957',
          ],
          activeOutputSpeakerDevices: [
            'aead4bb457d9b0aeeddb669d8e6fef68d9cf2379d25264d6948af1dbdea3259b',
            '6d4096a33f2ba164d976a9929c3936b2956644e0581085c8870c4272782db9fb',
          ],
          activeOutputNotificationDevices: [
            '807fbf9ab5fd57290d125721e10edaab372b2c52569513de20934e0a14971957',
          ],
          isOutputSelectionSupported: true,
        },
      });

    const callback = updateActiveOutputNotificationDevices();
    expect(typeof callback).toBe('function');

    callback.call(this, dispatch, getState);
    expect(dispatch.mock.calls[0]).toEqual([
      {
        type: 'audioOutputPreferences/setActiveOutputNotificationDevices',
        payload: [
          '807fbf9ab5fd57290d125721e10edaab372b2c52569513de20934e0a14971957',
        ],
      },
    ]);
    expect(dispatch).toHaveBeenCalledWith(
      setActiveOutputNotificationDevices([
        '807fbf9ab5fd57290d125721e10edaab372b2c52569513de20934e0a14971957',
      ])
    );
  });
});
