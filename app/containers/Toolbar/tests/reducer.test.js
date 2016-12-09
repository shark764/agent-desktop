import expect from 'expect';
import toolbarReducer from '../reducer';
import { fromJS } from 'immutable';

describe('toolbarReducer', () => {
  it('returns the initial state', () => {
    expect(toolbarReducer(undefined, {})).toEqual(fromJS({}));
  });
});
