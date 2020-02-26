import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { LoadingSpinnerSVG } from 'cx-ui-components';
import Image from 'components/Image';
import Icon from 'components/Icon';

const AttachmentContainer = styled.div``;

const AttachmentLink = styled.a`
  text-decoration: none;
  color: #23cdf4;
  font-style: oblique;
  font-size: 19px;
  display: contents;
`;

const AttachmentIconContainer = styled.div`
  position: relative;
  float: left;
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

export function MessageContent({ message }) {
  let fileName;

  const MessageTextContainer = styled.div`
    fontsize: 16px;
    lineheight: 20px;
    whitespace: pre-wrap;
    ${message.pending ? 'color: #ccc6c6;' : ''};
  `;

  MessageTextContainer.displayName = 'MessageTextContainer';

  switch (message.contentType) {
    case 'image':
      return (
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
      );
    case 'file':
      fileName = decodeURIComponent(message.file.mediaUrl).split('/')[
        message.file.mediaUrl.split('/').length - 1
      ];
      return (
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
            <FileNameContainer title={fileName}>
              {fileName}
            </FileNameContainer>
          </AttachmentLink>
        </AttachmentContainer>
      );
    default:
      return (
        <MessageTextContainer>
          {message.pending &&
            message.isFile && <LoadingSpinnerSVG size={28} color="#b2b2b2" />}
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
      mediaUrl: PropTypes.string,
    }),
    contentType: PropTypes.oneOf(['file', 'text', 'image']),
    resourceId: PropTypes.string,
    timestamp: PropTypes.number,
  }),
};

export default MessageContent;
