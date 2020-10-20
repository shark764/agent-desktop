import { selectTenant, selectAgent } from 'containers/Login/selectors';

import { selectAudioPreferences, selectVisualPreferences } from '../selectors';
import * as thunks from '../thunks';
const {
  initializeNotificatonPreferences,
  toggleAudioNotificationsPreference,
  toggleVisualNotificationsPreference,
} = thunks;

jest.mock('containers/Login/selectors');
selectTenant.mockReturnValue({ id: 'mocktenantid' });
selectAgent.mockReturnValue({ userId: 'mockagentid' });

jest.mock('../selectors');
selectAudioPreferences.mockReturnValue(true);
selectVisualPreferences.mockReturnValue(true);

describe('initializeNotificatonPreferences', () => {
  let mockSetItem;
  let mockDispatch;
  describe('preference exists in localstorage', () => {
    beforeAll(() => {
      mockSetItem = jest.fn();
      global.localStorage = {
        getItem: () => 'true',
        setItem: mockSetItem,
      };
      mockDispatch = jest.fn();
      initializeNotificatonPreferences()(mockDispatch, () => {});
    });
    it('sets the notification preferences in redux', () => {
      expect(mockDispatch.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            Object {
              "payload": true,
              "type": "notificationPreferences/setAudioNotificationsPreference",
            },
          ],
          Array [
            Object {
              "payload": true,
              "type": "notificationPreferences/setVisualNotificationsPreference",
            },
          ],
        ]
      `);
    });
  });
  describe('audio notifications does not exist in localStorage', () => {
    beforeAll(() => {
      mockSetItem = jest.fn();
      global.localStorage = {
        getItem: jest
          .fn()
          .mockReturnValueOnce(null)
          .mockReturnValueOnce('true'),
        setItem: mockSetItem,
      };
      mockDispatch = jest.fn();
      initializeNotificatonPreferences()(mockDispatch, () => {});
    });
    it('sets the notification preferences in redux', () => {
      expect(mockDispatch.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            Object {
              "payload": true,
              "type": "notificationPreferences/setVisualNotificationsPreference",
            },
          ],
        ]
      `);
    });
  });
  describe('visual notifications does not exist in localStorage', () => {
    beforeAll(() => {
      mockSetItem = jest.fn();
      global.localStorage = {
        getItem: jest
          .fn()
          .mockReturnValueOnce('true')
          .mockReturnValueOnce(null),
        setItem: mockSetItem,
      };
      mockDispatch = jest.fn();
      initializeNotificatonPreferences()(mockDispatch, () => {});
    });
    it('sets the notification preferences in redux', () => {
      expect(mockDispatch.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            Object {
              "payload": true,
              "type": "notificationPreferences/setAudioNotificationsPreference",
            },
          ],
        ]
      `);
    });
  });
  describe('preference does not exist in localstorage', () => {
    beforeAll(() => {
      mockSetItem = jest.fn();
      global.localStorage = {
        getItem: () => null,
        setItem: mockSetItem,
      };
      mockDispatch = jest.fn();
      initializeNotificatonPreferences()(
        () => {},
        () => {}
      );
    });
    it('notification preferences will not be set in redux', () => {
      expect(mockDispatch.mock.calls).toMatchInlineSnapshot(`Array []`);
    });
  });
});

describe('toggleAudioNotificationsPreference', () => {
  let mockSetItem;
  let mockDispatch;
  describe('toggle audio preference in redux and localstorage to disabled status', () => {
    beforeAll(() => {
      mockSetItem = jest.fn();
      global.localStorage = {
        setItem: mockSetItem,
      };
      mockDispatch = jest.fn();
      toggleAudioNotificationsPreference()(mockDispatch, () => {});
    });
    it('sets the notification preferences in redux', () => {
      expect(mockDispatch.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            Object {
              "payload": false,
              "type": "notificationPreferences/setAudioNotificationsPreference",
            },
          ],
        ]
      `);
    });
    it('updates the audio preferences in local storage', () => {
      expect(mockSetItem.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            "skylightAudioNotifications-mocktenantid-mockagentid",
            false,
          ],
        ]
      `);
    });
  });
  describe('toggle audio preference in redux and localstorage to enabled status', () => {
    beforeAll(() => {
      mockSetItem = jest.fn();
      global.localStorage = {
        setItem: mockSetItem,
      };
      mockDispatch = jest.fn();
      selectAudioPreferences.mockReturnValueOnce(false);
      toggleAudioNotificationsPreference()(mockDispatch, () => {});
    });
    it('sets the notification preferences in redux', () => {
      expect(mockDispatch.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            Object {
              "payload": true,
              "type": "notificationPreferences/setAudioNotificationsPreference",
            },
          ],
        ]
      `);
    });
    it('updates the audio preferences in local storage', () => {
      expect(mockSetItem.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            "skylightAudioNotifications-mocktenantid-mockagentid",
            true,
          ],
        ]
      `);
    });
  });
});

describe('toggleVisualNotificationsPreference', () => {
  let mockSetItem;
  let mockDispatch;
  describe('toggle visual preference in redux and localstorage to disabled status', () => {
    beforeAll(() => {
      global.Notification = {
        permission: 'granted',
      };
      mockSetItem = jest.fn();
      global.localStorage = {
        setItem: mockSetItem,
      };
      mockDispatch = jest.fn();
      toggleVisualNotificationsPreference()(mockDispatch, () => {});
    });
    afterAll(() => {
      delete global.Notification;
    });
    it('sets the notification preferences in redux', () => {
      expect(mockDispatch.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            Object {
              "payload": false,
              "type": "notificationPreferences/setVisualNotificationsPreference",
            },
          ],
        ]
      `);
    });
    it('updates the visual preferences in local storage', () => {
      expect(mockSetItem.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            "skylightVisualNotifications-mocktenantid-mockagentid",
            false,
          ],
        ]
      `);
    });
  });
  describe('toggle visual preference in redux and localstorage to enabled status', () => {
    beforeAll(() => {
      global.Notification = {
        permission: 'granted',
      };
      mockSetItem = jest.fn();
      global.localStorage = {
        setItem: mockSetItem,
      };
      mockDispatch = jest.fn();
      selectVisualPreferences.mockReturnValueOnce(false);
      toggleVisualNotificationsPreference()(mockDispatch, () => {});
    });
    afterAll(() => {
      delete global.Notification;
    });
    it('sets the notification preferences in redux', () => {
      expect(mockDispatch.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            Object {
              "payload": true,
              "type": "notificationPreferences/setVisualNotificationsPreference",
            },
          ],
        ]
      `);
    });
    it('updates the visual preferences in local storage', () => {
      expect(mockSetItem.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            "skylightVisualNotifications-mocktenantid-mockagentid",
            true,
          ],
        ]
      `);
    });
  });
  describe('toggle visual preference in redux and localstorage when permission is not granted', () => {
    beforeAll(() => {
      global.Notification = {
        permission: 'denied',
        requestPermission: jest
          .fn()
          .mockImplementation(() => Promise.resolve('granted')),
      };
      mockSetItem = jest.fn();
      global.localStorage = {
        setItem: mockSetItem,
      };
      mockDispatch = jest.fn();
      toggleVisualNotificationsPreference()(mockDispatch, () => {});
    });
    afterAll(() => {
      delete global.Notification;
    });
    it('sets the notification preferences in redux', () => {
      expect(mockDispatch.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            Object {
              "payload": true,
              "type": "notificationPreferences/setVisualNotificationsPreference",
            },
          ],
        ]
      `);
    });
    it('updates the visual preferences in local storage', () => {
      expect(mockSetItem.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            "skylightVisualNotifications-mocktenantid-mockagentid",
            true,
          ],
        ]
      `);
    });
  });
  describe('toggle visual preference in redux and localstorage when permission is not granted and request for permission is unsuccessful', () => {
    beforeAll(() => {
      global.Notification = {
        permission: 'denied',
        requestPermission: jest
          .fn()
          .mockImplementation(() => Promise.resolve('denied')),
      };
      mockSetItem = jest.fn();
      global.localStorage = {
        setItem: mockSetItem,
      };
      mockDispatch = jest.fn();
      toggleVisualNotificationsPreference()(mockDispatch, () => {});
    });
    afterAll(() => {
      delete global.Notification;
    });
    it('sets AD-1006 error in redux', () => {
      expect(mockDispatch.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            Object {
              "error": Object {
                "code": "AD-1006",
              },
              "interactionFatal": undefined,
              "type": "app/Errors/SET_NON_CRITICAL_ERROR",
            },
          ],
        ]
      `);
    });
  });
});
