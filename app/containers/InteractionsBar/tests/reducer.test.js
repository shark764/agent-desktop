import expect from 'expect';
import interactionsBarReducer from '../reducer';
import { fromJS } from 'immutable';

describe('interactionsBarReducer', () => {
  it('returns the initial state', () => {
    expect(interactionsBarReducer(undefined, {})).toEqual(fromJS({}));
  });
});
