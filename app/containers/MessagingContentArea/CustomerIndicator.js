import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import CheckedIconSVG from 'components/CheckedIconSVG';
import TypingIndicator from 'components/TypingIndicator';

import { customerIsTyping, customerHasReadLastAgentMessage } from './selectors';
import messages from './messages';

const Wrapper = styled.div`
  height: 17px;
  padding-left: 40px;
  margin-bottom: 2px;
  color: #23cdf4;
  font-size: 14px;
  font-style: italic;
  background-color: white;
  z-index: 1;
  width: calc(100% - 20px);
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
    return <Wrapper id="noCustomerIndicator" />;
  }
};

const mapStateToProps = (state, props) => ({
  isTyping: customerIsTyping(state, props),
  hasRead: customerHasReadLastAgentMessage(state, props),
});

export default connect(mapStateToProps)(CustomerIndicator);
