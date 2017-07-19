/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';

import CircleIconButton from '../index';

describe('<CircleIconButton />', () => {
  it('should render correctly', () => {
    const rendered = shallow(
      <CircleIconButton id="mockId" name="config" onClick={() => {}} />
    );
    expect(rendered).toMatchSnapshot();
  });

  it('should correctly render HTML (or a component) that was inserted inside of the component using the innerElement prop', () => {
    const testInnerElement = <div>Inner Element</div>;
    const rendered = shallow(
      <CircleIconButton
        id="mockId"
        name="config"
        onClick={() => {}}
        innerElement={testInnerElement}
      />
    );
    expect(rendered).toMatchSnapshot();
  });
});
