import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import LoadingSpinnerSVG from 'components/LoadingSpinnerSVG';
import Image from 'components/Image';
import Icon from 'components/Icon';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

const AttachmentContainer = styled.div``;

const AttachmentLink = styled.a`
  text-decoration: none;
  color: #23cdf4;
  font-style: oblique;
  font-size: 18px;
  display: inline-flex;
`;

const AttachmentIconContainer = styled.div`
  transform: rotate(45deg);
`;

const FileNameContainer = styled.div`
  font-style: oblique;
  color: #23cdf4;
  font-size: 17px;
  white-space: nowrap;
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

FileNameContainer.displayName = 'FileNameContainer';

const MessageTextContainer = styled.div`
  font-size: 16px;
  line-height: 20px;
  white-space: pre-wrap;
  ${({ pending }) => (pending ? 'color: #ccc6c6;' : '')};
`;

const QuotedMessageTextContainer = styled.div`
  font-size: 14px;
  line-height: 18px;
  white-space: pre-wrap;
  font-style: italic;
  margin-left: 10px;
  margin-right: 15px;
  padding: 10px;
  border-radius: 8px;
  background: #F8F9F9;
  border: 1px solid #ccc;
  border-left: 4px solid #aaa;
  ${({ pending }) => (pending && 'color: #ccc6c6')};
`;

MessageTextContainer.displayName = 'MessageTextContainer';

QuotedMessageTextContainer.displayName = 'QuotedMessageTextContainer';

export function MessageContent({ message }) {
  switch (message.contentType) {
    case 'image':
      /**
       * For whatsapp interactions, images can have a caption that comes along
       * the media file as "text" property
       */
      return message.file && message.file.mediaUrl ? (
        <>
          {message.quotedMessage && message.quotedMessage.content && (
            <QuotedMessageTextContainer>
              {message.quotedMessage.content.text}
            </QuotedMessageTextContainer>
          )}
          {renderImageMessage(message, '300px')}
        </>
      ) : (
        <span style={{ color: 'red' }}>
          <FormattedMessage {...messages.fileNotFoundInTranscript} />
        </span>
      );
    case 'file': {
      /**
       * For whatsapp interactions, filenames are replaced by a random alphanumeric text,
       * instead we use the "text" property that comes along with the media file to
       * render it as filename.
       * Videos and gif from customer are received as "video/mp4" files by agent
       *
       * non "video/mp4" files has a random filename, real name comes in "text" property
       * "video/mp4" files has a random filename, but customer can add a caption along with the file,
       * that's why we cannot use "text" as filename for that case
       */

      return message.file ? (
        <>
          {message.quotedMessage && message.quotedMessage.content && (
            <QuotedMessageTextContainer>
              {message.quotedMessage.content.text}
            </QuotedMessageTextContainer>
          )}
          {renderFileMessage(message)}
        </>
      ) : (
        <span style={{ color: 'red' }}>
          <FormattedMessage {...messages.fileNotFoundInTranscript} />
        </span>
      );
    }
    default: {
      let quotedMessage;
      if (message.quotedMessage && message.quotedMessage.content) {
        if (message.quotedMessage.content.type === 'image') {
          quotedMessage = renderImageMessage(message.quotedMessage.content, '50px');
        } else if (message.quotedMessage.content.type === 'file') {
          quotedMessage = renderFileMessage(message.quotedMessage.content);
        } else {
          quotedMessage = message.quotedMessage.content.text;
        }
      }
      return (
        <>
          {quotedMessage && (
            <QuotedMessageTextContainer>
              {quotedMessage}
            </QuotedMessageTextContainer>
          )}
          <MessageTextContainer pending={message.pending}>
            {message.pending && message.isFile && (
              <LoadingSpinnerSVG size={28} color="#b2b2b2" />
            )}
            {message.text}
          </MessageTextContainer>
        </>
      );
    }
  }
}

function renderImageMessage(content, width) {
  if (content) {
    return (
      <AttachmentContainer>
        <AttachmentLink
          href={content.file.mediaUrl}
          alt="image"
          target="_blank"
          style={{
            display: 'contents',
          }}
        >
          <Image
            id={content.id}
            src={content.file.mediaUrl}
            placeholher="image"
            style={{
              maxWidth: width,
              height: 'auto',
            }}
          />
        </AttachmentLink>
        {content.text && (
          <MessageTextContainer>{content.text}</MessageTextContainer>
        )}
      </AttachmentContainer>
    );
  } else {
    return (
      <span style={{ color: 'red' }}>
        <FormattedMessage {...messages.fileNotFoundInTranscript} />
      </span>
    );
  }
}

function renderFileMessage(content) {
  if (content) {
    let fileName =
      (content.file.mediaType !== 'video/mp4' &&
        content.text &&
        content.text.trim()) ||
      (content.file && content.file.fileName) ||
      (content.file.mediaUrl &&
        decodeURIComponent(content.file.mediaUrl)
          .split('/')
          [content.file.mediaUrl.split('/').length - 1].split('?')[0]);

    let caption = content.text;
    const ext =
      caption &&
      caption.substring(caption.lastIndexOf('.') + 1).toLowerCase();
    if (content.file.mediaType === 'video/mp4' && ext === 'mp4') {
      fileName = caption.trim();
      caption = null;
    }

    return fileName ? (
      <AttachmentContainer>
        <AttachmentLink
          href={content.file.mediaUrl}
          alt="image"
          target="_blank"
        >
          <AttachmentIconContainer>
            <Icon
              id={content.id}
              name="attachment_blue"
              placeholher="image"
            />
          </AttachmentIconContainer>
          <FileNameContainer title={fileName}>{fileName}</FileNameContainer>
        </AttachmentLink>
        {content.file.mediaType === 'video/mp4' && caption && (
          <MessageTextContainer pending={content.pending}>
            {caption}
          </MessageTextContainer>
        )}
      </AttachmentContainer>
    ) : (
      <span style={{ color: 'red' }}>
        <FormattedMessage {...messages.fileNotFoundInTranscript} />
      </span>
    );
  } else {
    return (
      <span style={{ color: 'red' }}>
        <FormattedMessage {...messages.fileNotFoundInTranscript} />
      </span>
    );
  }
}

MessageContent.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.string,
    type: PropTypes.oneOf(['customer', 'agent']),
    from: PropTypes.string,
    file: PropTypes.shape({
      fileName: PropTypes.string,
      mediaUrl: PropTypes.string,
      mediaType: PropTypes.string,
    }),
    contentType: PropTypes.oneOf([
      'file',
      'text',
      'image',
      'form',
      'formResponse',
    ]),
    resourceId: PropTypes.string,
    timestamp: PropTypes.number,
    pending: PropTypes.bool,
    isFile: PropTypes.bool,
    text: PropTypes.string,
    quotedMessage: PropTypes.shape({
      content: PropTypes.shape({
        id: PropTypes.string,
        type: PropTypes.string,
        text: PropTypes.string,
        file: PropTypes.shape({
          mediaUrl: PropTypes.string,
          mediaType: PropTypes.string,
          mediaSize: PropTypes.string,
        }),
      }),
    }),
  }),
};

export default MessageContent;
