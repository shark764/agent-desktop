import React from 'react';
import { shallow } from 'enzyme';
import { getIntlContext } from 'utils/test';

import Interaction from '../index';

describe('<Interaction />', () => {
  it('should render correctly', () => {
    const rendered = shallow(
      <Interaction.WrappedComponent
        id="mockId"
        status="pending"
        awaitingDisposition
        icon="config"
        intl={getIntlContext()}
      />
    );
    expect(rendered).toMatchSnapshot();
  });
});
