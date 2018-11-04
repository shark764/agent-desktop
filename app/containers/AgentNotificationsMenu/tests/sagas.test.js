/*
 * Copyright © 2015-2018 Serenova, LLC. All rights reserved.
 */

import {
  goInitializeNotificatonPreferences,
  goToggleAudioNotificationsPreference,
  goToggleVisualNotificationsPreference,
} from '../sagas';

describe('goInitializeNotificatonPreferences', () => {
  afterAll(() => {
    delete global.localStorage;
  });
  describe('notifications stored in localStorage', () => {
    const mockGetItem = jest.fn().mockReturnValue('true');
    beforeEach(() => {
      global.localStorage = {
        getItem: mockGetItem,
      };
    });
    const generator = goInitializeNotificatonPreferences();
    it('selectes the tenant id', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('selectes the agent id', () => {
      expect(generator.next({ id: 'tenantId' })).toMatchSnapshot();
    });
    it('puts the audio notification into state', () => {
      expect(generator.next({ userId: 'agentId' })).toMatchSnapshot();
    });
    it('puts the visual notification into state', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('uses the tenant and agent id to get the items from localStorage', () => {
      expect(mockGetItem.mock.calls).toMatchSnapshot();
    });
    it('is done', () => {
      expect(generator.next().done).toBe(true);
    });
  });
  describe('notifications not stored in localStorage', () => {
    beforeEach(() => {
      global.localStorage = {
        getItem: () => null,
      };
    });
    const generator = goInitializeNotificatonPreferences();
    it('selectes the tenant id', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('selectes the agent id', () => {
      expect(generator.next({ id: 'tenantId' })).toMatchSnapshot();
    });
    it('is done', () => {
      expect(generator.next({ userId: 'agentId' }).done).toBe(true);
    });
  });
});

describe('goToggleAudioNotificationsPreference', () => {
  const mockSetItem = jest.fn();
  beforeEach(() => {
    global.localStorage = {
      setItem: mockSetItem,
    };
  });
  afterAll(() => {
    delete global.localStorage;
  });
  const generator = goToggleAudioNotificationsPreference();
  it('gets the current audio notification', () => {
    expect(generator.next()).toMatchSnapshot();
  });
  it('puts the inverse of it', () => {
    expect(generator.next(true)).toMatchSnapshot();
  });
  it('selectes the tenant id', () => {
    expect(generator.next()).toMatchSnapshot();
  });
  it('selectes the agent id', () => {
    expect(generator.next({ id: 'tenantId' })).toMatchSnapshot();
  });
  it('is done', () => {
    expect(generator.next({ userId: 'agentId' }).done).toBe(true);
  });
  it('uses the tenant and agent id to set the notification in localStorage', () => {
    expect(mockSetItem.mock.calls).toMatchSnapshot();
  });
});

describe('goToggleVisualNotificationsPreference', () => {
  afterAll(() => {
    delete global.localStorage;
    delete global.Notification;
  });
  describe('does not have notification permission', () => {
    const mockSetItem = jest.fn();
    beforeEach(() => {
      global.localStorage = {
        setItem: mockSetItem,
      };
      global.Notification = {
        permission: 'denied',
        requestPermission: () => new Promise((resolve) => resolve(true)),
      };
    });
    describe('permission is granted upon request', () => {
      const generator = goToggleVisualNotificationsPreference();
      it('requests permission', () => {
        expect(generator.next()).toMatchSnapshot();
      });
      it('sets the notification to true', () => {
        expect(generator.next('granted')).toMatchSnapshot();
      });
      it('selectes the tenant id', () => {
        expect(generator.next()).toMatchSnapshot();
      });
      it('selectes the agent id', () => {
        expect(generator.next({ id: 'tenantId' })).toMatchSnapshot();
      });
      it('is done', () => {
        expect(generator.next({ userId: 'agentId' }).done).toBe(true);
      });
      it('uses the tenant and agent id to set the notification in localStorage', () => {
        expect(mockSetItem.mock.calls).toMatchSnapshot();
      });
    });
    describe('permission is not granted upon request', () => {
      const generator = goToggleVisualNotificationsPreference();
      it('requests permission', () => {
        expect(generator.next()).toMatchSnapshot();
      });
      it('adds error', () => {
        expect(generator.next('denied')).toMatchSnapshot();
      });
      it('is done', () => {
        expect(generator.next().done).toBe(true);
      });
    });
  });
  describe('does have notification permission', () => {
    const mockSetItem = jest.fn();
    beforeEach(() => {
      global.localStorage = {
        setItem: mockSetItem,
      };
      global.Notification = {
        permission: 'granted',
      };
    });
    const generator = goToggleVisualNotificationsPreference();
    it('gets the current visual notification', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('puts the inverse of it', () => {
      expect(generator.next(true)).toMatchSnapshot();
    });
    it('selectes the tenant id', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('selectes the agent id', () => {
      expect(generator.next({ id: 'tenantId' })).toMatchSnapshot();
    });
    it('is done', () => {
      expect(generator.next({ userId: 'agentId' }).done).toBe(true);
    });
    it('uses the tenant and agent id to set the notification in localStorage', () => {
      expect(mockSetItem.mock.calls).toMatchSnapshot();
    });
  });
});
