/*
 * Copyright © 2015-2018 Serenova, LLC. All rights reserved.
 */

import { goInitializeStats } from '../sagas';

describe('goInitializeStats', () => {
  afterAll(() => {
    delete global.localStorage;
  });

  describe('having view stats permission', () => {
    const welcomeStatsIds = '[1, 2, 3]';
    const mockGetItem = jest.fn().mockReturnValue(welcomeStatsIds);
    beforeEach(() => {
      global.localStorage = {
        getItem: mockGetItem,
      };
    });
    const generator = goInitializeStats();
    it('selects welcomeStatsConfig', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('selects hasViewStatsPermission and returns true', () => {
      expect(generator.next(true)).toMatchSnapshot();
    });
    it('selects the tenant id', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('selects the agent id', () => {
      expect(generator.next({ id: 'tenantId' })).toMatchSnapshot();
    });
    it('saves welcomeStatsConfig in localStorage', () => {
      expect(generator.next({ userId: 'tenantId' })).toMatchSnapshot();
    });
    it('is done', () => {
      expect(generator.next().done).toBe(true);
    });
  });

  describe('not having view stats permission', () => {
    const generator = goInitializeStats();
    it('does not have view stats permission', () => {
      expect(generator.next(false)).toMatchSnapshot();
    });
    it('is done', () => {
      expect(generator.next().done).toBe(true);
    });
  });
});
