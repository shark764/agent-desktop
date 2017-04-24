import React from 'react';
import { shallow } from 'enzyme';

import ConfirmDialog from '../index';

describe('<ConfirmDialog />', () => {
  it('should render correctly', () => {
    const rendered = shallow(
      <ConfirmDialog
        id="mockId"
        isVisible
        leftAction={() => {}}
        rightAction={() => {}}
        hide={() => {}}
      />
    );
    expect(rendered).toMatchSnapshot();
  });
});
