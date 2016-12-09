import expect from 'expect';
import tennantSelectReducer from '../reducer';
import { fromJS } from 'immutable';

describe('tennantSelectReducer', () => {
  it('returns the initial state', () => {
    expect(tennantSelectReducer(undefined, {})).toEqual(fromJS({}));
  });
});
