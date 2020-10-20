import { selectTenant, selectAgent } from 'containers/Login/selectors';

import { getActiveOutputNotificationDevice } from '../selectors';
import * as thunks from '../thunks';
const {
  updateActiveOutputRingtoneDevice,
  updateActiveOutputRingtoneDevices,
  updateActiveOutputSpeakerDevice,
  updateActiveOutputSpeakerDevices,
  updateActiveOutputNotificationDevice,
  goUpdateAudioOutputUserPreferences,
} = thunks;

jest.mock('containers/Login/selectors');
selectTenant.mockReturnValue({ id: 'mocktenantid' });
selectAgent.mockReturnValue({ userId: 'mockagentid' });

jest.mock('../selectors');
getActiveOutputNotificationDevice.mockReturnValue('mock-device-id-1');

describe('updateActiveOutputRingtoneDevice', () => {
  beforeEach(() => {
    global.CxEngage = {
      twilio: {
        setActiveOutputRingtoneDevices: jest.fn(),
      },
    };
  });
  it('dispatches action to set new active ringtone device', () => {
    const dispatch = jest.fn();
    updateActiveOutputRingtoneDevice(
      '6d4096a33f2ba164d976a9929c3936b2956644e0581085c8870c4272782db9fb'
    )(dispatch);

    expect(CxEngage.twilio.setActiveOutputRingtoneDevices).toBeCalledWith({
      deviceIds:
        '6d4096a33f2ba164d976a9929c3936b2956644e0581085c8870c4272782db9fb',
    });
  });
});

describe('updateActiveOutputRingtoneDevices', () => {
  const activeOutputRingtoneDevices = {
    values: () => ({
      next: () => ({
        value: { deviceId: 'mock-ringtone-id' },
      }),
    }),
  };
  describe('preference exists in localstorage', () => {
    let mockSetItem;
    let mockDispatch;
    beforeAll(() => {
      mockSetItem = jest.fn();
      global.localStorage = {
        getItem: () =>
          '{ "ringtoneId": "previous-value", "otherId": "other-value" }',
        setItem: mockSetItem,
      };
      mockDispatch = jest.fn();
      updateActiveOutputRingtoneDevices(
        activeOutputRingtoneDevices
      )(mockDispatch, () => {});
    });
    it('sets the ringtone id in redux', () => {
      expect(mockDispatch.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            Object {
              "payload": "mock-ringtone-id",
              "type": "audioOutputPreferences/setActiveOutputRingtoneDevice",
            },
          ],
        ]
      `);
    });
    it('updates the ringtone id in local storage', () => {
      expect(mockSetItem.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            "skylightAudioOutputPreferences-mocktenantid-mockagentid",
            "{\\"ringtoneId\\":\\"mock-ringtone-id\\",\\"otherId\\":\\"other-value\\"}",
          ],
        ]
      `);
    });
  });
  describe('preference does not exist in localstorage', () => {
    let mockSetItem;
    beforeAll(() => {
      mockSetItem = jest.fn();
      global.localStorage = {
        getItem: () => null,
        setItem: mockSetItem,
      };
      updateActiveOutputRingtoneDevices(activeOutputRingtoneDevices)(
        () => {},
        () => {}
      );
    });
    it('sets the ringtone id in localstorage', () => {
      expect(mockSetItem.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            "skylightAudioOutputPreferences-mocktenantid-mockagentid",
            "{\\"ringtoneId\\":\\"mock-ringtone-id\\"}",
          ],
        ]
      `);
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
  it('dispatches action to set new active speaker device', () => {
    const dispatch = jest.fn();
    updateActiveOutputSpeakerDevice(
      'aead4bb457d9b0aeeddb669d8e6fef68d9cf2379d25264d6948af1dbdea3259b'
    )(dispatch);

    expect(CxEngage.twilio.setActiveOutputSpeakerDevices).toBeCalledWith({
      deviceIds:
        'aead4bb457d9b0aeeddb669d8e6fef68d9cf2379d25264d6948af1dbdea3259b',
    });
  });
});

describe('updateActiveOutputSpeakerDevices', () => {
  const activeOutputSpeakerDevices = {
    values: () => ({
      next: () => ({
        value: { deviceId: 'mock-speaker-id' },
      }),
    }),
  };
  describe('preference exists in localstorage', () => {
    let mockSetItem;
    let mockDispatch;
    beforeAll(() => {
      mockSetItem = jest.fn();
      global.localStorage = {
        getItem: () =>
          '{ "speakerId": "previous-value", "otherId": "other-value" }',
        setItem: mockSetItem,
      };
      mockDispatch = jest.fn();
      updateActiveOutputSpeakerDevices(activeOutputSpeakerDevices)(
        mockDispatch,
        () => {}
      );
    });
    it('sets the speaker id in redux', () => {
      expect(mockDispatch.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            Object {
              "payload": "mock-speaker-id",
              "type": "audioOutputPreferences/setActiveOutputSpeakerDevice",
            },
          ],
        ]
      `);
    });
    it('updates the speaker id in local storage', () => {
      expect(mockSetItem.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            "skylightAudioOutputPreferences-mocktenantid-mockagentid",
            "{\\"speakerId\\":\\"mock-speaker-id\\",\\"otherId\\":\\"other-value\\"}",
          ],
        ]
      `);
    });
  });
  describe('preference does not exist in localstorage', () => {
    let mockSetItem;
    beforeAll(() => {
      mockSetItem = jest.fn();
      global.localStorage = {
        getItem: () => null,
        setItem: mockSetItem,
      };
      updateActiveOutputSpeakerDevices(activeOutputSpeakerDevices)(
        () => {},
        () => {}
      );
    });
    it('sets the speaker id in localstorage', () => {
      expect(mockSetItem.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            "skylightAudioOutputPreferences-mocktenantid-mockagentid",
            "{\\"speakerId\\":\\"mock-speaker-id\\"}",
          ],
        ]
      `);
    });
  });
});

describe('updateActiveOutputNotificationDevice', () => {
  describe('preference exists in localstorage', () => {
    let mockSetItem;
    let mockDispatch;
    beforeAll(() => {
      mockSetItem = jest.fn();
      global.localStorage = {
        getItem: () =>
          '{ "notificationId": "previous-value", "otherId": "other-value" }',
        setItem: mockSetItem,
      };
      mockDispatch = jest.fn();
      updateActiveOutputNotificationDevice('mock-notification-id')(
        mockDispatch,
        () => {}
      );
    });
    it('sets the notification id in redux', () => {
      expect(mockDispatch.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            Object {
              "payload": "mock-notification-id",
              "type": "audioOutputPreferences/setActiveOutputNotificationDevice",
            },
          ],
        ]
      `);
    });
    it('updates the notification id in local storage', () => {
      expect(mockSetItem.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            "skylightAudioOutputPreferences-mocktenantid-mockagentid",
            "{\\"notificationId\\":\\"mock-notification-id\\",\\"otherId\\":\\"other-value\\"}",
          ],
        ]
      `);
    });
  });
  describe('preference does not exist in localstorage', () => {
    let mockSetItem;
    beforeAll(() => {
      mockSetItem = jest.fn();
      global.localStorage = {
        getItem: () => null,
        setItem: mockSetItem,
      };
      updateActiveOutputNotificationDevice('mock-notification-id')(
        () => {},
        () => {}
      );
    });
    it('sets the notification id in localstorage', () => {
      expect(mockSetItem.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            "skylightAudioOutputPreferences-mocktenantid-mockagentid",
            "{\\"notificationId\\":\\"mock-notification-id\\"}",
          ],
        ]
      `);
    });
  });
});

describe('goUpdateAudioOutputUserPreferences', () => {
  describe('has active ringtone and speaker in payload', () => {
    let mockDispatch;
    let mockSetItem;
    let payload;
    beforeEach(() => {
      mockDispatch = jest.fn();
      mockSetItem = jest.fn();
      global.localStorage = {
        getItem: () => {},
        setItem: mockSetItem,
      };
      payload = {
        availableOutputDevices: new Set([
          {
            deviceId: 'mock-device-id-1',
            label: 'Device 1',
          },
          {
            deviceId: 'mock-device-id-2',
            label: 'Device 2',
          },
        ]),
        activeOutputRingtoneDevices: new Set([
          {
            deviceId: 'mock-device-id-1',
            label: 'Device 1',
          },
        ]),
        activeOutputSpeakerDevices: new Set([
          {
            deviceId: 'mock-device-id-2',
            label: 'Device 2',
          },
        ]),
      };
      goUpdateAudioOutputUserPreferences(payload)(mockDispatch, () => {});
    });
    describe('notification id exists in available devices', () => {
      it('sets devices in redux', () => {
        expect(mockDispatch.mock.calls).toMatchInlineSnapshot(`
          Array [
            Array [
              Object {
                "payload": Array [
                  Object {
                    "id": "mock-device-id-1",
                    "label": "Device 1",
                  },
                  Object {
                    "id": "mock-device-id-2",
                    "label": "Device 2",
                  },
                ],
                "type": "audioOutputPreferences/setAvailableOutputDevices",
              },
            ],
            Array [
              Object {
                "payload": "mock-device-id-1",
                "type": "audioOutputPreferences/setActiveOutputRingtoneDevice",
              },
            ],
            Array [
              Object {
                "payload": "mock-device-id-2",
                "type": "audioOutputPreferences/setActiveOutputSpeakerDevice",
              },
            ],
            Array [
              Object {
                "payload": "mock-device-id-1",
                "type": "audioOutputPreferences/setActiveOutputNotificationDevice",
              },
            ],
          ]
        `);
      });
      it('sets devices in localstorage', () => {
        expect(mockSetItem.mock.calls).toMatchInlineSnapshot(`
          Array [
            Array [
              "skylightAudioOutputPreferences-mocktenantid-mockagentid",
              "{\\"ringtoneId\\":\\"mock-device-id-1\\",\\"speakerId\\":\\"mock-device-id-2\\",\\"notificationId\\":\\"mock-device-id-1\\"}",
            ],
          ]
        `);
      });
    });
    describe('notification id does not exist in available devices', () => {
      beforeAll(() => {
        getActiveOutputNotificationDevice.mockReturnValueOnce(
          'device-does-not-exist'
        );
      });
      it('falls back to default for notification id', () => {
        expect(mockDispatch.mock.calls[3]).toMatchInlineSnapshot(`
          Array [
            Object {
              "payload": "default",
              "type": "audioOutputPreferences/setActiveOutputNotificationDevice",
            },
          ]
        `);
      });
    });
  });

  describe('has no ringtone nor speaker in payload', () => {
    let payload;
    beforeAll(() => {
      payload = {
        availableOutputDevices: new Set([
          {
            deviceId: 'mock-device-id-1',
            label: 'Device 1',
          },
          {
            deviceId: 'mock-device-id-2',
            label: 'Device 2',
          },
        ]),
        activeOutputRingtoneDevices: new Set(),
        activeOutputSpeakerDevices: new Set(),
      };
    });
    describe('has localstorage values', () => {
      let mockDispatch;
      let spyOnUpdateActiveOutputRingtoneDevice;
      let spyOnUpdateActiveOutputSpeakerDevice;
      beforeAll(() => {
        global.localStorage = {
          getItem: () =>
            '{ "ringtoneId": "mock-device-id-1", "speakerId": "mock-device-id-2", "notificationId": "mock-device-id-1" }',
        };
        mockDispatch = jest.fn();

        spyOnUpdateActiveOutputRingtoneDevice = jest
          .spyOn(thunks, 'updateActiveOutputRingtoneDevice')
          .mockReturnValue('mockUpdateActiveOutputRingtoneDevice');
        spyOnUpdateActiveOutputSpeakerDevice = jest
          .spyOn(thunks, 'updateActiveOutputSpeakerDevice')
          .mockReturnValue('mockUpdateActiveOutputSpeakerDevice');

        thunks.goUpdateAudioOutputUserPreferences(payload)(
          mockDispatch,
          () => {}
        );
      });
      afterAll(() => {
        spyOnUpdateActiveOutputRingtoneDevice.mockRestore();
        spyOnUpdateActiveOutputSpeakerDevice.mockRestore();
      });
      it('calls updateActiveOutputRingtoneDevice', () => {
        expect(spyOnUpdateActiveOutputRingtoneDevice.mock.calls)
          .toMatchInlineSnapshot(`
          Array [
            Array [
              "mock-device-id-1",
            ],
          ]
        `);
      });
      it('calls updateActiveOutputSpeakerDevice', () => {
        expect(spyOnUpdateActiveOutputSpeakerDevice.mock.calls)
          .toMatchInlineSnapshot(`
          Array [
            Array [
              "mock-device-id-2",
            ],
          ]
        `);
      });
      it('sets devices in redux', () => {
        expect(mockDispatch.mock.calls).toMatchInlineSnapshot(`
          Array [
            Array [
              Object {
                "payload": Array [
                  Object {
                    "id": "mock-device-id-1",
                    "label": "Device 1",
                  },
                  Object {
                    "id": "mock-device-id-2",
                    "label": "Device 2",
                  },
                ],
                "type": "audioOutputPreferences/setAvailableOutputDevices",
              },
            ],
            Array [
              "mockUpdateActiveOutputRingtoneDevice",
            ],
            Array [
              "mockUpdateActiveOutputSpeakerDevice",
            ],
            Array [
              Object {
                "payload": "mock-device-id-1",
                "type": "audioOutputPreferences/setActiveOutputNotificationDevice",
              },
            ],
          ]
        `);
      });
    });
    describe('does not have localstorage values', () => {
      let mockDispatch;
      beforeAll(() => {
        global.localStorage = {
          getItem: () => '{ }',
        };
        mockDispatch = jest.fn();
        goUpdateAudioOutputUserPreferences(payload)(mockDispatch, () => {});
      });
      it('only sets available devices in redux', () => {
        expect(mockDispatch.mock.calls).toMatchInlineSnapshot(`
          Array [
            Array [
              Object {
                "payload": Array [
                  Object {
                    "id": "mock-device-id-1",
                    "label": "Device 1",
                  },
                  Object {
                    "id": "mock-device-id-2",
                    "label": "Device 2",
                  },
                ],
                "type": "audioOutputPreferences/setAvailableOutputDevices",
              },
            ],
          ]
        `);
      });
    });
    describe('null localstorage values', () => {
      let mockDispatch;
      beforeAll(() => {
        global.localStorage = {
          getItem: () => null,
        };
        mockDispatch = jest.fn();
        goUpdateAudioOutputUserPreferences(payload)(mockDispatch, () => {});
      });
      it('only sets available devices in redux', () => {
        expect(mockDispatch.mock.calls).toMatchInlineSnapshot(`
          Array [
            Array [
              Object {
                "payload": Array [
                  Object {
                    "id": "mock-device-id-1",
                    "label": "Device 1",
                  },
                  Object {
                    "id": "mock-device-id-2",
                    "label": "Device 2",
                  },
                ],
                "type": "audioOutputPreferences/setAvailableOutputDevices",
              },
            ],
          ]
        `);
      });
    });
  });
});
