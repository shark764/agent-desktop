import expect from 'expect';
import agentDesktopReducer from '../reducer';
import { fromJS } from 'immutable';

describe('agentDesktopReducer', () => {
  it('returns the initial state', () => {
    expect(agentDesktopReducer(undefined, {})).toEqual(fromJS({}));
  });
});
