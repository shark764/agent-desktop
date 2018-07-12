/*
 * Copyright © 2015-2018 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';

import { DirectionRow } from '../DirectionRow';

describe('<DirectionRow>', () => {
  beforeEach(() => {
    global.CxEngage = {
      session: {
        setDirection: jest.fn(),
      },
    };
  });
  describe('with true isSelectedDirection', () => {
    const mockSetCollapsibleMenu = jest.fn();
    const rendered = shallow(
      <DirectionRow
        style={{ mockStyle: 'mock style value' }}
        direction="inbound"
        isSelectedDirection
        setCollapsibleMenus={mockSetCollapsibleMenu}
      />
    );
    it('renders correctly, with checkmark', () => {
      expect(rendered).toMatchSnapshot();
    });
    it('does nothing on click', () => {
      rendered.find('#agentDirectionInbound').simulate('click');
      expect(global.CxEngage.session.setDirection.mock.calls.length).toBe(0);
      expect(mockSetCollapsibleMenu.mock.calls.length).toBe(0);
    });
  });
  describe('with false isSelectedDirection', () => {
    const mockSetCollapsibleMenu = jest.fn();
    const rendered = shallow(
      <DirectionRow
        style={{ mockStyle: 'mock style value' }}
        direction="inbound"
        isSelectedDirection={false}
        setCollapsibleMenus={mockSetCollapsibleMenu}
      />
    );
    it('renders correctly, without checkmark', () => {
      expect(rendered).toMatchSnapshot();
    });
    it('calls SDK and setCollapsibleMenus on click', () => {
      rendered.find('#agentDirectionInbound').simulate('click');
      expect(global.CxEngage.session.setDirection.mock.calls.length).toBe(1);
      expect(global.CxEngage.session.setDirection.mock.calls[0][0]).toEqual({
        direction: 'inbound',
      });
      expect(mockSetCollapsibleMenu.mock.calls.length).toBe(1);
    });
  });
});
