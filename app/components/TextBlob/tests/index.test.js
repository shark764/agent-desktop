import React from 'react';
import { shallow } from 'enzyme';

import TextBlob from '../index';

describe('<TextBlob />', () => {
  it('should render correctly', () => {
    const rendered = shallow(
      <TextBlob
        id="mockId"
        text="mockText"
      />
    );
    expect(rendered).toMatchSnapshot();
  });
});
