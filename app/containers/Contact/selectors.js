import { createSelector } from 'reselect';

/**
 * Direct selector to the state domain
 */
const selectSidePanelDomain = (state) => state.get('sidePanel');


/**
 * Other specific selectors
 */

const selectLayout = createSelector(
  selectSidePanelDomain,
  (sidePanel) => sidePanel.get('contactLayoutSections')
);
const selectAttributes = createSelector(
  selectSidePanelDomain,
  (sidePanel) => sidePanel.get('contactAttributes')
);
const selectCompactLayoutAttributes = createSelector(
  selectSidePanelDomain,
  (sidePanel) => sidePanel.get('compactLayoutAttributes')
);
const selectPopulatedLayout = createSelector(
  [selectLayout, selectAttributes],
  (layout, attributes) =>
    layout.toJS().map(
      (section) => Object.assign(section, {
        attributes: section.attributes.map(
          (attributeId) => attributes.find((attribute) => attribute.get('id') === attributeId).toJS()
        ),
      })
    )
);

const selectPopulatedCompactAttributes = createSelector(
  [selectAttributes, selectCompactLayoutAttributes],
  (attributes, compactLayoutAttributes) =>
    compactLayoutAttributes.map(
      (objectName) =>
        attributes.find(
          (attribute) =>
          attribute.get('objectName') === objectName
        )
    ).toJS().filter(
      (attribute) =>
      typeof attribute !== 'string'
    )
);


export {
  selectPopulatedLayout,
  selectPopulatedCompactAttributes,
};
