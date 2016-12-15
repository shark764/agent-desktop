import expect from 'expect';
import sidePanelReducer from '../reducer';
import { fromJS } from 'immutable';

describe('sidePanelReducer', () => {
  it('returns the initial state', () => {
    expect(sidePanelReducer(undefined, {})).toEqual(fromJS({}));
  });
});
