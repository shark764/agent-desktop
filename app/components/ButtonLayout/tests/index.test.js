/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';

import ButtonLayout from '../index';

const buttonConfig = [
  {
    id: 'test-id-1',
    type: 'primaryRed',
    text: {
      id: 'app.containers.EmailContentArea.send',
      defaultMessage: 'Send',
    },
    onClick: () => {},
    disabled: false,
    style: {
      marginRight: '8px',
    },
  },
  {
    id: 'test-id-2',
    type: 'primaryBlue',
    text: {
      id: 'app.containers.EmailContentArea.send',
      defaultMessage: 'Send',
    },
    onClick: () => {},
    disabled: false,
    style: {
      marginRight: '8px',
    },
    isMainBtn: true,
  },
];

describe('<ButtonLayout />', () => {
  describe('when only passed button config data and IS NOT set to toolbar mode', () => {
    it('should render correctly', () => {
      const rendered = shallow(<ButtonLayout buttonConfig={buttonConfig} />);
      expect(rendered).toMatchSnapshot();
    });
  });

  describe('when only passed button config data and IS set to toolbar mode', () => {
    it('should render correctly', () => {
      const rendered = shallow(<ButtonLayout buttonConfig={buttonConfig} />, {
        context: {},
      });

      rendered.setContext({ toolbarMode: true });
      expect(rendered).toMatchSnapshot();
    });
  });
});
