import expect from 'expect';
import agentScriptReducer from '../reducer';
import { fromJS } from 'immutable';

describe('agentScriptReducer', () => {
  it('returns the initial state', () => {
    expect(agentScriptReducer(undefined, {})).toEqual(fromJS({}));
  });
});
