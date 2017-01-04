/*
 *
 * MainContentArea
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { selectSelectedInteraction } from './selectors';
import Radium from 'radium';

import messages from './messages';
import { FormattedMessage, FormattedTime } from 'react-intl';

export class MainContentArea extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.state = {
      messageText: '',
    };
    this.setMessageText = this.setMessageText.bind(this);
    this.endInteraction = this.endInteraction.bind(this);
    this.sendMessageOnEnter = this.sendMessageOnEnter.bind(this);
  }

  componentDidUpdate() {
    // Scroll to bottom of message history
    const messsageHistoryDiv = document.getElementById('message-history');
    if (messsageHistoryDiv) {
      messsageHistoryDiv.scrollTop = messsageHistoryDiv.scrollHeight;
    }
  }

  setMessageText(messageText) {
    this.setState({ messageText });
  }

  getMessagingContent() {
    const customFields = this.props.selectedInteraction.customFields.map((customField) =>
      <div key={customField.label + customField.value} style={{ display: 'inline-block', width: '50%' }}>
        <div style={{ color: '#979797', display: 'inline-block', width: '90px' }}>
          {customField.label}
        </div>
        <div style={{ display: 'inline-block', width: 'calc(100% - 90px)' }}>
          {customField.value}
        </div>
      </div>
    );

    const messageHistory = this.props.selectedInteraction.messageHistory.map((message) =>
      <div key={message.from + message.timestamp} style={{ marginBottom: '10px' }}>
        <span style={{ fontSize: '15px', fontWeight: 'bold' }}>
          {message.from}
        </span>
        <span style={{ fontSize: '12px', marginLeft: '7px' }}>
          <FormattedTime value={new Date(message.timestamp)} />
        </span>
        <div style={{ display: 'block', width: '100%', fontSize: '16px', whiteSpace: 'pre-wrap' }}>
          {message.text}
        </div>
      </div>
    );

    return (
      <div style={{ display: 'flex', flexFlow: 'column', backgroundColor: '#F3F3F3', height: '100%', padding: '5px' }}>
        <div style={{ flex: '0 1 auto', padding: '0 10px' }}>
          <div style={{ borderBottom: '1px solid #D0D0D0', padding: '10px 5px 15px' }}>
            <div style={{ width: 'calc(100% - 150px)', display: 'inline-block', fontSize: '20px', fontWeight: 'bold' }}>
              {this.props.selectedInteraction.messageHistory[0].from}
            </div>
            <button
              style={{ float: 'right', backgroundColor: '#FE4565', color: '#FFFFFF', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', padding: '8px 18px', borderRadius: '3px' }}
              onClick={this.endInteraction}
            >
              <FormattedMessage {...messages.endChat} />
            </button>
          </div>
          <div style={{ fontSize: '12px', padding: '10px' }}>
            {customFields}
          </div>
        </div>
        <div style={{ flex: '1 1 auto', display: 'flex', flexFlow: 'column', backgroundColor: '#FFFFFF', border: '1px solid #E4E4E4', padding: '17px 17px 9px' }}>
          <div id="message-history" style={{ flex: '1 1 auto', overflowY: 'auto' }}>
            {messageHistory}
          </div>
          <textarea
            style={{ flex: '0 1 36px', resize: 'none', borderRadius: '3px', border: '1px solid #23CEF5', boxShadow: '0 0 6px 0 rgba(0,0,0,0.07)' }}
            value={this.state.messageText}
            onChange={(e) => this.setMessageText(e.target.value)}
            onKeyPress={this.sendMessageOnEnter}
          />
        </div>
      </div>
    );
  }

  endInteraction() {
    SDK.Agent.Session.Messaging.workNotificationHandler({ interactionId: this.props.selectedInteraction.interactionId }, 'work-ended');
  }

  sendMessageOnEnter(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      SDK.Agent.Session.Messaging.sendMessage({
        message: this.state.messageText,
        interactionId: this.props.selectedInteraction.interactionId,
      });
      this.setMessageText('');
      return false;
    } else {
      return true;
    }
  }

  styles = {
    base: {
      boxShadow: '0 0 6px 1px rgba(0,0,0,0.3)',
      backgroundColor: '#051E24',
      color: '#4B4B4B',
    },
  };

  render() {
    let content;
    if (this.props.selectedInteraction) {
      content = this.getMessagingContent();
    }
    return (
      <div style={[this.styles.base, this.props.style]}>
        {content}
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  selectedInteraction: selectSelectedInteraction(state, props),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

MainContentArea.propTypes = {
  style: PropTypes.array,
  selectedInteraction: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(Radium(MainContentArea));
