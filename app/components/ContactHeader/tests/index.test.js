import React from 'react';
import { shallow } from 'enzyme';

import ContactHeader from '../index';

describe('<ContactHeader />', () => {
  it('should render correctly', () => {
    const rendered = shallow(
      <ContactHeader
        id="mockId"
        selectedInteraction={{}}
        query={[]}
      />
    );
    expect(rendered).toMatchSnapshot();
  });
});
