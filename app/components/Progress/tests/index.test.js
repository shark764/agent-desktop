import React from 'react';
import { shallow } from 'enzyme';

import Progress from '../index';

describe('<Progress />', () => {
  it('should render correctly', () => {
    const rendered = shallow(
      <Progress
        id="mockId"
        barColor="mockColour"
        start={0}
        finish={1}
      />
    );
    expect(rendered).toMatchSnapshot();
  });
});
