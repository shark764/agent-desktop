/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import { fromJS } from 'immutable';

import {
  selectPopulatedLayout,
  selectPopulatedCompactAttributes,
  selectAttributes,
} from '../selectors';

// SidePanel Domain Selectors
describe('selectPopulatedLayout', () => {
  it('should return the Layout with attributes populated', () => {
    const mockState = fromJS({
      sidePanel: {
        contactLayout: {
          layout: [
            { attributes: ['mockAttributeIdOne', 'mockAttributeIdTwo'] },
            { attributes: ['mockAttributeIdThree'] },
          ],
        },
        contactAttributes: [
          { id: 'mockAttributeIdOne' },
          { id: 'mockAttributeIdTwo' },
          { id: 'mockAttributeIdThree' },
        ],
      },
    });

    expect(selectPopulatedLayout(mockState)).toMatchSnapshot();
  });
});

describe('selectPopulatedCompactAttributes', () => {
  it('should return the first section of the layout with attributes populated from attributes', () => {
    const mockState = fromJS({
      sidePanel: {
        contactLayout: {
          layout: [
            { attributes: ['mockAttributeIdOne', 'mockAttributeIdTwo'] },
            { attributes: ['mockAttributeIdThree'] },
          ],
        },
        contactAttributes: [
          { id: 'mockAttributeIdOne' },
          { id: 'mockAttributeIdTwo' },
          { id: 'mockAttributeIdThree' },
        ],
      },
    });

    expect(selectPopulatedCompactAttributes(mockState)).toMatchSnapshot();
  });
});

describe('selectAttributes', () => {
  it('should return the  attributes from the SidePanel domain', () => {
    const mockState = fromJS({
      sidePanel: {
        contactAttributes: ['mockContactAttribute'],
      },
    });

    expect(selectAttributes(mockState)).toMatchSnapshot();
  });
});
