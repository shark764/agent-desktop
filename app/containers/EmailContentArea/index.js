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
import 'assets/css/mediumdraft.min.css';
import { Editor, createEditorState } from 'medium-draft';
import { EditorState } from 'draft-js';
import { stateFromHTML } from 'draft-js-import-html';
import { stateToHTML } from 'draft-js-export-html';

import Button from 'components/Button';
import Icon from 'components/Icon';
import IconSVG from 'components/IconSVG';
import LoadingText from 'components/LoadingText';

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
      editorState: this.props.selectedInteraction.emailReply
        ? EditorState.createWithContent(stateFromHTML(this.props.selectedInteraction.emailReply.message))
        : createEditorState(),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.selectedInteraction.interactionId !== nextProps.selectedInteraction.interactionId) {
      if (this.props.selectedInteraction.emailReply) {
        this.props.emailUpdateReply(this.props.selectedInteraction.interactionId, stateToHTML(this.state.editorState.getCurrentContent()));
      }
      this.setState({
        editorState: nextProps.selectedInteraction.emailReply
          ? EditorState.createWithContent(stateFromHTML(nextProps.selectedInteraction.emailReply.message))
          : createEditorState(),
      });
    }
  }

  componentWillUnmount() {
    if (this.props.selectedInteraction.emailReply) {
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
    loadingCircle: {
      margin: '0 auto',
      display: 'block',
      height: 50,
      width: 50,
    },
    emailContent: {
      position: 'absolute',
      height: '100%',
      width: '100%',
      overflowY: 'auto',
      padding: '19px 23px',
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
    let from;
    if (this.props.selectedInteraction.emailDetails === undefined) {
      from = this.props.selectedInteraction.customer;
    } else {
      const emailFrom = this.props.selectedInteraction.emailDetails.from[0];
      if (emailFrom.name !== emailFrom.address) {
        from = `${emailFrom.name} [${emailFrom.address}]`;
      } else {
        from = emailFrom.address;
      }
    }

    let buttons;
    let details;
    let content;

    if (this.props.selectedInteraction.emailReply === undefined) {
      if (this.props.selectedInteraction.emailDetails === undefined || this.props.selectedInteraction.emailHtmlBody === undefined) {
        buttons = (
          <Button
            id="replyEmailDisabled"
            type="primaryBlue"
            text={messages.reply}
            disabled
          />
        );
      } else {
        buttons = (
          <div>
            <Button
              id="endEmail"
              type="primaryRed"
              text={messages.noReply}
              onClick={this.props.endInteraction}
              style={{ marginRight: '8px' }}
            />
            <Button
              id="replyEmail"
              type="primaryBlue"
              text={messages.reply}
              onClick={this.onEmailCreateReply}
            />
          </div>
        );
      }
      if (this.props.selectedInteraction.emailDetails === undefined) {
        details = <IconSVG style={this.styles.loadingCircle} id="connectingToOutboundCallIcon" name="loading" />;
      } else {
        const tos = this.props.selectedInteraction.emailDetails.to.map((to) => {
          if (to.name !== to.address) {
            return `${to.name} [${to.address}]`;
          } else {
            return to.address;
          }
        });
        const ccs = this.props.selectedInteraction.emailDetails.cc.map((cc) => {
          if (cc.name !== cc.address) {
            return `${cc.name} [${cc.address}]`;
          } else {
            return cc.address;
          }
        });
        const bccs = this.props.selectedInteraction.emailDetails.bcc.map((bcc) => {
          if (bcc.name !== bcc.address) {
            return `${bcc.name} [${bcc.address}]`;
          } else {
            return bcc.address;
          }
        });
        details = (
          <div>
            <div>
              <div style={this.styles.detailsField}>
                <FormattedMessage {...messages.to} />
              </div>
              <div style={this.styles.detailsValue}>
                { tos }
              </div>
            </div>
            {
              ccs.length > 0
              ? <div>
                <div style={this.styles.detailsField}>
                  <FormattedMessage {...messages.cc} />
                </div>
                <div style={this.styles.detailsValue}>
                  { ccs.join(', ') }
                </div>
              </div>
              : undefined
            }
            {
              bccs.length > 0
              ? <div>
                <div style={this.styles.detailsField}>
                  <FormattedMessage {...messages.bcc} />
                </div>
                <div style={this.styles.detailsValue}>
                  { bccs.join(', ') }
                </div>
              </div>
              : undefined
            }
            <div>
              <div style={this.styles.detailsField}>
                <FormattedMessage {...messages.subject} />
              </div>
              <div style={this.styles.detailsValue}>
                {this.props.selectedInteraction.emailDetails.subject}
              </div>
            </div>
            {
              this.props.selectedInteraction.emailDetails.attachments.length > 0
              ? <div style={this.styles.attachmentsContainer}>
                {
                  this.props.selectedInteraction.emailDetails.attachments.map((attachment) =>
                    // TODO get URL (src) from SDK when it is available
                    <a key={attachment.artifactFileId} href={attachment.src} download >
                      <div style={this.styles.attachment} >
                        {attachment.filename}
                      </div>
                    </a>
                  )
                }
              </div>
              : undefined
            }
          </div>
        );
      }

      if (this.props.selectedInteraction.emailHtmlBody === undefined) {
        content = (
          <div>
            <LoadingText />
            <br />
            <LoadingText />
          </div>
        );
      } else {
        content = (
          <div style={this.styles.emailContent} dangerouslySetInnerHTML={{ __html: this.props.selectedInteraction.emailHtmlBody }} /> // eslint-disable-line react/no-danger
        );
      }
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
              {this.props.selectedInteraction.emailReply.to}
            </div>
          </div>
          <div>
            <div style={this.styles.detailsField}>
              <FormattedMessage {...messages.subject} />
            </div>
            <div style={this.styles.detailsValue}>
              {this.props.selectedInteraction.emailReply.subject}
            </div>
          </div>
          <div style={this.styles.attachmentsContainer}>
            {
              this.props.selectedInteraction.emailReply.attachments.map((attachment) =>
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
                  this.props.selectedInteraction.emailReply.attachments.length === 0
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

      const timestampFormatted = moment(this.props.selectedInteraction.emailDetails.dateSent).format('LL');
      const emailReplyingTo = (
        <div className="md-RichEditor-editor" style={{ padding: '0 30px 20px' }}>
          <p>On {timestampFormatted} {this.props.selectedInteraction.emailDetails.from[0].name} wrote:</p>
          <blockquote className="md-RichEditor-blockquote" dangerouslySetInnerHTML={{ __html: this.props.selectedInteraction.emailHtmlBody }}></blockquote>
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
  endInteraction: PropTypes.func.isRequired,
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
