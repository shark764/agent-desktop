import React from 'react';
import { shallow } from 'enzyme';

import IconSVG from '../index';

const names = [
  'dialpad',
  'loading',
  'loadingWhite',
  'add',
  'close',
];

describe('<IconSVG />', () => {
  names.forEach((name) => {
    describe(`with name ${name}`, () => {
      it('should render correctly', () => {
        const rendered = shallow(
          <IconSVG
            id="mockId"
            name={name}
          />
        );
        expect(rendered).toMatchSnapshot();
      });
    });
  });
});
