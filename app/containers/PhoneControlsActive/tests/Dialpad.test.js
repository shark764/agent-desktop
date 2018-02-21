/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';

import { Dialpad } from '../Dialpad';

describe('<Dialpad />', () => {
  describe('activeExtensionIsNotPstn', () => {
    describe('on load', () => {
      const rendered = shallow(
        <Dialpad interactionId="mock-interaction-id" activeExtensionIsNotPstn />
      );
      it('renders the icon', () => {
        expect(rendered).toMatchSnapshot();
      });
    });

    describe('clicking the icon', () => {
      const rendered = shallow(
        <Dialpad interactionId="mock-interaction-id" activeExtensionIsNotPstn />
      );
      rendered.find('#dialpadButton').simulate('click');
      it('renders the icon and DialpadComponent', () => {
        expect(rendered).toMatchSnapshot();
      });
    });
  });

  describe('activeExtensionIsNotPstn is false', () => {
    const rendered = shallow(
      <Dialpad
        interactionId="mock-interaction-id"
        activeExtensionIsNotPstn={false}
      />
    );
    it('renders nothing', () => {
      expect(rendered).toMatchSnapshot();
    });
  });
});
