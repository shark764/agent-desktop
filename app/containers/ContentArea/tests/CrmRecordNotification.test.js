/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';

import { CrmRecordNotification } from '../CrmRecordNotification';

describe('<CrmRecordNotification />', () => {
  it('should not render contactAssignedNotification = false', () => {
    const rendered = shallow(
      <CrmRecordNotification
        contactAssignedNotification={false}
        interactionId="mock-interaction-id"
        dismissContactWasAssignedNotification={() => {}}
        dismissContactWasUnassignedNotification={() => {}}
      />
    );
    expect(rendered).toMatchSnapshot();
  });
  it('should render when passed in valid contactAssignedNotification', () => {
    const rendered = shallow(
      <CrmRecordNotification
        contactAssignedNotification="contactWasAssigned"
        interactionId="mock-interaction-id"
        dismissContactWasAssignedNotification={() => {}}
        dismissContactWasUnassignedNotification={() => {}}
      />
    );
    expect(rendered).toMatchSnapshot();
  });
  it('should render noRecordLinked when passed in undefined contactAssignedNotification', () => {
    const rendered = shallow(
      <CrmRecordNotification
        interactionId="mock-interaction-id"
        dismissContactWasAssignedNotification={() => {}}
        dismissContactWasUnassignedNotification={() => {}}
      />
    );
    expect(rendered).toMatchSnapshot();
  });
});
