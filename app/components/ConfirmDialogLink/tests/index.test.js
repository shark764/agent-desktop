import React from 'react';
import { shallow } from 'enzyme';

import ConfirmDialogLink from '../index';

describe('<ConfirmDialogLink />', () => {
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
