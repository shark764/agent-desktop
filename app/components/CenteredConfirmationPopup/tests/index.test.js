/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';

import { CenteredConfirmationPopup } from '../index';

describe('<CenteredConfirmationPopup />', () => {
  const loginConfig = {
    text: 'login',
    type: 'testButtonType',
    id: 'test123',
    callback: () => {},
  };

  const logoutConfig = {
    text: 'logout',
    type: 'testButtonType',
    id: 'test345',
    callback: () => {},
  };

  it('should render correctly with a password field', () => {
    const rendered = shallow(
      <CenteredConfirmationPopup
        displayPasswordField
        modalDescriptionText="Test description here"
        loginBtn={logoutConfig}
        logoutBtn={loginConfig}
      />
    );

    rendered.setState({ passwordVal: '' });
    expect(rendered).toMatchSnapshot();
  });

  it('should render correctly when a user types in the password field', () => {
    const rendered = shallow(
      <CenteredConfirmationPopup
        displayPasswordField
        modalDescriptionText="Test description here"
        loginBtn={{
          text: 'login',
          type: 'testButtonType',
          id: 'test123',
          callback: () => {},
        }}
        logoutBtn={{
          text: 'logout',
          type: 'testButtonType',
          id: 'test345',
          callback: () => {},
        }}
      />
    );

    rendered.setState({ passwordVal: 'testPassword' });
    expect(rendered).toMatchSnapshot();
  });

  it('should render as expected with no password field', () => {
    const rendered = shallow(
      <CenteredConfirmationPopup
        displayPasswordField={false}
        modalDescriptionText="Test description here"
        loginBtn={{
          text: 'login',
          type: 'testButtonType',
          id: 'test123',
          callback: () => {},
        }}
        logoutBtn={{
          text: 'logout',
          type: 'testButtonType',
          id: 'test345',
          callback: () => {},
        }}
      />
    );

    expect(rendered).toMatchSnapshot();
  });
});
