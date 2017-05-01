import { createSelector } from 'reselect';

const selectSidePanelDomain = (state) => state.get('sidePanel');
const selectContactsControlDomain = (state) => state.get('contactsControl');

const selectLayout = createSelector(
  selectSidePanelDomain,
  (sidePanel) => sidePanel.get('contactLayout').toJS().layout
);

const selectAttributes = createSelector(
  selectSidePanelDomain,
  (sidePanel) => sidePanel.get('contactAttributes').toJS()
);

const selectSelectedIndexes = createSelector(
  selectContactsControlDomain,
  (contactsControl) => contactsControl.get('selectedIndexes').toJS()
);

const selectUnusedFields = createSelector(
  selectContactsControlDomain,
  (contactsControl) => contactsControl.get('unusedFields').toJS()
);

export {
  selectLayout,
  selectAttributes,
  selectSelectedIndexes,
  selectUnusedFields,
};
