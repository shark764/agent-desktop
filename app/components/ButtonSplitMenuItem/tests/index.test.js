/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';

import { ButtonSplitMenuItem } from '../index';

describe('<ButtonSplitMenuItem />', () => {

  const mockFunc = jest.fn();
  const mockText = {
    id: 'app.containers.ContentAreaTop.wrapupOn',
    defaultMessage: 'Wrap Up On',
  }

  describe('when passed required properties', () => {
    it('should render correctly', () => {
      const rendered = shallow(
        <ButtonSplitMenuItem
          id="mockId"
          clickCallback={mockFunc}
          hideSubMenu={mockFunc}
          text={mockText}
        />
      );
      expect(rendered).toMatchSnapshot();
    });

    describe('when submenu button is clicked', () => {
      it('it should fire the onClick function', () => {
        const rendered = shallow(
          <ButtonSplitMenuItem
            id="mockId"
            clickCallback={mockFunc}
            hideSubMenu={mockFunc}
            text={mockText}
          />
        );

        rendered.find('li').simulate('click');
        expect(mockFunc).toBeCalled();
      });
    });
  });
});
