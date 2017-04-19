import React from 'react';
import { shallow } from 'enzyme';

import Title from '../index';

describe('<Title />', () => {
  it('should render correctly', () => {
    const rendered = shallow(
      <Title
        id="mockId"
        text={{ id: 'app.containers.Login.welcome' }}
      />
    );
    expect(rendered).toMatchSnapshot();
  });
});
