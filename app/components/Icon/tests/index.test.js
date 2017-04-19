import React from 'react';
import { shallow } from 'enzyme';

import Icon from '../index';

const availableIcons = [
  'config',
  'search',
  'close',
  'attachment',
  'message',
  'message_new',
  'message_dark',
  'email',
  'email_new',
  'email_dark',
  'voice',
  'voice_dark',
  'connected',
  'not_connected',
  'endCall',
  'mute',
  'hold',
  'transfer',
  'transfer_dark',
  'dialpad',
  'dialpad_dark',
  'arrow_up_down',
  'arrow_return',
];

describe('<Icon />', () => {
  availableIcons.forEach((name) => {
    describe(`with name ${name}`, () => {
      it('should render correctly', () => {
        const rendered = shallow(
          <Icon
            id="mockId"
            name={name}
          />
        );
        expect(rendered).toMatchSnapshot();
      });
    });
  });
});
