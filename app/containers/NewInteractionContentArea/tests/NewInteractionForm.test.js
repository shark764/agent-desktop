/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';

import { NewInteractionForm } from '../NewInteractionForm';

describe('<NewInteractionForm />', () => {
  it('should render correctly', () => {
    const rendered = shallow(
      <NewInteractionForm input="" setNewInteractionPanelFormInput={() => {}} />
    );
    expect(rendered).toMatchSnapshot();
  });
  describe('when a uri object is passed in', () => {
    it("should render the uri object's name", () => {
      const rendered = shallow(
        <NewInteractionForm
          input=""
          setNewInteractionPanelFormInput={() => {}}
          uriObject={{ objectName: 'mock name' }}
        />
      );
      expect(rendered).toMatchSnapshot();
    });
  });
});
