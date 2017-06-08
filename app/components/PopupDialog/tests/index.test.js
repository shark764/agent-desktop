/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';

import PopupDialog from '../index';

describe('<PopupDialog />', () => {
  describe('when given required props', () => {
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

  describe('when given required props and arrowLeftOffsetPx', () => {
    it('should render correctly', () => {
      const rendered = shallow(
        <PopupDialog
          id="mockId"
          isVisible
          hide={() => {}}
          widthPx={1}
          arrowLeftOffsetPx={5}
        >
          <p>Mock Child</p>
        </PopupDialog>
      );
      expect(rendered).toMatchSnapshot();
    });
  });
});
