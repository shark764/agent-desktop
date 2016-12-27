import expect from 'expect';
import agentStatusMenuReducer from '../reducer';
import { fromJS } from 'immutable';

describe('agentStatusMenuReducer', () => {
  it('returns the initial state', () => {
    expect(agentStatusMenuReducer(undefined, {})).toEqual(fromJS({}));
  });
});
