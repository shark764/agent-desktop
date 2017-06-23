/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import { createSelector } from 'reselect';
import { getSelectedInteraction as selectCurrentInteraction } from 'containers/SidePanel/selectors';

/**
 * Direct selector to the infoTab state domain
 */
const selectInfoTabDomain = () => (state) => state.get('infoTab');

/**
 * Default selector used by InfoTab
 */

const selectInfoTab = createSelector(selectInfoTabDomain(), (substate) =>
  substate.toJS()
);

export default selectInfoTab;

/**
 * Other specific selectors
 */

const selectSidePanelDomain = (state) => state.get('sidePanel');
const selectLanguageDomain = (state) => state.get('language');

const selectAttributes = createSelector(selectSidePanelDomain, (sidePanel) =>
  sidePanel.get('contactAttributes').toJS()
);

const selectCurrentInteractionContactId = createSelector(
  [selectCurrentInteraction],
  (selectedCurrentInteraction) =>
    selectedCurrentInteraction &&
    selectedCurrentInteraction.contact &&
    selectedCurrentInteraction.contact.id
);

const selectCheckedContacts = createSelector(selectInfoTabDomain(), (infoTab) =>
  infoTab.get('checkedContacts').toJS()
);

const selectExpandedQuery = createSelector(
  [selectCurrentInteraction, selectAttributes, selectLanguageDomain],
  (currentInteraction, attributes, language) => {
    const locale = language.get('locale');
    return Object.keys(currentInteraction.query)
      .map((filterName) => {
        let attribute;
        if (filterName === 'q') {
          attribute = {
            id: 'all',
            label: {
              'en-US': 'All',
            },
            objectName: 'q', // Fuzzy search query parameter
          };
        } else {
          attribute = attributes.find(
            (fullAttribute) => fullAttribute.objectName === filterName
          );
        }
        const label = attribute.label[locale] || filterName;
        return attribute
          ? { attribute, value: currentInteraction.query[filterName], label }
          : false;
      })
      .filter(Boolean);
  }
);

const selectCRMUnavailable = createSelector(selectInfoTabDomain(), (infoTab) =>
  infoTab.get('crmUnavailable')
);

const selectNotifications = createSelector(selectInfoTabDomain(), (infoTab) =>
  infoTab.get('notifications')
);

const selectNextNotificationId = createSelector(
  selectInfoTabDomain(),
  (infoTab) => infoTab.get('nextNotificationId')
);

const selectLoading = createSelector(selectInfoTabDomain(), (infoTab) =>
  infoTab.get('loading')
);

const selectDeletionPending = createSelector(selectInfoTabDomain(), (infoTab) =>
  infoTab.get('deletionPending')
);

const selectConfirmingDelete = createSelector(selectInfoTabDomain(), (infoTab) =>
  infoTab.get('confirmingDelete')
);

const selectResults = createSelector(selectInfoTabDomain(), (infoTab) =>
  infoTab.get('results').toJS()
);

const selectResultsCount = createSelector(
  selectInfoTabDomain(),
  (infoTab) =>
    infoTab.get('resultsCount') !== undefined ? infoTab.get('resultsCount') : -1
);

const selectNextPage = createSelector(selectInfoTabDomain(), (infoTab) =>
  infoTab.get('nextPage')
);

export {
  selectCRMUnavailable,
  selectInfoTabDomain,
  selectAttributes,
  selectCurrentInteraction,
  selectCurrentInteractionContactId,
  selectCheckedContacts,
  selectExpandedQuery,
  selectNotifications,
  selectNextNotificationId,
  selectLoading,
  selectDeletionPending,
  selectConfirmingDelete,
  selectResults,
  selectResultsCount,
  selectNextPage,
};
