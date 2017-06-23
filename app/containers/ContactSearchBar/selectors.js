/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import { createSelector } from 'reselect';

const selectInfoTabDomain = (state) => state.get('infoTab');

const selectQuery = createSelector(selectInfoTabDomain, (infoTab) =>
  infoTab.get('query').toJS()
);

const selectSidePanelDomain = (state) => state.get('sidePanel');

const selectLayout = createSelector(selectSidePanelDomain, (sidePanel) =>
  sidePanel.get('contactLayout')
);
const selectAttributes = createSelector(selectSidePanelDomain, (sidePanel) =>
  sidePanel.get('contactAttributes')
);

const selectSearchableAttributes = createSelector(
  [selectLayout, selectAttributes],
  (layout, attributes) => {
    const searchableAttributes = [
      {
        id: 'all',
        label: {
          'en-US': 'All',
        },
        objectName: 'q', // Fuzzy search query parameter
      },
    ];
    if (typeof layout !== 'undefined' && typeof attributes !== 'undefined') {
      // don't panic, layout / attributes haven't loaded yet
      layout.get('layout').toJS().map((section) =>
        section.attributes.forEach((attributeId) => {
          if (
            searchableAttributes.indexOf(
              (searchableAttribute) => searchableAttribute.id === attributeId
            ) > -1
          ) {
            return;
          }
          const mappedAttribute = attributes.find(
            (attribute) => attribute.get('id') === attributeId
          );
          if (mappedAttribute !== undefined) {
            searchableAttributes.push(mappedAttribute.toJS());
          } else {
            throw new Error('Could not map attribute');
          }
        })
      );
    }
    return searchableAttributes;
  }
);

export {
  selectQuery,
  selectSearchableAttributes,
  selectAttributes,
  selectLayout,
};
