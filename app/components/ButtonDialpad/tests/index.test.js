import React from 'react';
import { shallow } from 'enzyme';

import ButtonDialpad, { possibleTypes } from '../index';

describe('<ButtonDialpad />', () => {
  possibleTypes.forEach((type) => {
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
