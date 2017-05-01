import React from 'react';
import { shallow } from 'enzyme';

import ContactInput from '../index';

describe('<ContactInput />', () => {
  it('should render correctly', () => {
    const rendered = shallow(
      <ContactInput
        id="mockId"
        showErrors={{}}
        attribute={{ label: { 'en-US': 'mock' }, objectName: 'mock' }}
        errors={{}}
        isEditing
        formInput="mock"
        handleInputClear={() => {}}
        handleOnBlur={() => {}}
        handleInputChange={() => {}}
        intl={{ locale: 'en-US' }}
        contact={{}}
        isReady
        hasVoiceInteraction
        pendingOutbound
        attemptCall={() => {}}
        formatValue={() => {}}
        smsInteractionNumbers={[]}
      />
    );
    expect(rendered).toMatchSnapshot();
  });
});
