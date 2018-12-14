/*
 * Copyright © 2015-2018 Serenova, LLC. All rights reserved.
 */
import { fromJS, Map } from 'immutable';
import {
  SET_OUTBOUND_IDENTIFICATION_LISTS,
  SELECT_OUTBOUND_IDENTIFICATION,
} from '../constants';
import OutboundAniSelectReducer from '../reducer';

describe('OutboundAniSelectReducer', () => {
  it('returns the initial state', () => {
    expect(OutboundAniSelectReducer(undefined, {})).toMatchSnapshot();
  });

  describe('SET_OUTBOUND_IDENTIFICATION_LISTS', () => {
    it('set outbound identifier list', () => {
      const action = {
        type: SET_OUTBOUND_IDENTIFICATION_LISTS,
        response: {
          result: {
            effective: 'mock-value',
          },
        },
      };
      expect(OutboundAniSelectReducer(Map(), action)).toMatchSnapshot();
    });
    it('if outbound identifier list are empty', () => {
      const initialState = fromJS({});
      const action = {
        type: SET_OUTBOUND_IDENTIFICATION_LISTS,
        response: {
          result: [],
        },
      };
      expect(
        OutboundAniSelectReducer(fromJS(initialState), action)
      ).toMatchSnapshot();
    });
  });
  describe('SELECT_OUTBOUND_IDENTIFICATION', () => {
    it('set an outbound identifier when an outbound identifier is selected', () => {
      const action = {
        type: SELECT_OUTBOUND_IDENTIFICATION,
        response: 'mock-value',
      };
      expect(OutboundAniSelectReducer(Map(), action)).toMatchSnapshot();
    });
    it("set null when there's no outbound identifier selected", () => {
      const initialState = fromJS({});
      const action = {
        type: SELECT_OUTBOUND_IDENTIFICATION,
        response: null,
      };
      expect(
        OutboundAniSelectReducer(fromJS(initialState), action)
      ).toMatchSnapshot();
    });
  });
});
