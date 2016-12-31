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

import Avatar from 'components/Avatar';

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
    const messageHistory = this.props.selectedInteraction.messageHistory.map((message) =>
      <div key={message.from + message.timestamp} style={{ marginBottom: '10px' }}>
        {
          message.type === 'system'
          ? <div style={{ fontSize: '16px', whiteSpace: 'pre', textAlign: 'center', color: '#999', padding: '0 25%' }}>
            {message.text}
          </div>
          : <div>
            <div style={{ display: 'inline-block', verticalAlign: 'top', width: '40px', paddingTop: '5px' }}>
              <Avatar customerAvatarIndex={message.type === 'agent' ? undefined : this.props.selectedInteraction.customerAvatarIndex} />
            </div>
            <div style={{ display: 'inline-block', width: 'calc(100% - 40px)' }}>
              <span style={{ fontSize: '15px', fontWeight: 'bold' }}>
                {message.from}
              </span>
              <span style={{ fontSize: '12px', marginLeft: '7px' }}>
                <FormattedTime value={new Date(message.timestamp)} />
              </span>
              <div style={{ fontSize: '16px', lineHeight: '20px', whiteSpace: 'pre' }}>
                {message.text}
              </div>
            </div>
          </div>
        }
      </div>
    );
    return (
      <div style={{ backgroundColor: '#F3F3F3', height: '100%', padding: '5px' }}>
        <div style={{ width: '100%', height: '60px', overflow: 'auto' }}>
          <div style={{ width: 'calc(100% - 150px)', display: 'inline-block', fontSize: '20px', fontWeight: 'bold', marginTop: '12px', marginLeft: '10px' }}>
            {this.props.selectedInteraction.messageHistory[0].from}
          </div>
          <button
            style={{ float: 'right', backgroundColor: '#FE4565', color: '#FFFFFF', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', margin: '11px 10px 0 0', padding: '8px 18px', borderRadius: '3px' }}
            onClick={this.endInteraction}
          >
            <FormattedMessage {...messages.endChat} />
          </button>
        </div>
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E4E4E4', height: 'calc(100% - 60px)', padding: '17px' }}>
          <div id="message-history" style={{ height: 'calc(100% - 36px)', overflowY: 'auto' }}>
            {messageHistory}
          </div>
          <textarea
            style={{ width: '100%', height: '36px', resize: 'none', borderRadius: '3px', border: '1px solid #23CEF5', boxShadow: '0 0 6px 0 rgba(0,0,0,0.07)' }}
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
