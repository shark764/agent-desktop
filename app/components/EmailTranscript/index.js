import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

const EmailContainer = styled.div`
  fontsize: 14px;
  lineheight: 20px;
  whitespace: pre-wrap;
  margin-bottom: 15px;
  border-bottom: 1px solid rgb(208, 208, 208);
`;
EmailContainer.displayName = 'EmailContainer';

const EmailHeadContainer = styled.div`
  margin-bottom: 5px;
  padding-bottom: 5px;
  font-size: 14px;
`;
const EmailAttachmentContainer = styled.div`
  margin-bottom: 15px;
  padding-bottom: 15px;
`;
const EmailAttachmentLink = styled.a`
  display: -webkit-inline-box;
  color: inherit;
`;
const EmailAttachmentItem = styled.div`
  display: inline-block;
  background-color: rgb(243, 243, 243);
  color: rgb(128, 128, 128);
  border-radius: 2px;
  font-size: 12px;
  height: 26px;
  padding: 3px 10px;
  margin: 4px 10px 0 0;
  vertical-align: top;
  border: 1px solid transparent;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
`;

export function EmailTranscript({ transcript }) {
  const renderRecipients = (recipientType) => (
    <div>
      <strong>
        <FormattedMessage {...messages[recipientType]} />
        {': '}
      </strong>
      {transcript[recipientType]
        .map((recipient) =>
          !recipient.name || recipient.name === recipient.address
            ? recipient.address
            : `${recipient.name} <${recipient.address}>`
        )
        .join(', ')}
    </div>
  );
  return (
    <EmailContainer>
      <EmailHeadContainer>
        <h3>
          <FormattedMessage {...messages[transcript.type]} />
        </h3>
        <div>
          <strong>Subject: </strong>
          {transcript.subject}
        </div>
        {transcript.from &&
          transcript.from.length > 0 &&
          renderRecipients('from')}
        {transcript.to && transcript.to.length > 0 && renderRecipients('to')}
        {transcript.cc && transcript.cc.length > 0 && renderRecipients('cc')}
        {transcript.bcc && transcript.bcc.length > 0 && renderRecipients('bcc')}
      </EmailHeadContainer>
      {transcript.attachments.length > 0 && (
        <EmailAttachmentContainer>
          {transcript.attachments.map((attachment) => (
            <EmailAttachmentLink
              key={attachment.artifactFileId}
              href={attachment.url}
              alt="attachment"
              target="_blank"
              title={attachment.filename}
            >
              <EmailAttachmentItem>{attachment.filename}</EmailAttachmentItem>
            </EmailAttachmentLink>
          ))}
        </EmailAttachmentContainer>
      )}
      {transcript.contentType === 'html' && (
        <div
          dangerouslySetInnerHTML={{
            __html: transcript.data,
          }}
        />
      )}
      {transcript.contentType === 'plainText' && transcript.data}
    </EmailContainer>
  );
}

EmailTranscript.propTypes = {
  transcript: PropTypes.shape({
    contentType: PropTypes.oneOf(['html', 'plainText']),
    type: PropTypes.oneOf(['email', 'reply']),
    data: PropTypes.string,
    attachments: PropTypes.arrayOf(
      PropTypes.shape({
        artifactFileId: PropTypes.string,
        filename: PropTypes.string,
        url: PropTypes.string,
      })
    ),
    subject: PropTypes.string,
    from: PropTypes.array,
    to: PropTypes.array,
    cc: PropTypes.array,
    bcc: PropTypes.array,
  }),
};

export default EmailTranscript;
