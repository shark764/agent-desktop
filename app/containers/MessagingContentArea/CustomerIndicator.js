import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { CheckedIconSVG, TypingIndicator } from 'cx-ui-components';

import { customerIsTyping, customerHasReadLastAgentMessage } from './selectors';
import messages from './messages';

const Wrapper = styled.div`
  height: 17px;
  padding-left: 40px;
  margin-bottom: 2px;
  color: #23cdf4;
  font-size: 14px;
  font-style: italic;
`;

const Message = styled.span`
  margin-left: 4px;
`;

const TypingIndicatorStyled = styled(TypingIndicator)`
  vertical-align: middle;
`;

const CheckedIcon = styled(CheckedIconSVG)`
  vertical-align: top;
`;

export const CustomerIndicator = ({ isTyping, hasRead }) => {
  if (isTyping) {
    return (
      <Wrapper id="customerIsTyping">
        <TypingIndicatorStyled />
        <Message>
          <FormattedMessage {...messages.customerIsTyping} />
        </Message>
      </Wrapper>
    );
  } else if (hasRead) {
    return (
      <Wrapper id="customerHasRead">
        <CheckedIcon size={13} />
        <Message>
          <FormattedMessage {...messages.customerViewed} />
        </Message>
      </Wrapper>
    );
  } else {
    return null;
  }
};

const mapStateToProps = (state, props) => ({
  isTyping: customerIsTyping(state, props),
  hasRead: customerHasReadLastAgentMessage(state, props),
});

export default connect(mapStateToProps)(CustomerIndicator);
