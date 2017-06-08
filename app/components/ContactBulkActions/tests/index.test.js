/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';

import ContactBulkActions from '../index';

describe('<ContactBulkActions />', () => {
  it('should render correctly', () => {
    const rendered = shallow(
      <ContactBulkActions
        id="mockId"
        selectedContacts={[{}, {}]}
        deleteContacts={() => null}
        confirmingDelete={false}
      />
    );
    expect(rendered).toMatchSnapshot();
  });
});
