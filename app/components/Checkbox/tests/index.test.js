import React from 'react';
import { shallow } from 'enzyme';
import { getIntlContext } from 'utils/test';

import Checkbox from '../index';

describe('<Checkbox />', () => {
  describe('when given required props, intl, and text', () => {
    it('should render correctly', () => {
      const rendered = shallow(
        <Checkbox.WrappedComponent
          id="mockId"
          intl={getIntlContext()}
          checked
          text={'testing!'}
        />
      );
      expect(rendered).toMatchSnapshot();
    });
  });

  describe('when passed a text obj', () => {
    it('should render correctly', () => {
      const rendered = shallow(
        <Checkbox.WrappedComponent
          id="mockId"
          intl={getIntlContext()}
          checked
          text={{
            id: 'app.containers.PhoneControls.on',
            defaultMessage: 'ON',
          }}
        />
      );
      expect(rendered).toMatchSnapshot();
    });
  });

  describe('when no text is passed in', () => {
    it('should render correctly', () => {
      const rendered = shallow(
        <Checkbox.WrappedComponent
          id="mockId"
          checked
        />
      );
      expect(rendered).toMatchSnapshot();
    });
  });
});
