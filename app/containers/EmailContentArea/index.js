/*
 *
 * EmailContentArea
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import Radium from 'radium';

import moment from 'moment';
import '../../assets/css/mediumdraft.min.css';
import { Editor, createEditorState } from 'medium-draft';
import { EditorState } from 'draft-js';
import { stateFromHTML } from 'draft-js-import-html';
import { stateToHTML } from 'draft-js-export-html';

import Button from 'components/Button';
import Icon from 'components/Icon';

import ContentArea from 'containers/ContentArea';

import { emailAddAttachment, emailRemoveAttachment, emailUpdateReply } from 'containers/AgentDesktop/actions';

import messages from './messages';

export class EmailContentArea extends React.Component {

  constructor(props) {
    super(props);
    this.onEmailCreateReply = this.onEmailCreateReply.bind(this);
    this.onChange = (editorState) => {
      this.setState({ editorState });
    };

    this.state = {
      editorState: this.props.selectedInteraction.email.reply
        ? EditorState.createWithContent(stateFromHTML(this.props.selectedInteraction.email.reply.message))
        : createEditorState(),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.selectedInteraction.interactionId !== nextProps.selectedInteraction.interactionId) {
      if (this.props.selectedInteraction.email.reply) {
        this.props.emailUpdateReply(this.props.selectedInteraction.interactionId, stateToHTML(this.state.editorState.getCurrentContent()));
      }
      this.setState({
        editorState: nextProps.selectedInteraction.email.reply
          ? EditorState.createWithContent(stateFromHTML(nextProps.selectedInteraction.email.reply.message))
          : createEditorState(),
      });
    }
  }

  componentWillUnmount() {
    if (this.props.selectedInteraction.email.reply) {
      this.props.emailUpdateReply(this.props.selectedInteraction.interactionId, stateToHTML(this.state.editorState.getCurrentContent()));
    }
  }

  onEmailCreateReply() {
    this.setState({
      editorState: createEditorState(),
    });
    this.props.emailCreateReply(this.props.selectedInteraction.interactionId);
  }

  addFilesToEmail(fileList) {
    for (let i = 0; i < fileList.length; i += 1) {
      // TODO call SDK file upload function here when available. Move emailAddAttachment() to that callback. Loading in between.
      this.props.emailAddAttachment(this.props.selectedInteraction.interactionId, fileList[i]);
    }
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
    attachmentsContainer: {
      borderTop: '1px solid #D0D0D0',
      marginTop: '10px',
      paddingTop: '10px',
    },
    attachment: {
      display: 'inline-block',
      backgroundColor: '#FFFFFF',
      color: '#000000',
      borderRadius: '2px',
      fontSize: '12px',
      height: '26px',
      padding: '3px 10px',
      margin: '4px 10px 0 0',
      verticalAlign: 'top',
      border: '1px solid transparent',
    },
    addAttachment: {
      cursor: 'pointer',
    },
    attachmentIcon: {
      verticalAlign: 'top',
      marginTop: '1px',
    },
    addAttachmentMessage: {
      marginLeft: '5px',
    },
    attachmentName: {
      verticalAlign: 'top',
      marginTop: '-1px',
      display: 'inline-block',
    },
    attachmentRemove: {
      fontSize: '18px',
      lineHeight: '16px',
      marginLeft: '7px',
      color: '#979797',
      cursor: 'pointer',
    },
    emailContent: {
      position: 'absolute',
      height: '100%',
      width: '100%',
      overflowY: 'auto',
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
          id="replyEmail"
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
          {
            this.props.selectedInteraction.email.attachments.length > 0
            ? <div style={this.styles.attachmentsContainer}>
              {
                this.props.selectedInteraction.email.attachments.map((attachment) =>
                  <a key={attachment.src} href={attachment.src} download >
                    <div style={this.styles.attachment} >
                      {attachment.name}
                    </div>
                  </a>
                )
              }
            </div>
            : undefined
          }
        </div>
      );

      content = (
        <div style={this.styles.emailContent} dangerouslySetInnerHTML={{ __html: this.props.selectedInteraction.email.content }} /> // eslint-disable-line react/no-danger
      );
    } else {
      buttons = (
        <div style={this.styles.replyButtons}>
          <Button
            id="cancelEmail"
            type="secondary"
            style={{ marginRight: '5px' }}
            text={messages.cancel}
            onClick={() => this.props.emailCancelReply(this.props.selectedInteraction.interactionId)}
          />
          <Button
            id="sendEmail"
            type="primaryRed"
            text={messages.send}
            onClick={() => alert(`TODO send email with content:\n\n${stateToHTML(this.state.editorState.getCurrentContent())}`)}
          />
        </div>
      );

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
          <div style={this.styles.attachmentsContainer}>
            {
              this.props.selectedInteraction.email.reply.attachments.map((attachment) =>
                <div key={attachment.name} style={this.styles.attachment} >
                  <span style={this.styles.attachmentName}>
                    {attachment.name}
                  </span>
                  <span onClick={() => this.props.emailRemoveAttachment(this.props.selectedInteraction.interactionId, attachment)} style={this.styles.attachmentRemove}>
                    &#10060;
                  </span>
                </div>
              )
            }
            <input id="attachmentFilePicker" type="file" multiple value="" onChange={(e) => this.addFilesToEmail(e.target.files)} style={{ display: 'none' }} />
            <label id="attachmentFilePickerLabel" htmlFor="attachmentFilePicker">
              <div style={[this.styles.attachment, this.styles.addAttachment]}>
                <Icon name="attachment" style={this.styles.attachmentIcon} />
                {
                  this.props.selectedInteraction.email.reply.attachments.length === 0
                  ? <span style={this.styles.addAttachmentMessage}>
                    <FormattedMessage {...messages.addAttachment} />
                  </span>
                  : undefined
                }
              </div>
            </label>
          </div>
        </div>
      );

      const timestampFormatted = moment(this.props.selectedInteraction.email.timestamp).format('LL');
      const emailReplyingTo = (
        <div className="md-RichEditor-editor" style={{ padding: '0 30px 20px' }}>
          <p>On {timestampFormatted} {this.props.selectedInteraction.email.from} wrote:</p>
          <blockquote className="md-RichEditor-blockquote" dangerouslySetInnerHTML={{ __html: this.props.selectedInteraction.email.content }}></blockquote>
        </div>
      );

      const { editorState } = this.state;
      content = (
        <div style={this.styles.richTextEditorContainer}>
          <Editor
            editorState={editorState}
            onChange={this.onChange}
            placeholder={this.props.intl.formatMessage(messages.addMessage)}
            sideButtons={[]}
            inlineButtons={[
              {
                label: 'B',
                style: 'BOLD',
                icon: 'bold',
                description: 'Bold',
              },
              {
                label: 'I',
                style: 'ITALIC',
                icon: 'italic',
                description: 'Italic',
              },
              {
                label: 'U',
                style: 'UNDERLINE',
                icon: 'underline',
                description: 'Underline',
              },
            ]}
            blockButtons={[
              {
                label: 'H3',
                style: 'header-three',
                icon: 'header',
                description: 'Heading 3',
              },
              {
                label: 'Q',
                style: 'blockquote',
                icon: 'quote-right',
                description: 'Blockquote',
              },
              {
                label: 'UL',
                style: 'unordered-list-item',
                icon: 'list-ul',
                description: 'Unordered List',
              },
              {
                label: 'OL',
                style: 'ordered-list-item',
                icon: 'list-ol',
                description: 'Ordered List',
              },
            ]}
          />
          { emailReplyingTo }
        </div>
      );
    }

    return <ContentArea interaction={this.props.selectedInteraction} from={from} buttons={buttons} details={details} content={content} />;
  }
}

EmailContentArea.propTypes = {
  intl: intlShape.isRequired,
  selectedInteraction: PropTypes.object.isRequired,
  emailCreateReply: PropTypes.func.isRequired,
  emailCancelReply: PropTypes.func.isRequired,
  emailAddAttachment: PropTypes.func.isRequired,
  emailRemoveAttachment: PropTypes.func.isRequired,
  emailUpdateReply: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    emailAddAttachment: (interactionId, attachment) => dispatch(emailAddAttachment(interactionId, attachment)),
    emailRemoveAttachment: (interactionId, attachment) => dispatch(emailRemoveAttachment(interactionId, attachment)),
    emailUpdateReply: (interactionId, reply) => dispatch(emailUpdateReply(interactionId, reply)),
    dispatch,
  };
}

export default injectIntl(connect(null, mapDispatchToProps)(Radium(EmailContentArea)));
