import React from 'react';
import { shallow } from 'enzyme';
import MessageContent from '../index';

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

  it('should render text message content correctly', () => {
    const rendered = shallow(<MessageContent message={mockTextMessage} />);
    expect(
      rendered
        .find('MessageTextContainer')
        .children()
        .text()
    ).toEqual(mockTextMessage.text);
  });

  it('should render image message component correctly', () => {
    const rendered = shallow(<MessageContent message={mockImageMessage} />);
    expect(rendered).toMatchSnapshot();
  });

  it('should render Image component', () => {
    const rendered = shallow(<MessageContent message={mockImageMessage} />);
    expect(rendered.find('Image').length).toEqual(1);
  });

  it('should render file message name correctly', () => {
    const fileName = mockFileMessage.file.mediaUrl.split('/')[
      mockFileMessage.file.mediaUrl.split('/').length - 1
    ];
    const rendered = shallow(<MessageContent message={mockFileMessage} />);
    expect(
      rendered
        .find('FileNameContainer')
        .children()
        .text()
    ).toEqual(fileName);
  });

  it('should render file message component correctly', () => {
    const rendered = shallow(<MessageContent message={mockFileMessage} />);
    expect(rendered).toMatchSnapshot();
  });
});
