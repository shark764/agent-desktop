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

  const mockFormResponseMessage = {
    id: '5e429c11749914000f07349f',
    text: '{"responses":[{"name":"Your name?","text":" a"},{"name":"Your email?","text":" a@a.a"},{"name":"Company Size","text":" 1-50 employees"}]}',
    type: 'system',
    from: 'Chatbot',
    contentType: 'formResponse',
    resourceId: null,
    timestamp: 1581423633126,
  };

  const mockShorthandImageMessage = {
    id: '5e429c11749914000f07349f',
    text: 'This is a test of shorthand image message',
    type: 'agent',
    from: 'Agent',
    file: {
      mediaType: 'image',
      mediaUrl: 'https://www.test.com/test.jpg',
    },
    contentType: 'image',
    resourceId: null,
    timestamp: 1581423633126,
    actions: [
      {
        type: 'link',
        uri: 'https://www.lifesize.com/en/solutions/contact-center-solutions/',
        _id: '60d9e84d168a6e00d3519fca',
        text: 'Get to the cloud',
      },
    ],
  };

  const mockShorthandReplyMessage = {
    id: '5e429c11749914000f07349f',
    text: 'This is a test of shorthand reply message',
    type: 'agent',
    from: 'Agent',
    contentType: 'text',
    resourceId: null,
    timestamp: 1581423633126,
    actions: [
      {
        type: 'reply',
        _id: '60d3a4364f0d1400d36f594a',
        text: 'Albury-Wodonga',
        payload: 'albury-wodonga',
      },
      {
        type: 'reply',
        _id: '60d3a4364f0d1400d36f594b',
        text: 'Bendigo',
        payload: 'bendigo',
      },
      {
        type: 'locationRequest',
        _id: '60d4bff54cd1be00d32e770e',
        text: 'Share your location',
      },
    ],
  };

  const mockLocationMessage = {
    id: '5e429c11749914000f07349f',
    text: 'Location shared:\nhttps://maps.google.com/maps?q=13.678180063224062,-89.25147673422777',
    type: 'customer',
    from: 'Irvin Sandoval',
    contentType: 'location',
    resourceId: null,
    timestamp: 1581423633126,
  };

  const mockCarouselMessage = {
    id: '5e429c11749914000f07349f',
    text: 'This is a test of carousel message\n1. Tacos\nDescription\nMore info: https://www.test.com/file/\n\n2. Ramen\nDescription\nMore info: https://www.test.com/file/',
    type: 'agent',
    from: 'Agent',
    contentType: 'carousel',
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

  it('should render form response message component correctly', () => {
    const rendered = shallow(<MessageContent message={mockFormResponseMessage} />);
    expect(rendered).toMatchSnapshot();
  });

  it('should render shorthand image message component correctly', () => {
    const rendered = shallow(<MessageContent message={mockShorthandImageMessage} />);
    expect(rendered).toMatchSnapshot();
  });

  it('should render shorthand reply/locationRequest message component correctly', () => {
    const rendered = shallow(<MessageContent message={mockShorthandReplyMessage} />);
    expect(rendered).toMatchSnapshot();
  });

  it('should render location message component correctly', () => {
    const rendered = shallow(<MessageContent message={mockLocationMessage} />);
    expect(rendered).toMatchSnapshot();
  });

  it('should render carousel message component correctly', () => {
    const rendered = shallow(<MessageContent message={mockCarouselMessage} />);
    expect(rendered).toMatchSnapshot();
  });
});


/* Quoted messages */

describe('<QuotedMessageContent />', () => {
  const mockMediaUrl = 'https://www.test.com/file';
  const mockQuotedTextMessage = {
    id: '601ad7e0f41170000cced559',
    text: 'This is a quoted message',
    type: 'customer',
    from: 'Irvin Sandoval',
    file: {},
    contentType: 'text',
    resourceId: null,
    timestamp: 1581423633126,
    quotedMessage: {
      content: {
        id: '5e429c11749914000f07349f',
        type: 'text',
        text: 'This is a test',
        file: {},
      },
    },
  };

  const mockQuotedImageMessage = {
    id: '601ad7e0f41170000cced559',
    text: 'This is a quoted message',
    type: 'customer',
    from: 'Irvin Sandoval',
    file: {},
    contentType: 'text',
    resourceId: null,
    timestamp: 1581423633126,
    quotedMessage: {
      content: {
        id: '5e429c11749914000f07349f',
        type: 'image',
        file: {
          fileName: 'Test.jpg',
          mediaUrl: `${mockMediaUrl}.jpg`,
        },
      },
    },
  };

  const mockQuotedFileMessage = {
    id: '601ad7e0f41170000cced559',
    text: 'This is a quoted message',
    type: 'customer',
    from: 'Irvin Sandoval',
    file: {},
    contentType: 'text',
    resourceId: null,
    timestamp: 1581423633126,
    quotedMessage: {
      content: {
        id: '5e429c11749914000f07349f',
        type: 'file',
        file: {
          fileName: 'Test.jpg',
          mediaUrl: `${mockMediaUrl}.jpg`,
        },
      },
    },
  };

  it('should render quoted text message component correctly', () => {
    const rendered = shallow(<MessageContent message={mockQuotedTextMessage} />);
    expect(rendered).toMatchSnapshot();
  });

  it('quoted text message is in a pending state', () => {
    const rendered = shallow(
      <MessageContent message={{ ...mockQuotedTextMessage, pending: true }} />
    );
    expect(rendered).toMatchSnapshot();
  });

  it('should render quoted image message component correctly', () => {
    const rendered = shallow(<MessageContent message={mockQuotedImageMessage} />);
    expect(rendered).toMatchSnapshot();
  });

  it('should render fileNotFoundInTranscript error when quoted image type message does not have file property', () => {
    const mockMessage = {
      id: '601ad7e0f41170000cced559',
      text: 'This is a quoted message',
      type: 'customer',
      from: 'Irvin Sandoval',
      contentType: 'text',
      resourceId: null,
      timestamp: 1581423633126,
      quotedMessage: {
        content: {
          id: '5e429c11749914000f07349f',
          type: 'file',
        },
      },
    };
    const rendered = shallow(
      <MessageContent message={{ ...mockMessage}} />
    );
    expect(rendered).toMatchSnapshot();
  });

  it('quoted image message has a caption along with the file', () => {
    const mockMessage = {
      id: '601ad7e0f41170000cced559',
      text: 'This is a quoted message',
      type: 'customer',
      from: 'Irvin Sandoval',
      file: {},
      contentType: 'text',
      resourceId: null,
      timestamp: 1581423633126,
      quotedMessage: {
        content: {
          id: '5e429c11749914000f07349f',
          type: 'image',
          file: {
            fileName: 'Test.jpg',
            mediaUrl: `${mockMediaUrl}.jpg`,
          },
          text: 'hey, look at this file!',
        },
      },
    };
    const rendered = shallow(
      <MessageContent
        message={{ ...mockMessage }}
      />
    );
    expect(rendered).toMatchSnapshot();
  });

  it('should render quoted file message component correctly', () => {
    const rendered = shallow(<MessageContent message={mockQuotedFileMessage} />);
    expect(rendered).toMatchSnapshot();
  });


  it('quoted file message does not have fileName property', () => {
    const mockMessage = {
      id: '601ad7e0f41170000cced559',
      text: 'This is a quoted message',
      type: 'customer',
      from: 'Irvin Sandoval',
      file: {},
      contentType: 'text',
      resourceId: null,
      timestamp: 1581423633126,
      quotedMessage: {
        content: {
          id: '5e429c11749914000f07349f',
          type: 'file',
          file: {
            mediaUrl: `${mockMediaUrl}.pdf`,
            mediaType: 'text/pdf',
          },
        },
      },
    };
    const rendered = shallow(
      <MessageContent message={{ ...mockMessage }} />
    );
    expect(rendered).toMatchSnapshot();
  });

  it('quoted file message is "video/mp4" format and has a text property with its name', () => {
    const mockMessage = {
      id: '601ad7e0f41170000cced559',
      text: 'This is a quoted message',
      type: 'customer',
      from: 'Irvin Sandoval',
      file: {},
      contentType: 'text',
      resourceId: null,
      timestamp: 1581423633126,
      quotedMessage: {
        content: {
          id: '5e429c11749914000f07349f',
          type: 'file',
          file: {
            fileName: '83hbu88d88dh-99ajffjf-11f4.mp4',
            mediaUrl: `${mockMediaUrl}.mp4`,
            mediaType: 'video/mp4',
          },
          text: 'most-awesome-video.mp4',
        },
      },
    };
    const rendered = shallow(
      <MessageContent message={{ ...mockMessage }} />
    );
    expect(rendered).toMatchSnapshot();
  });

  it('quoted file message is "video/mp4" format and has a caption', () => {
    const mockMessage = {
      id: '601ad7e0f41170000cced559',
      text: 'This is a quoted message',
      type: 'customer',
      from: 'Irvin Sandoval',
      file: {},
      contentType: 'text',
      resourceId: null,
      timestamp: 1581423633126,
      quotedMessage: {
        content: {
          id: '5e429c11749914000f07349f',
          type: 'file',
          file: {
            fileName: '83hbu88d88dh-99ajffjf-11f4.mp4',
            mediaUrl: `${mockMediaUrl}.mp4`,
            mediaType: 'video/mp4',
          },
          text: 'Hey look at this video!!',
        },
      },
    };
    const rendered = shallow(
      <MessageContent message={{ ...mockMessage }} />
    );
    expect(rendered).toMatchSnapshot();
  });

  it('should render fileNotFoundInTranscript error when quoted file message does not have file property', () => {
    const mockMessage = {
      id: '601ad7e0f41170000cced559',
      text: 'This is a quoted message',
      type: 'customer',
      from: 'Irvin Sandoval',
      contentType: 'text',
      resourceId: null,
      timestamp: 1581423633126,
      quotedMessage: {
        content: {
          id: '5e429c11749914000f07349f',
          type: 'file',
        },
      },
    };
    const rendered = shallow(
      <MessageContent message={{ ...mockMessage }} />
    );
    expect(rendered).toMatchSnapshot();
  });

  it('should render styled component with quoted text message', () => {
    const rendered = mount(<StyledMessageContent message={mockQuotedTextMessage} />);
    expect(rendered).toMatchSnapshot();
  });

  it('should render styled component with quoted text message in a pending state', () => {
    const rendered = mount(
      <StyledMessageContent message={{ ...mockQuotedTextMessage, pending: true }} />
    );
    expect(rendered).toMatchSnapshot();
  });
});
