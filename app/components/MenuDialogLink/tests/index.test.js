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
        />
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
        />
      );

      rendered.find('#mockId').simulate('click');
      expect(rendered.state('showDialog')).toBe(true);
      expect(rendered).toMatchSnapshot();
    });
  });
});
