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

const HyperLink = styled.a`
  color: #23cdf4;
  font-style: oblique;
  font-size: 18px;
  display: contents;
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

const FormResponseMessageTextContainer = styled.div`
  font-size: 16px;
  line-height: 20px;
  white-space: pre-wrap;
  font-weight: bold;
  ${({ pending }) => (pending ? 'color: #ccc6c6;' : '')};
`;

const RichMessageReplyPostback = styled.div`
  line-height: 18px;
  margin: 2px;
  padding-top: 3px;
  padding-bottom: 3px;
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 25px;
  border: 2px solid #ccc;
  font-size: 16px;
  line-height: 20px;
  display: inline-flex;
`;

const RichMessageLocationRequest = styled.div`
  line-height: 18px;
  margin: 2px;
  padding-top: 3px;
  padding-bottom: 3px;
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 25px;
  border: 2px solid #ccc;
  font-size: 16px;
  line-height: 20px;
  display: inline-flex;
`;

MessageTextContainer.displayName = 'MessageTextContainer';

QuotedMessageTextContainer.displayName = 'QuotedMessageTextContainer';

FormResponseMessageTextContainer.displayName = 'FormResponseMessageTextContainer';

RichMessageReplyPostback.displayName = 'RichMessageReplyPostback';

RichMessageLocationRequest.displayName = 'RichMessageLocationRequest';

export function MessageContent({ message }) {
  const renderQuote = message.quotedMessage && message.quotedMessage.content &&
                      message.quotedMessage.content.type &&
                      message.quotedMessage.content.type !== 'form';
  const renderRichText = (message.actions && message.actions.length > 0 );
  switch (message.contentType) {
    case 'image':
      /**
       * For whatsapp interactions, images can have a caption that comes along
       * the media file as "text" property
       */
      return message.file && message.file.mediaUrl ? (
        <>
          {renderQuote && (
            <QuotedMessageTextContainer>
              {renderQuotedMessage(message)}
            </QuotedMessageTextContainer>
          )}
          {renderImageMessage(message, '300px')}
          {renderRichText && (
            renderRichMessaging(message)
          )}
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
          {renderQuote && (
            <QuotedMessageTextContainer>
              {renderQuotedMessage(message)}
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
    case 'formResponse': {
      try {
        const formResponse = [];
        const responses = JSON.parse(message.text);
        if (responses && responses.responses.length > 0) {
          responses.responses.forEach((item, index) => {
            formResponse.push(
              <>
                <FormResponseMessageTextContainer>
                  {item.name.trim()}
                </FormResponseMessageTextContainer>
                <MessageTextContainer>{item.text.trim()}</MessageTextContainer>
              </>
            );
            if (index < (responses.responses.length - 1)) {
              formResponse.push(
                <MessageTextContainer>&nbsp;</MessageTextContainer>
              );
            }
          });
        }
        return <>{formResponse}</>;
      } catch (error) {
        // in case JSON.parse fails, catch the error and return message.text instead
        return <MessageTextContainer>{message.text}</MessageTextContainer>;
      }
    }
    case 'location': {
      const locationResponse = message.text.split('\n');
      return (
        <>
          {renderQuote && (
            <QuotedMessageTextContainer>
              {renderQuotedMessage(message)}
            </QuotedMessageTextContainer>
          )}
          <MessageTextContainer>
            {locationResponse[0]}
          </MessageTextContainer>
          <HyperLink
            href={locationResponse[1]}
            target="_blank"
          >
            {locationResponse[1]}
          </HyperLink>
        </>
      );
    }
    case 'carousel':
    case 'list': {
      return (
        <MessageTextContainer>
          {renderCarouselMessaging(message)}
        </MessageTextContainer>
      );
    }
    default: {
      return (
        <>
          {renderQuote && (
            <QuotedMessageTextContainer>
              {renderQuotedMessage(message)}
            </QuotedMessageTextContainer>
          )}
          <MessageTextContainer pending={message.pending}>
            {message.pending && message.isFile && (
              <LoadingSpinnerSVG size={28} color="#b2b2b2" />
            )}
            {message.text}
          </MessageTextContainer>
          {renderRichText && (
            renderRichMessaging(message)
          )}
        </>
      );
    }
  }
}

function renderQuotedMessage(message) {
  let quotedMessage;
  if (message.quotedMessage && message.quotedMessage.content) {
    if (message.quotedMessage.content.type === 'image') {
      quotedMessage = renderImageMessage(message.quotedMessage.content, '50px');
    } else if (message.quotedMessage.content.type === 'file') {
      quotedMessage = renderFileMessage(message.quotedMessage.content);
    } else if (message.quotedMessage.content.type === 'text') {
      quotedMessage = message.quotedMessage.content.text;
    } else if (!message.quotedMessage.content.type) {
      quotedMessage = (
        <span style={{ color: 'red' }}>
          <FormattedMessage {...messages.fileNotFoundInTranscript} />
        </span>
      );
    }
  }
  return quotedMessage;
}

function renderImageMessage(content, width) {
  if (content && content.file && content.file.mediaUrl) {
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
  if (content && content.file && content.file.mediaUrl) {
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

function renderRichMessaging(message) {
  const shortHandMessages = [];
  if (message) {
    message.actions.forEach(element => {
      if (element.type === 'link') {
        shortHandMessages.push(
          <MessageTextContainer>
            {element.text}
            :&nbsp;
            <HyperLink
              href={element.uri}
              target="_blank"
            >
              {element.uri}
            </HyperLink>
          </MessageTextContainer>
        );
      } else if (element.type === 'reply' || element.type === 'postback') {
        shortHandMessages.push(
          <RichMessageReplyPostback>
            {element.text}
          </RichMessageReplyPostback>
        );
      } else if (element.type === 'locationRequest') {
        shortHandMessages.push(
          <MessageTextContainer>
            <RichMessageLocationRequest>
              {element.text}
            </RichMessageLocationRequest>
          </MessageTextContainer>
        );
      } else {
        shortHandMessages.push(
          <span style={{ color: 'red' }}>
            <FormattedMessage {...messages.notSupported} />
          </span>
        );
      }
    });

  }
  return(<>{shortHandMessages}</>);
}

function renderCarouselMessaging(message) {
  const carouselMessages = [];
  if (message) {
    const carouselItems = message.text.split('\n\n');
    carouselItems.forEach((carouselItem, index) => {
      const itemContents = carouselItem.split('\n');
      itemContents.forEach((itemContent) => {
        if (itemContent.includes('http')) {
          const text = itemContent.substring(0, itemContent.indexOf('http'));
          const hyperlink = itemContent.substring(itemContent.indexOf('http'), itemContent.length);
          carouselMessages.push(
            <MessageTextContainer>
              {text}
              <HyperLink
                href={hyperlink}
                target="_blank"
              >
                {hyperlink}
              </HyperLink>
            </MessageTextContainer>
          );
        } else {
          carouselMessages.push(
            <MessageTextContainer>
              {itemContent}
            </MessageTextContainer>
          );
        }
      });
      // set blank space/new line after a hyperlink is rendered
      if (index < carouselItems.length - 1) {
        carouselMessages.push(<MessageTextContainer>&nbsp;</MessageTextContainer>);
      }
    });
  }
  return(<>{carouselMessages}</>);
}

MessageContent.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.string,
    type: PropTypes.oneOf(['customer', 'agent', 'Chatbot']),
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
      'location',
      'carousel',
      'list',
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
          mediaSize: PropTypes.number,
        }),
      }),
    }),
  }),
};

export default MessageContent;
