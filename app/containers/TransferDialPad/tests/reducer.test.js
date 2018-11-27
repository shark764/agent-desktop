import { Map } from 'immutable';
import reducer from '../reducer';
import * as action from '../actions';

describe('TransferDialPad', () => {
  it('returns default state', () => {
    expect(reducer(undefined, {})).toMatchSnapshot();
  });
  it('updates dialpadText state', () => {
    expect(
      reducer(Map(), action.setDialpadText('mockPhoneNumber'))
    ).toMatchSnapshot();
  });
});
