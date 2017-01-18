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
  (sidePanel) => sidePanel.get('contactLayout')
);
const selectAttributes = createSelector(
  selectSidePanelDomain,
  (sidePanel) => sidePanel.get('contactAttributes')
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

export {
  selectPopulatedLayout,
};
