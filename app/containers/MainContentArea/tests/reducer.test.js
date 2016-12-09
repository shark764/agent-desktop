import expect from 'expect';
import mainContentAreaReducer from '../reducer';
import { fromJS } from 'immutable';

describe('mainContentAreaReducer', () => {
  it('returns the initial state', () => {
    expect(mainContentAreaReducer(undefined, {})).toEqual(fromJS({}));
  });
});
