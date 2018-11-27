import { fromJS } from 'immutable';
import { selectDialpadTextValidity, selectDialpadText } from '../selectors';

describe('TransferDialPad', () => {
  const state = fromJS({
    transferDialPad: {
      dialpadText: '+15061234567',
    },
  });
  it('selectDialpadTextValidity', () => {
    expect(selectDialpadTextValidity(state)).toEqual(true);
  });
  it('selectDialpadText', () => {
    expect(selectDialpadText(state)).toEqual('+15061234567');
  });
});
