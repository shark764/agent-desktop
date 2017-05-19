import { createSelector } from 'reselect';

/**
 * Direct selector to the infoTab state domain
 */
const selectInfoTabDomain = () => (state) => state.get('infoTab');

/**
 * Default selector used by InfoTab
 */

const selectInfoTab = createSelector(
  selectInfoTabDomain(),
  (substate) => substate.toJS()
);


export default selectInfoTab;

/**
 * Other specific selectors
 */

const selectAgentDesktopDomain = (state) => state.get('agentDesktop');
const selectSidePanelDomain = (state) => state.get('sidePanel');
const selectLanguageDomain = (state) => state.get('language');

const selectAttributes = createSelector(
  selectSidePanelDomain,
  (sidePanel) => sidePanel.get('contactAttributes').toJS()
);

const selectInteractions = createSelector(
  selectAgentDesktopDomain,
  (agentDesktop) => agentDesktop.get('interactions')
);

const getSelectedInteractionId = createSelector(
  selectAgentDesktopDomain,
  (agentDesktop) => agentDesktop.get('selectedInteractionId')
);

const selectSelectedInteraction = createSelector(
  [selectInteractions, getSelectedInteractionId],
  (interactions, selectedInteractionId) => interactions.toJS().filter(
    (interaction) => interaction.interactionId === selectedInteractionId
  )[0]
);

const selectNoInteractionContactPanelContactsData = createSelector(
  selectAgentDesktopDomain,
  (agentDesktop) => agentDesktop.get('noInteractionContactPanel')
);

const selectCurrentInteraction = createSelector(
  [selectSelectedInteraction, selectNoInteractionContactPanelContactsData],
  (selectedInteraction, floatingNoInteractionData) => {
    if (selectedInteraction) {
      return selectedInteraction;
    } else {
      return floatingNoInteractionData.toJS();
    }
  }
);

const selectCheckedContacts = createSelector(
  selectInfoTabDomain(),
  (infoTab) => infoTab.get('checkedContacts').toJS()
);

const selectContactMode = createSelector(
  selectInfoTabDomain(),
  (infoTab) => infoTab.get('contactMode')
);

const selectUnassignedContact = createSelector(
  selectInfoTabDomain(),
  (infoTab) => infoTab.get('unassignedContact')
);

const selectExpandedQuery = createSelector(
  [selectCurrentInteraction, selectAttributes, selectLanguageDomain],
  (currentInteraction, attributes, language) => {
    const locale = language.get('locale');
    return Object.keys(currentInteraction.query).map((filterName) => {
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
        attribute = attributes.find((fullAttribute) => fullAttribute.objectName === filterName);
      }
      const label = attribute.label[locale] || filterName;
      return (attribute)
      ? { attribute, value: currentInteraction.query[filterName], label }
      : false;
    }).filter(Boolean);
  }
);

const selectNotifications = createSelector(
  selectInfoTabDomain(),
  (infoTab) => infoTab.get('notifications')
);

const selectNextNotificationId = createSelector(
  selectInfoTabDomain(),
  (infoTab) => infoTab.get('nextNotificationId')
);

const selectLoading = createSelector(
  selectInfoTabDomain(),
  (infoTab) => infoTab.get('loading')
);

const selectDeletionPending = createSelector(
  selectInfoTabDomain(),
  (infoTab) => infoTab.get('deletionPending')
);

const selectConfirmingDelete = createSelector(
  selectInfoTabDomain(),
  (infoTab) => infoTab.get('confirmingDelete')
);

export {
  selectInfoTabDomain,
  selectAttributes,
  selectCurrentInteraction,
  selectCheckedContacts,
  selectContactMode,
  selectUnassignedContact,
  selectExpandedQuery,
  selectNotifications,
  selectNextNotificationId,
  selectLoading,
  selectDeletionPending,
  selectConfirmingDelete,
};
