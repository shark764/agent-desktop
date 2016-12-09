import expect from 'expect';
import loginReducer from '../reducer';
import { fromJS } from 'immutable';

describe('loginReducer', () => {
  it('returns the initial state', () => {
    expect(loginReducer(undefined, {})).toEqual(fromJS({}));
  });
});
