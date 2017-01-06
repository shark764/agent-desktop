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

import moment from 'moment';
import 'medium-draft/lib/index.css';
import {
  Editor,
} from 'medium-draft';
import {
  EditorState,
} from 'draft-js';
import { stateFromHTML } from 'draft-js-import-html';
// import { stateToHTML } from 'draft-js-export-html';

import Avatar from 'components/Avatar';

export class MainContentArea extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.state = {
      messageText: '',
    };
    this.onChange = (editorState) => {
      // TODO use stateToHTML() to get HTML from text editor
      // console.log('Rich text HTML: ', stateToHTML(editorState.getCurrentContent()));
      this.setState({ editorState });
    };
    this.setMessageText = this.setMessageText.bind(this);
    this.endInteraction = this.endInteraction.bind(this);
    this.onEmailCreateReply = this.onEmailCreateReply.bind(this);
    this.sendMessageOnEnter = this.sendMessageOnEnter.bind(this);
  }

  componentDidUpdate() {
    // Scroll to bottom of message history
    const messsageHistoryDiv = document.getElementById('message-history');
    if (messsageHistoryDiv) {
      messsageHistoryDiv.scrollTop = messsageHistoryDiv.scrollHeight;
    }
  }

  onEmailCreateReply() {
    const timestampFormatted = moment(this.props.selectedInteraction.email.timestamp).format('LL');
    const emailReplyContent = `<p><br></p><p><br></p><p>On ${timestampFormatted} ${this.props.selectedInteraction.email.from} wrote:</p><blockquote>${this.props.selectedInteraction.email.content}</blockquote>`;
    this.setState({
      editorState: EditorState.createWithContent(stateFromHTML(emailReplyContent)),
    });
    this.props.emailCreateReply(this.props.selectedInteraction.interactionId);
  }

  setMessageText(messageText) {
    this.setState({ messageText });
  }

  getMessagingContent() {
    let from;
    let buttons;
    let details;
    let content;

    if (this.props.selectedInteraction.channelType === 'messaging' || this.props.selectedInteraction.channelType === 'sms') {
      from = this.props.selectedInteraction.messageHistory[0].from;

      details = this.props.selectedInteraction.customFields.map((customField) =>
        <div key={customField.label + customField.value} style={{ display: 'inline-block', width: '50%' }}>
          <div style={{ color: '#979797', display: 'inline-block', width: '90px' }}>
            {customField.label}
          </div>
          <div style={{ display: 'inline-block', width: 'calc(100% - 90px)' }}>
            {customField.value}
          </div>
        </div>
      );

      buttons = (
        <button
          style={{ float: 'right', backgroundColor: '#FE4565', color: '#FFFFFF', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', padding: '8px 18px', borderRadius: '3px' }}
          onClick={this.endInteraction}
        >
          <FormattedMessage {...messages.endChat} />
        </button>
      );

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
      content = (
        <div style={{ display: 'flex', flexFlow: 'column', position: 'absolute', height: '100%', width: '100%', padding: '17px 17px 9px' }}>
          <div id="message-history" style={{ flex: '1 1 auto', overflowY: 'auto' }}>
            {messageHistory}
          </div>
          <textarea
            style={{ flex: '0 1 36px', minHeight: '36px', resize: 'none', borderRadius: '3px', border: '1px solid #23CEF5', boxShadow: '0 0 6px 0 rgba(0,0,0,0.07)' }}
            value={this.state.messageText}
            onChange={(e) => this.setMessageText(e.target.value)}
            onKeyPress={this.sendMessageOnEnter}
          />
        </div>
      );
    } else if (this.props.selectedInteraction.channelType === 'email') {
      from = this.props.selectedInteraction.email.from;

      if (!this.props.selectedInteraction.email.reply) {
        buttons = (
          <button
            style={{ backgroundColor: '#23CEF5', color: '#FFFFFF', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', padding: '8px 18px', borderRadius: '3px' }}
            onClick={this.onEmailCreateReply}
          >
            <FormattedMessage {...messages.reply} />
          </button>
        );

        details = (
          <div>
            <div>
              <div style={{ color: '#979797', display: 'inline-block', width: '90px' }}>
                <FormattedMessage {...messages.to} />
              </div>
              <div style={{ display: 'inline-block', width: 'calc(100% - 90px)' }}>
                {this.props.selectedInteraction.email.to}
              </div>
            </div>
            <div>
              <div style={{ color: '#979797', display: 'inline-block', width: '90px' }}>
                <FormattedMessage {...messages.subject} />
              </div>
              <div style={{ display: 'inline-block', width: 'calc(100% - 90px)' }}>
                {this.props.selectedInteraction.email.subject}
              </div>
            </div>
          </div>
        );

        content = (
          <div style={{ padding: '19px 23px', whiteSpace: 'pre-wrap' }} dangerouslySetInnerHTML={{ __html: this.props.selectedInteraction.email.content }} /> // eslint-disable-line react/no-danger
        );
      } else {
        buttons = (
          <div style={{ width: '160px' }}>
            <button
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #979797', color: '#4B4B4B', cursor: 'pointer', fontSize: '13px', padding: '8px 18px', borderRadius: '3px', marginRight: '5px' }}
              onClick={() => this.props.emailCancelReply(this.props.selectedInteraction.interactionId)}
            >
              <FormattedMessage {...messages.cancel} />
            </button>
            <button
              style={{ backgroundColor: '#FE4565', color: '#FFFFFF', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', padding: '8px 18px', borderRadius: '3px' }}
            >
              <FormattedMessage {...messages.send} />
            </button>
          </div>
        );
        // TODO send onClick

        details = (
          <div>
            <div>
              <div style={{ color: '#979797', display: 'inline-block', width: '90px' }}>
                <FormattedMessage {...messages.to} />
              </div>
              <div style={{ display: 'inline-block', width: 'calc(100% - 90px)' }}>
                {this.props.selectedInteraction.email.reply.to}
              </div>
            </div>
            <div>
              <div style={{ color: '#979797', display: 'inline-block', width: '90px' }}>
                <FormattedMessage {...messages.subject} />
              </div>
              <div style={{ display: 'inline-block', width: 'calc(100% - 90px)' }}>
                {this.props.selectedInteraction.email.reply.subject}
              </div>
            </div>
          </div>
        );

        const { editorState } = this.state;
        content = (
          <div style={{ position: 'absolute', height: '100%', width: '100%', overflowY: 'auto', paddingTop: '15px' }}>
            <Editor
              editorState={editorState}
              onChange={this.onChange}
            />
          </div>
        );
      }
    }

    return (
      <div style={{ display: 'flex', flexFlow: 'column', backgroundColor: '#F3F3F3', height: '100%', padding: '5px' }}>
        <div style={{ flex: '0 1 auto', padding: '0 10px' }}>
          <div style={{ borderBottom: '1px solid #D0D0D0', padding: '10px 5px 15px' }}>
            <div style={{ width: 'calc(100% - 160px)', display: 'inline-block', fontSize: '20px', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {from}
            </div>
            <div style={{ float: 'right' }}>
              {buttons}
            </div>
          </div>
          <div style={{ fontSize: '12px', padding: '10px' }}>
            {details}
          </div>
        </div>
        <div style={{ flex: '1 1 auto', position: 'relative', backgroundColor: '#FFFFFF', border: '1px solid #E4E4E4' }}>
          {content}
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
      borderRight: '1px solid #D0D0D0',
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
  emailCreateReply: PropTypes.func.isRequired,
  emailCancelReply: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Radium(MainContentArea));
