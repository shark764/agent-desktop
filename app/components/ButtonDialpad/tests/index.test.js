import React from 'react';
import { shallow } from 'enzyme';

import ButtonDialpad from '../index';

const types = ['topLeft', 'top', 'topRight', 'left', 'right', 'bottomLeft', 'bottom', 'bottomRight', 'middle'];

describe('<ButtonDialpad />', () => {
  types.forEach((type) => {
    describe(`with type ${type}`, () => {
      it('should render correctly', () => {
        const rendered = shallow(
          <ButtonDialpad
            id="mockId"
            text="mockText"
            onClick={() => {}}
            type={type}
          />
        );
        expect(rendered).toMatchSnapshot();
      });
    });
  });
});
