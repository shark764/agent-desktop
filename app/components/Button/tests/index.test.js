import React from 'react';
import { shallow } from 'enzyme';

import Button from '../index';

const possibleTypes = ['primaryBlue', 'primaryBlueBig', 'primaryRed', 'secondary'];

describe('<Button />', () => {
  possibleTypes.forEach((type) => {
    describe(`with type ${type}`, () => {
      it('should render correctly', () => {
        const rendered = shallow(<Button type={type} id="mockId" />);
        expect(rendered).toMatchSnapshot();
      });
    });
  });
});
