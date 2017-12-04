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
        selectedInteraction={{ interactionId: 'a', status: 'work-accepted' }}
        messageTemplates={[]}
        initializeOutboundSmsFromMessaging={() => {}}
        sendOutboundSms={() => {}}
        saveMesssageState={() => {}}
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
        }}
        messageTemplates={[]}
        initializeOutboundSmsFromMessaging={() => {}}
        sendOutboundSms={() => {}}
        saveMesssageState={() => {}}
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
        }}
        messageTemplates={[]}
        initializeOutboundSmsFromMessaging={() => {}}
        sendOutboundSms={() => {}}
        saveMesssageState={() => {}}
      />
    );
    expect(rendered).toMatchSnapshot();
  });

  it('should render correctly under wrapup', () => {
    const rendered = shallow(
      <MessagingTextArea
        selectedInteraction={{ interactionId: 'a', status: 'wrapup' }}
        messageTemplates={[]}
        initializeOutboundSmsFromMessaging={() => {}}
        sendOutboundSms={() => {}}
        saveMesssageState={() => {}}
      />
    );
    expect(rendered).toMatchSnapshot();
  });

  it('should render correctly with message templates', () => {
    const rendered = shallow(
      <MessagingTextArea
        selectedInteraction={{ interactionId: 'a', status: 'work-accepted' }}
        messageTemplates={['Hello1', 'Hello2']}
        initializeOutboundSmsFromMessaging={() => {}}
        sendOutboundSms={() => {}}
        saveMesssageState={() => {}}
      />
    );
    expect(rendered).toMatchSnapshot();
  });
});
