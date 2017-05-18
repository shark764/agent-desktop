import React from 'react';
import { shallow } from 'enzyme';

import A from '../index';

describe('<A />', () => {
  describe('when not disabled', () => {
    it('should render correctly', () => {
      const rendered = shallow(<A id="mockId" text="mockText" onClick={() => {}} />);
      expect(rendered).toMatchSnapshot();
    });
  });

  describe('when passed disabled', () => {
    it('should render correctly', () => {
      const rendered = shallow(<A id="mockId" text="mockText" onClick={() => {}} disabled />);
      expect(rendered).toMatchSnapshot();
    });
  });
});
