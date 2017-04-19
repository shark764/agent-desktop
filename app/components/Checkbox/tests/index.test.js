import React from 'react';
import { shallow } from 'enzyme';
import { getIntlContext } from 'utils/test';

import Checkbox from '../index';

describe('<Checkbox />', () => {
  it('should render correctly', () => {
    const rendered = shallow(
      <Checkbox.WrappedComponent
        id="mockId"
        intl={getIntlContext()}
        checked
      />
    );
    expect(rendered).toMatchSnapshot();
  });
});
