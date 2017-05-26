import { fromJS } from 'immutable';
import infoTabReducer from '../reducer';
import { SET_CRM_UNAVAILABLE } from '../constants';

describe('infoTabReducer', () => {
  it('returns the initial state', () => {
    expect(infoTabReducer(undefined, {})).toMatchSnapshot();
  });

  let action;
  let initialState;

  const runReducerAndExpectSnapshot = () => {
    expect(infoTabReducer(fromJS(initialState), action)).toMatchSnapshot();
  };

  describe('SET_CRM_UNAVAILABLE', () => {
    beforeEach(() => {
      initialState = fromJS({});
      action = {
        type: SET_CRM_UNAVAILABLE,
      };
    });
    describe('if reason is undefined', () => {
      it('sets crmUnavailable to generalError', () => {
        runReducerAndExpectSnapshot();
      });
    });
    describe('if reason is a string', () => {
      beforeEach(() => {
        action.reason = 'mockReason';
      });
      it('sets crmUnavailable to the reason', () => {
        runReducerAndExpectSnapshot();
      });
    });
  });
});
