import React from 'react';
import { mount, shallow } from 'enzyme';
import StyledMessageContent, { MessageContent } from '../index';

describe('<MessageContent />', () => {
  const mockMediaUrl = 'https://www.test.com/file';
  const mockTextMessage = {
    id: '5e429c11749914000f07349f',
    text: 'This is a test',
    type: 'customer',
    from: 'Irvin Sandoval',
    file: {},
    contentType: 'text',
    resourceId: null,
    timestamp: 1581423633126,
  };

  const mockImageMessage = {
    id: '5e429c11749914000f07349f',
    type: 'customer',
    from: 'Irvin Sandoval',
    file: {
      fileName: 'Test.jpg',
      mediaUrl: `${mockMediaUrl}.jpg`,
    },
    contentType: 'image',
    resourceId: null,
    timestamp: 1581423633126,
  };

  const mockFileMessage = {
    id: '5e429c11749914000f07349f',
    type: 'customer',
    from: 'Irvin Sandoval',
    file: {
      fileName: 'Test.jpg',
      mediaUrl: `${mockMediaUrl}.docx`,
    },
    contentType: 'file',
    resourceId: null,
    timestamp: 1581423633126,
  };

  it('should render text message component correctly', () => {
    const rendered = shallow(<MessageContent message={mockTextMessage} />);
    expect(rendered).toMatchSnapshot();
  });

  it('text message is in a pending state', () => {
    const rendered = shallow(
      <MessageContent message={{ ...mockTextMessage, pending: true }} />
    );
    expect(rendered).toMatchSnapshot();
  });

  it('file type message is in a pending state', () => {
    const rendered = shallow(
      <MessageContent
        message={{ ...mockTextMessage, pending: true, isFile: true }}
      />
    );
    expect(rendered).toMatchSnapshot();
  });

  it('should render image message component correctly', () => {
    const rendered = shallow(<MessageContent message={mockImageMessage} />);
    expect(rendered).toMatchSnapshot();
  });

  it('should render fileNotFoundInTranscript error when image type message does not have file property', () => {
    const rendered = shallow(
      <MessageContent message={{ ...mockImageMessage, file: null }} />
    );
    expect(rendered).toMatchSnapshot();
  });

  it('image type message has a camption along with the file', () => {
    const rendered = shallow(
      <MessageContent
        message={{ ...mockImageMessage, text: 'hey, look at this file!' }}
      />
    );
    expect(rendered).toMatchSnapshot();
  });

  it('should render file message component correctly', () => {
    const rendered = shallow(<MessageContent message={mockFileMessage} />);
    expect(rendered).toMatchSnapshot();
  });

  it('file type message has text property and it is not video/mp4 type', () => {
    const rendered = shallow(
      <MessageContent
        message={{
          ...mockFileMessage,
          text: 'most-awesome-file.pdf',
          file: {
            fileName: '83hbu88d88dh-99ajffjf-11f4.pdf',
            mediaUrl: `${mockMediaUrl}.pdf`,
            mediaType: 'text/pdf',
          },
        }}
      />
    );
    expect(rendered).toMatchSnapshot();
  });

  it('file type message does not have fileName property', () => {
    const rendered = shallow(
      <MessageContent
        message={{
          ...mockFileMessage,
          file: {
            mediaUrl: `${mockMediaUrl}.pdf`,
            mediaType: 'text/pdf',
          },
        }}
      />
    );
    expect(rendered).toMatchSnapshot();
  });

  it('file type message is "video/mp4" format and has a text property with its name', () => {
    const rendered = shallow(
      <MessageContent
        message={{
          ...mockFileMessage,
          text: 'most-awesome-video.mp4',
          file: {
            fileName: '83hbu88d88dh-99ajffjf-11f4.mp4',
            mediaUrl: `${mockMediaUrl}.mp4`,
            mediaType: 'video/mp4',
          },
        }}
      />
    );
    expect(rendered).toMatchSnapshot();
  });

  it('file type message is "video/mp4" format and has a caption', () => {
    const rendered = shallow(
      <MessageContent
        message={{
          ...mockFileMessage,
          text: 'Hey look at this video!!',
          file: {
            fileName: '83hbu88d88dh-99ajffjf-11f4.mp4',
            mediaUrl: `${mockMediaUrl}.mp4`,
            mediaType: 'video/mp4',
          },
        }}
      />
    );
    expect(rendered).toMatchSnapshot();
  });

  it('file type message is "video/mp4" format and has a text property in pending state', () => {
    const rendered = shallow(
      <MessageContent
        message={{
          ...mockFileMessage,
          text: 'most-awesome-video.mp4',
          file: {
            fileName: '83hbu88d88dh-99ajffjf-11f4.mp4',
            mediaUrl: `${mockMediaUrl}.mp4`,
            mediaType: 'video/mp4',
          },
          pending: true,
        }}
      />
    );
    expect(rendered).toMatchSnapshot();
  });

  it('should render fileNotFoundInTranscript error when file type message does not have file property', () => {
    const rendered = shallow(
      <MessageContent message={{ ...mockFileMessage, file: {} }} />
    );
    expect(rendered).toMatchSnapshot();
  });

  it('should render styled component with text message', () => {
    const rendered = mount(<StyledMessageContent message={mockTextMessage} />);
    expect(rendered).toMatchSnapshot();
  });

  it('should render styled component with text message in a pending state', () => {
    const rendered = mount(
      <StyledMessageContent message={{ ...mockTextMessage, pending: true }} />
    );
    expect(rendered).toMatchSnapshot();
  });
});
