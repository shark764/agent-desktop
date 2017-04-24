import React from 'react';
import { shallow } from 'enzyme';

import PopupDialog from '../index';

describe('<PopupDialog />', () => {
  it('should render correctly', () => {
    const rendered = shallow(
      <PopupDialog
        id="mockId"
        isVisible
        hide={() => {}}
        widthPx={1}
      >
        <p>Mock Child</p>
      </PopupDialog>
    );
    expect(rendered).toMatchSnapshot();
  });
});
