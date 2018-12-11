/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';
import { getIntlContext } from 'utils/test';
import CircleIconButton from '../index';

describe('<CircleIconButton />', () => {
  it('should render correctly when title attribute is a string', () => {
    const rendered = shallow(
      <CircleIconButton.WrappedComponent
        id="mockId"
        name="config"
        title="mockTitle"
        onClick={() => {}}
      />
    );
    expect(rendered).toMatchSnapshot();
  });

  it('should render correctly when title attribute is an object', () => {
    const rendered = shallow(
      <CircleIconButton.WrappedComponent
        id="mockId"
        name="config"
        intl={getIntlContext()}
        title={{
          id: 'app.containers.PhoneControls.endCall',
          defaultMessage: 'End Call',
        }}
        onClick={() => {}}
      />
    );
    expect(rendered).toMatchSnapshot();
  });

  it('should correctly render HTML (or a component) that was inserted inside of the component using the innerElement prop', () => {
    const testInnerElement = (
      <div>
        {'Inner Element'}
      </div>
    );
    const rendered = shallow(
      <CircleIconButton.WrappedComponent
        id="mockId"
        name="config"
        onClick={() => {}}
        innerElement={testInnerElement}
      />
    );
    expect(rendered).toMatchSnapshot();
  });

  it('should correctly render IconSVG when loading is true', () => {
    const rendered = shallow(
      <CircleIconButton.WrappedComponent
        id="mockId"
        name="config"
        onClick={() => {}}
        loading
      />
    );
    expect(rendered).toMatchSnapshot();
  });
});
