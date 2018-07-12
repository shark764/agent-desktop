/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import { fromJS } from 'immutable';
import {
  selectHasActiveInteractions,
  selectExtensions,
  selectActiveExtension,
  selectHasActiveWrapup,
  selectPresenceReasonLists,
  selectHasDirectionChangePermission,
  selectIsSelectedDirection,
} from '../selectors';

describe('selectHasActiveInteractions', () => {
  describe('if an interaction is present with status work-accepting', () => {
    const mockState = fromJS({
      agentDesktop: {
        interactions: [
          {
            status: 'work-accepting',
          },
        ],
      },
    });

    it('should return true', () => {
      expect(selectHasActiveInteractions(mockState)).toEqual(true);
    });
  });

  describe('if an interaction is present with status work-accepted', () => {
    const mockState = fromJS({
      agentDesktop: {
        interactions: [
          {
            status: 'work-accepted',
          },
        ],
      },
    });

    it('should return true', () => {
      expect(selectHasActiveInteractions(mockState)).toEqual(true);
    });
  });

  describe('if no interaction is present with valid active status', () => {
    const mockState = fromJS({
      agentDesktop: {
        interactions: [
          {
            status: 'nonActiveStatus',
          },
        ],
      },
    });

    it('should return false', () => {
      expect(selectHasActiveInteractions(mockState)).toEqual(false);
    });
  });
});

describe('selectExtensions', () => {
  const mockState = fromJS({
    agentDesktop: {
      extensions: ['mockExtension'],
    },
  });

  it('should return extensions from the agentDesktop domain', () => {
    expect(selectExtensions(mockState)).toMatchSnapshot();
  });
});

describe('selectActiveExtension', () => {
  const mockState = fromJS({
    agentDesktop: {
      activeExtension: { mockExtension: 'mockExtension' },
    },
  });

  it('should return activeExtension from the agentDesktop domain', () => {
    expect(selectActiveExtension(mockState)).toMatchSnapshot();
  });
});

describe('selectHasActiveWrapup', () => {
  describe('if an interaction is present with status wrapup', () => {
    const mockState = fromJS({
      agentDesktop: {
        interactions: [
          {
            status: 'wrapup',
          },
        ],
      },
    });

    it('should return true', () => {
      expect(selectHasActiveWrapup(mockState)).toEqual(true);
    });
  });

  describe('if no interaction is present with status wrapup', () => {
    const mockState = fromJS({
      agentDesktop: {
        interactions: [
          {
            status: 'nonWrapupStatus',
          },
        ],
      },
    });

    it('should return false', () => {
      expect(selectHasActiveWrapup(mockState)).toEqual(false);
    });
  });

  describe('selectPresenceReasons', () => {
    const mockState = fromJS({
      agentDesktop: {
        presenceReasonLists: [{ reasons: [{ name: 'mockPresenceReason' }] }],
      },
    });

    it('Should return presenceReasonLists from the agentDesktop domain', () => {
      expect(selectPresenceReasonLists(mockState)).toMatchSnapshot();
    });
  });

  describe('selectHasDirectionChangePermission', () => {
    const mockState = fromJS({
      login: {
        agent: {
          tenants: [
            {
              tenantId: 'mock tenant id',
              tenantPermissions: [],
            },
          ],
        },
        tenant: {
          id: 'mock tenant id',
        },
      },
    });
    it('returns true when permissions does not include MANAGE_ALL_USERS_DIRECTION nor MANAGE_MY_DIRECTION', () => {
      expect(selectHasDirectionChangePermission(mockState)).toBe(false);
    });
    it('returns true when permissions include MANAGE_ALL_USERS_DIRECTION', () => {
      const withPermission = mockState.updateIn(
        ['login', 'agent', 'tenants', 0, 'tenantPermissions'],
        (permissions) => permissions.push('MANAGE_ALL_USERS_DIRECTION')
      );
      expect(selectHasDirectionChangePermission(withPermission)).toBe(true);
    });
    it('returns true when permissions include MANAGE_MY_DIRECTION', () => {
      const withPermission = mockState.updateIn(
        ['login', 'agent', 'tenants', 0, 'tenantPermissions'],
        (permissions) => permissions.push('MANAGE_MY_DIRECTION')
      );
      expect(selectHasDirectionChangePermission(withPermission)).toBe(true);
    });
  });

  describe('selectIsSelectedDirection', () => {
    const mockState = fromJS({
      agentDesktop: {
        agentDirection: {
          direction: 'inbound',
        },
      },
    });
    it('returns true when prop is the same direction', () => {
      expect(
        selectIsSelectedDirection(mockState, { direction: 'inbound' })
      ).toBe(true);
    });
    it('returns false when prop is a different direction', () => {
      expect(
        selectIsSelectedDirection(mockState, { direction: 'outbound' })
      ).toBe(false);
    });
  });
});
