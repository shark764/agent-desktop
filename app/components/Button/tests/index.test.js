/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';

import Button, { possibleTypes } from '../index';

describe('<Button />', () => {
  possibleTypes.forEach((type) => {
    describe(`with type ${type}`, () => {
      it('should render correctly', () => {
        const rendered = shallow(
          <Button.WrappedComponent type={type} id="mockId" />
        );
        expect(rendered).toMatchSnapshot();
      });
    });
  });

  possibleTypes.forEach((type) => {
    describe(`with type ${type} and disabled`, () => {
      it('should render correctly', () => {
        const rendered = shallow(
          <Button.WrappedComponent type={type} id="mockId" disabled />
        );
        expect(rendered).toMatchSnapshot();
      });
    });
  });

  describe('when passed a border style', () => {
    it('should render correctly', () => {
      const rendered = shallow(
        <Button.WrappedComponent
          type="primaryBlue"
          id="mockId"
          style={{ borderTop: 'thick double #ff0000' }}
        />
      );
      expect(rendered).toMatchSnapshot();
    });
  });

  describe('when button is icon', () => {
    it('should render correctly', () => {
      const rendered = shallow(
        <Button.WrappedComponent
          type="primaryBlue"
          id="mockId"
          iconName="close"
        />
      );
      expect(rendered).toMatchSnapshot();
    });
  });

  describe('when passed text as a string', () => {
    it('should render correctly', () => {
      const rendered = shallow(
        <Button.WrappedComponent
          type="primaryBlue"
          id="mockId"
          text="testing!"
        />
      );
      expect(rendered).toMatchSnapshot();
    });
  });

  describe('when passed text as a obj', () => {
    it('should render correctly', () => {
      const rendered = shallow(
        <Button.WrappedComponent
          type="primaryBlue"
          id="mockId"
          text={{
            id: 'app.containers.PhoneControls.on',
            defaultMessage: 'ON',
          }}
        />
      );
      expect(rendered).toMatchSnapshot();
    });
  });

  describe('when passed mouseOverText and is hovered', () => {
    it('should render correctly', () => {
      const rendered = shallow(
        <Button.WrappedComponent
          type="primaryBlue"
          id="mockId"
          mouseOverText={{
            id: 'app.containers.PhoneControls.on',
            defaultMessage: 'ON',
          }}
        />
      );

      rendered.find('#mockId').simulate('MouseEnter');
      expect(rendered).toMatchSnapshot();
    });
  });

  describe('when it has children', () => {
    it('should render correctly', () => {
      const rendered = shallow(
        <Button.WrappedComponent type="primaryBlue" id="mockId">
          <div>Test!</div>
        </Button.WrappedComponent>
      );
      expect(rendered).toMatchSnapshot();
    });
  });

  describe('on MouseLeave and MouseEnter events', () => {
    it('state.mouseOver should update correctly', () => {
      const rendered = shallow(
        <Button.WrappedComponent type="primaryBlue" id="mockId" />
      );

      rendered.find('#mockId').simulate('MouseEnter');
      expect(rendered.state('mouseOver')).toBe(true);

      rendered.find('#mockId').simulate('MouseLeave');
      expect(rendered.state('mouseOver')).toBe(false);
    });
  });
});
