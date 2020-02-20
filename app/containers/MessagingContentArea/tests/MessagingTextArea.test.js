/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';

import { MessagingTextArea } from '../MessagingTextArea';

describe('<MessagingTextArea />', () => {
  it('should render correctly under work-accepted', () => {
    const rendered = shallow(
      <MessagingTextArea
        selectedInteraction={{
          interactionId: 'a',
          status: 'work-accepted',
          currentMessage: '',
        }}
        messageTemplates={[]}
        initializeOutboundSmsFromMessaging={() => {}}
        sendOutboundSms={() => {}}
        saveMessageState={() => {}}
        setCustomerRead={() => {}}
        setMessageTemplateFilter={() => {}}
        setMessageTemplateIndex={() => {}}
        sendSmoochMessage={() => {}}
      />
    );
    expect(rendered).toMatchSnapshot();
  });

  it('should render correctly under connecting-to-outbound', () => {
    const rendered = shallow(
      <MessagingTextArea
        selectedInteraction={{
          interactionId: 'a',
          status: 'connecting-to-outbound',
          currentMessage: '',
        }}
        messageTemplates={[]}
        initializeOutboundSmsFromMessaging={() => {}}
        sendOutboundSms={() => {}}
        saveMessageState={() => {}}
        setCustomerRead={() => {}}
        setMessageTemplateFilter={() => {}}
        setMessageTemplateIndex={() => {}}
        sendSmoochMessage={() => {}}
      />
    );
    expect(rendered).toMatchSnapshot();
  });

  it('should render correctly under initialized-outbound', () => {
    const rendered = shallow(
      <MessagingTextArea
        selectedInteraction={{
          interactionId: 'a',
          status: 'initialized-outbound',
          currentMessage: '',
        }}
        messageTemplates={[]}
        initializeOutboundSmsFromMessaging={() => {}}
        sendOutboundSms={() => {}}
        saveMessageState={() => {}}
        setCustomerRead={() => {}}
        setMessageTemplateFilter={() => {}}
        setMessageTemplateIndex={() => {}}
        sendSmoochMessage={() => {}}
      />
    );
    expect(rendered).toMatchSnapshot();
  });

  it('should render correctly with message templates', () => {
    const rendered = shallow(
      <MessagingTextArea
        selectedInteraction={{
          interactionId: 'a',
          status: 'work-accepted',
          currentMessage: '',
        }}
        messageTemplates={['Hello1', 'Hello2']}
        initializeOutboundSmsFromMessaging={() => {}}
        sendOutboundSms={() => {}}
        saveMessageState={() => {}}
        setCustomerRead={() => {}}
        setMessageTemplateFilter={() => {}}
        setMessageTemplateIndex={() => {}}
        sendSmoochMessage={() => {}}
      />
    );
    expect(rendered).toMatchSnapshot();
  });
});
