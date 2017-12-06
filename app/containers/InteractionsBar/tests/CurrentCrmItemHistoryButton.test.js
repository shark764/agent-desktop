/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { fromJS } from 'immutable';
import { shallow } from 'enzyme';
import { getIntlContext } from 'utils/test';

import { CurrentCrmItemHistoryButton } from '../CurrentCrmItemHistoryButton';

describe('<CurrentCrmItemHistoryButton />', () => {
  it('should render correctly', () => {
    const rendered = shallow(
      <CurrentCrmItemHistoryButton
        intl={getIntlContext()}
        crmActiveTab={fromJS({
          contact: {
            id: 123,
            type: 'user',
            attributes: {
              name: 'test-name',
            },
          },
        })}
        selectedInteractionId="current-crm-item-history"
        showCurrentCrmItemHistoryButton
        selectInteraction={() => {}}
      />
    );
    expect(rendered).toMatchSnapshot();
  });
});
