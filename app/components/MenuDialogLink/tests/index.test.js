/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';

import MenuDialogLink from '../index';

describe('<MenuDialogLink />', () => {
  describe('when dialog not active', () => {
    it('should render correctly', () => {
      const rendered = shallow(
        <MenuDialogLink
          id="mockId"
          disabled={false}
          linkText="test link text"
          options={[
            {
              message: {
                id: 'app.mockId',
                defaultMessage: 'Testing',
              },
              action: () => {},
            },
          ]}
        >
          <div>
mock element
          </div>
        </MenuDialogLink>
      );
      expect(rendered).toMatchSnapshot();
    });
  });

  describe('when A is clicked on', () => {
    it('should render correctly', () => {
      const rendered = shallow(
        <MenuDialogLink
          id="mockId"
          disabled={false}
          linkText="test link text"
          options={[
            {
              message: {
                id: 'app.mockId',
                defaultMessage: 'Testing',
              },
              action: () => {},
            },
          ]}
        >
          <div>
mock element
          </div>
        </MenuDialogLink>
      );

      rendered.find('#mockId').simulate('click');
      expect(rendered.state('showDialog')).toBe(true);
      expect(rendered).toMatchSnapshot();
    });
  });
});
