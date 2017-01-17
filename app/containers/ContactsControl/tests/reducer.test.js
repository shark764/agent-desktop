import expect from 'expect';
import contactsControlReducer from '../reducer';
import { fromJS } from 'immutable';

describe('contactsControlReducer', () => {
  it('returns the initial state', () => {
    expect(contactsControlReducer(undefined, {})).toEqual(fromJS({}));
  });
});
