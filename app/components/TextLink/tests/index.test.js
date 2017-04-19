import React from 'react';
import { shallow } from 'enzyme';

import TextLink from '../index';

describe('<TextLink />', () => {
  it('should render correctly', () => {
    const rendered = shallow(
      <TextLink
        id="mockId"
        link="mockLink"
        text="mockText"
      />
    );
    expect(rendered).toMatchSnapshot();
  });
});
