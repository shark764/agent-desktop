/*
 *
 * EmailContentArea
 *
 */

import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import Radium from 'radium';

import messages from './messages';

import Button from 'components/Button';

import ContentArea from 'containers/ContentArea';

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

export class EmailContentArea extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.onEmailCreateReply = this.onEmailCreateReply.bind(this);
    this.resetReplyEditor = this.resetEditorState.bind(this);
    this.onChange = (editorState) => {
      // TODO use stateToHTML() to get HTML from text editor
      // console.log('Rich text HTML: ', stateToHTML(editorState.getCurrentContent()));
      this.setState({ editorState });
    };

    this.state = {
      editorState: this.resetEditorState(props.selectedInteraction.email),
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      editorState: this.resetEditorState(nextProps.selectedInteraction.email),
    });
  }

  onEmailCreateReply() {
    this.setState({
      editorState: this.resetEditorState(this.props.selectedInteraction.email),
    });
    this.props.emailCreateReply(this.props.selectedInteraction.interactionId);
  }

  resetEditorState(email) {
    const timestampFormatted = moment(email.timestamp).format('LL');
    const emailReplyContent = `<p><br></p><p><br></p><p>On ${timestampFormatted} ${email.from} wrote:</p><blockquote>${email.content}</blockquote>`;
    return EditorState.createWithContent(stateFromHTML(emailReplyContent));
  }

  styles = {
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
  }

  render() {
    const from = this.props.selectedInteraction.email.from;
    let buttons;
    let details;
    let content;

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

    // TODO component for this skeleton
    return <ContentArea from={from} buttons={buttons} details={details} content={content} />;
  }
}

EmailContentArea.propTypes = {
  selectedInteraction: PropTypes.object.isRequired,
  emailCreateReply: PropTypes.func.isRequired,
  emailCancelReply: PropTypes.func.isRequired,
};

export default Radium(EmailContentArea);
