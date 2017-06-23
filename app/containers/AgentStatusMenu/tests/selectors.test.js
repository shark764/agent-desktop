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
});
