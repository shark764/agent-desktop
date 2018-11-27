import { createSelector } from 'reselect';
import { isPossibleNumber } from '../../utils/validator';

const selectDialpadText = (state) =>
  state.getIn(['transferDialPad', 'dialpadText']);

const selectDialpadTextValidity = createSelector(
  selectDialpadText,
  (dialpadText) => isPossibleNumber(dialpadText)
);

export { selectDialpadTextValidity, selectDialpadText };
