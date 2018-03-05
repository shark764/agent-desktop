/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';

import DesktopActionsButtons from '../index';

describe('<DesktopActionsButtons />', () => {
  describe('with the required props being passed in...', () => {
    it('should render the button as ENABLED as per the buttonConfig object', () => {
      const buttonConfig = [
        {
          id: 'hang-up-button',
          type: 'primaryRed',
          text: 'Hang Up',
          onClick: () => {},
          disabled: false,
        },
      ];

      const interaction = {
        interactionId: 'aaa',
        status: 'work-accepted',
      };

      const rendered = shallow(
        <DesktopActionsButtons
          interaction={interaction}
          buttonConfig={buttonConfig}
        />
      );

      expect(rendered).toMatchSnapshot();
    });

    it('should render the button as DISABLED as per the buttonConfig object', () => {
      const buttonConfig = [
        {
          id: 'wrapup-button',
          type: 'primaryRed',
          text: 'End Wrapup',
          onClick: () => {},
          disabled: true,
        },
      ];

      const interaction = {
        interactionId: 'aaa',
        status: 'wrapup',
      };

      const rendered = shallow(
        <DesktopActionsButtons
          interaction={interaction}
          buttonConfig={buttonConfig}
        />
      );

      expect(rendered).toMatchSnapshot();
    });
  });
});
