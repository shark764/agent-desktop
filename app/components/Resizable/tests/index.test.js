import React from 'react';
import { shallow } from 'enzyme';

import Resizable from '../index';

const directions = ['left', 'top'];

describe('<Resizable />', () => {
  directions.forEach((direction) => {
    describe(`with direction ${direction}`, () => {
      it('should render correctly', () => {
        const rendered = shallow(
          <Resizable
            id="mockId"
            direction={direction}
            isDisabled
            disabledPx={1}
            setPx={() => {}}
            px={2}
            minPx={3}
            maxPx={4}
          />
        );
        expect(rendered).toMatchSnapshot();
      });
    });
  });
});
