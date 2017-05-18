import React from 'react';
import { shallow } from 'enzyme';

import ConfirmDialogLink from '../index';

describe('<ConfirmDialogLink />', () => {
  describe('when dialog not active', () => {
    it('should render correctly', () => {
      const rendered = shallow(
        <ConfirmDialogLink
          id="mockId"
          disabled={false}
          linkText="test link text"
          leftAction={() => {}}
          rightAction={() => {}}
        />
      );
      expect(rendered).toMatchSnapshot();
    });
  });

  describe('when A is clicked on', () => {
    it('should render correctly', () => {
      const rendered = shallow(
        <ConfirmDialogLink
          id="mockId"
          disabled={false}
          linkText="test link text"
          leftAction={() => {}}
          rightAction={() => {}}
        />
      );

      rendered.find('#mockId').simulate('click');
      expect(rendered.state('showConfirmDialog')).toBe(true);
      expect(rendered).toMatchSnapshot();
    });
  });
});
