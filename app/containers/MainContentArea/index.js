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
import Button from 'components/Button';

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
        <div key={customField.label + customField.value} style={this.styles.customField}>
          <div style={this.styles.customFieldLabel}>
            {customField.label}
          </div>
          <div style={this.styles.customFieldValue}>
            {customField.value}
          </div>
        </div>
      );

      buttons = (
        <Button
          type="primaryBlue"
          text={messages.endChat}
          onClick={this.endInteraction}
        />
      );

      const messageHistory = this.props.selectedInteraction.messageHistory.map((message) =>
        <div key={message.from + message.timestamp} style={this.styles.messageHistoryItem}>
          {
            message.type === 'system'
            ? <span style={this.styles.systemMessage}>
              {message.text}
            </span>
            : <div>
              <div style={this.styles.avatarContainer}>
                <Avatar customerAvatarIndex={message.type === 'agent' ? undefined : this.props.selectedInteraction.customerAvatarIndex} />
              </div>
              <div style={this.styles.messageContainer}>
                <span style={this.styles.messageFrom}>
                  {message.from}
                </span>
                <span style={this.styles.messageTime}>
                  <FormattedTime value={new Date(message.timestamp)} />
                </span>
                <div style={this.styles.messageText}>
                  {message.text}
                </div>
              </div>
            </div>
          }
        </div>
      );
      content = (
        <div style={this.styles.messagingContainer}>
          <div id="message-history" style={this.styles.messageHistory}>
            {messageHistory}
          </div>
          <textarea
            style={this.styles.messageTextarea}
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
          <Button
            type="primaryBlue"
            text={messages.reply}
            onClick={this.onEmailCreateReply}
          />
        );

        details = (
          <div>
            <div>
              <div style={this.styles.detailsField}>
                <FormattedMessage {...messages.to} />
              </div>
              <div style={this.styles.detailsValue}>
                {this.props.selectedInteraction.email.to}
              </div>
            </div>
            <div>
              <div style={this.styles.detailsField}>
                <FormattedMessage {...messages.subject} />
              </div>
              <div style={this.styles.detailsValue}>
                {this.props.selectedInteraction.email.subject}
              </div>
            </div>
          </div>
        );

        content = (
          <div style={this.styles.emailContent} dangerouslySetInnerHTML={{ __html: this.props.selectedInteraction.email.content }} /> // eslint-disable-line react/no-danger
        );
      } else {
        buttons = (
          <div style={this.styles.replyButtons}>
            <Button
              type="secondary"
              style={{ marginRight: '5px' }}
              text={messages.cancel}
              onClick={() => this.props.emailCancelReply(this.props.selectedInteraction.interactionId)}
            />
            <Button
              type="primaryRed"
              text={messages.send}
            />
          </div>
        );
        // TODO send onClick

        details = (
          <div>
            <div>
              <div style={this.styles.detailsField}>
                <FormattedMessage {...messages.to} />
              </div>
              <div style={this.styles.detailsValue}>
                {this.props.selectedInteraction.email.reply.to}
              </div>
            </div>
            <div>
              <div style={this.styles.detailsField}>
                <FormattedMessage {...messages.subject} />
              </div>
              <div style={this.styles.detailsValue}>
                {this.props.selectedInteraction.email.reply.subject}
              </div>
            </div>
          </div>
        );

        const { editorState } = this.state;
        content = (
          <div style={this.styles.richTextEditorContainer}>
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
    // Messaging styles
    customField: {
      display: 'inline-block',
      width: '50%',
    },
    customFieldLabel: {
      color: '#979797',
      display: 'inline-block',
      width: '90px',
    },
    customFieldValue: {
      display: 'inline-block',
      width: 'calc(100% - 90px)',
    },
    messageHistoryItem: {
      marginBottom: '10px',
    },
    systemMessage: {
      fontSize: '16px',
      whiteSpace: 'pre-wrap',
      textAlign: 'center',
      color: '#999',
      display: 'inline-block',
      width: '50%',
      margin: '0 25%',
    },
    avatarContainer: {
      display: 'inline-block',
      verticalAlign: 'top',
      width: '40px',
      paddingTop: '5px',
    },
    messageContainer: {
      display: 'inline-block',
      width: 'calc(100% - 40px)',
    },
    messageFrom: {
      fontSize: '15px',
      fontWeight: 'bold',
    },
    messageTime: {
      fontSize: '12px',
      marginLeft: '7px',
    },
    messageText: {
      fontSize: '16px',
      lineHeight: '20px',
      whiteSpace: 'pre-wrap',
    },
    messagingContainer: {
      display: 'flex',
      flexFlow: 'column',
      position: 'absolute',
      height: '100%',
      width: '100%',
      padding: '17px 17px 9px',
    },
    messageHistory: {
      flex: '1 1 auto',
      overflowY: 'auto',
    },
    messageTextarea: {
      flex: '0 1 36px',
      minHeight: '36px',
      resize: 'none',
      borderRadius: '3px',
      border: '1px solid #23CEF5',
      boxShadow: '0 0 6px 0 rgba(0,0,0,0.07)',
    },
    // Email styles
    detailsField: {
      color: '#979797',
      display: 'inline-block',
      width: '90px',
    },
    detailsValue: {
      display: 'inline-block',
      width: 'calc(100% - 90px)',
    },
    emailContent: {
      padding: '19px 23px',
      whiteSpace: 'pre-wrap',
    },
    replyButtons: { width: '148px' },
    richTextEditorContainer: {
      position: 'absolute',
      height: '100%',
      width: '100%',
      overflowY: 'auto',
      paddingTop: '15px',
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
