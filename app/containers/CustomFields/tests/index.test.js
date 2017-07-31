/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { mount } from 'enzyme';

import ContextProvider from 'containers/ContextProvider';
import { CustomFields } from '../index';

describe('<CustomFields />', () => {
  let customFields;
  beforeEach(() => {
    customFields = [
      {
        label: 'Test Label',
        value: 'Test Value',
      },
      {
        label: 'Test Label 2',
        value: 'Test Value 2',
      },
      {
        label: 'Test Label 3',
        value: 'Test Value 3',
      },
    ];
  });
  describe('Desktop mode', () => {
    it('should render correctly with 3 or less fields', () => {
      const rendered = mount(
        <ContextProvider>
          <CustomFields
            customFields={customFields}
            customFieldsCollapsed
            interactionId="mockId"
            toggleCustomFields={() => {}}
          />
        </ContextProvider>
      );
      expect(rendered).toMatchSnapshot();
    });

    it('should render correctly with between 3 and 6 fields', () => {
      customFields.push({ label: 'Test Label 4', value: 'Test Value 4' });
      const rendered = mount(
        <ContextProvider>
          <CustomFields
            customFields={customFields}
            customFieldsCollapsed
            interactionId="mockId"
            toggleCustomFields={() => {}}
          />
        </ContextProvider>
      );
      expect(rendered).toMatchSnapshot();
    });

    it('should render correctly with more than 6 fields', () => {
      customFields.push({ label: 'Test Label 4', value: 'Test Value 4' });
      customFields.push({ label: 'Test Label 5', value: 'Test Value 5' });
      customFields.push({ label: 'Test Label 6', value: 'Test Value 6' });
      customFields.push({ label: 'Test Label 7', value: 'Test Value 7' });
      const rendered = mount(
        <ContextProvider>
          <CustomFields
            customFields={customFields}
            customFieldsCollapsed
            interactionId="mockId"
            toggleCustomFields={() => {}}
          />
        </ContextProvider>
      );
      expect(rendered).toMatchSnapshot();
    });
  });
  describe('Toolbar mode', () => {
    beforeEach(() => {
      Object.defineProperty(window.location, 'href', {
        writable: true,
        value: 'https://dev-tb2.cxengagelabs.net/',
      });
    });
    it('should render correctly with 3 or less fields', () => {
      const rendered = mount(
        <ContextProvider>
          <CustomFields
            customFields={customFields}
            customFieldsCollapsed
            interactionId="mockId"
            toggleCustomFields={() => {}}
          />
        </ContextProvider>
      );
      expect(rendered).toMatchSnapshot();
    });

    it('should render correctly with more than 3 fields', () => {
      customFields.push({ label: 'Test Label 4', value: 'Test Value 4' });
      const rendered = mount(
        <ContextProvider>
          <CustomFields
            customFields={customFields}
            customFieldsCollapsed
            interactionId="mockId"
            toggleCustomFields={() => {}}
          />
        </ContextProvider>
      );
      expect(rendered).toMatchSnapshot();
    });
  });
});
