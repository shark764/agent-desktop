import { createSelector } from 'reselect';

const selectContactsControlDomain = (state) => state.get('contactsControl');

const selectQuery = createSelector(
  selectContactsControlDomain,
  (contactsControl) => contactsControl.get('query').toJS()
);

export {
  selectQuery,
};
