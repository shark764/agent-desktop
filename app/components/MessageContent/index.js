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

MessageTextContainer.displayName = 'MessageTextContainer';

export function MessageContent({ message }) {
  switch (message.contentType) {
    case 'image':
      /**
       * For whatsapp interactions, images can have a caption that comes along
       * the media file as "text" property
       */
      return message.file && message.file.mediaUrl ? (
        <AttachmentContainer>
          <AttachmentLink
            href={message.file.mediaUrl}
            alt="image"
            target="_blank"
            style={{
              display: 'contents',
            }}
          >
            <Image
              id={message.id}
              src={message.file.mediaUrl}
              placeholher="image"
              style={{
                maxWidth: '300px',
                height: 'auto',
              }}
            />
          </AttachmentLink>
          {message.text && (
            <MessageTextContainer>{message.text}</MessageTextContainer>
          )}
        </AttachmentContainer>
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
      let fileName =
        (message.file.mediaType !== 'video/mp4' &&
          message.text &&
          message.text.trim()) ||
        (message.file && message.file.fileName) ||
        (message.file.mediaUrl &&
          decodeURIComponent(message.file.mediaUrl)
            .split('/')
            [message.file.mediaUrl.split('/').length - 1].split('?')[0]);

      let caption = message.text;
      const ext =
        caption &&
        caption.substring(caption.lastIndexOf('.') + 1).toLowerCase();
      if (message.file.mediaType === 'video/mp4' && ext === 'mp4') {
        fileName = caption.trim();
        caption = null;
      }

      return fileName ? (
        <AttachmentContainer>
          <AttachmentLink
            href={message.file.mediaUrl}
            alt="image"
            target="_blank"
          >
            <AttachmentIconContainer>
              <Icon
                id={message.id}
                name="attachment_blue"
                placeholher="image"
              />
            </AttachmentIconContainer>
            <FileNameContainer title={fileName}>{fileName}</FileNameContainer>
          </AttachmentLink>
          {message.file.mediaType === 'video/mp4' && caption && (
            <MessageTextContainer pending={message.pending}>
              {caption}
            </MessageTextContainer>
          )}
        </AttachmentContainer>
      ) : (
        <span style={{ color: 'red' }}>
          <FormattedMessage {...messages.fileNotFoundInTranscript} />
        </span>
      );
    }
    default:
      return (
        <MessageTextContainer pending={message.pending}>
          {message.pending && message.isFile && (
            <LoadingSpinnerSVG size={28} color="#b2b2b2" />
          )}
          {message.text}
        </MessageTextContainer>
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
  }),
};

export default MessageContent;
