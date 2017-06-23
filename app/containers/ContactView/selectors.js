/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import { createSelector } from 'reselect';

// SidePanel Domain Selectors
const selectSidePanelDomain = (state) => state.get('sidePanel');
const selectLayout = createSelector(selectSidePanelDomain, (sidePanel) =>
  sidePanel.get('contactLayout')
);
const selectAttributes = createSelector(selectSidePanelDomain, (sidePanel) =>
  sidePanel.get('contactAttributes').toJS()
);
const selectCompactLayoutSection = createSelector(
  selectSidePanelDomain,
  (sidePanel) => sidePanel.get('contactLayout').get('layout').get(0).toJS()
);
const selectPopulatedLayout = createSelector(
  [selectLayout, selectAttributes],
  (layout, attributes) =>
    layout.get('layout').toJS().map((section) =>
      Object.assign(section, {
        attributes: section.attributes.map((attributeId) => {
          const mappedAttribute = attributes.find(
            (attribute) => attribute.id === attributeId
          );
          if (mappedAttribute !== undefined) {
            return mappedAttribute;
          } else {
            throw new Error(`Could not map attribute ${attributeId}`);
          }
        }),
      })
    )
);
const selectPopulatedCompactAttributes = createSelector(
  [selectCompactLayoutSection, selectAttributes],
  (section, attributes) =>
    Object.assign(section, {
      attributes: section.attributes.map((attributeId) => {
        const mappedAttribute = attributes.find(
          (attribute) => attribute.id === attributeId
        );
        if (mappedAttribute !== undefined) {
          return mappedAttribute;
        } else {
          throw new Error('Could not map attribute');
        }
      }),
    })
);

export {
  selectAttributes,
  selectPopulatedLayout,
  selectPopulatedCompactAttributes,
};
