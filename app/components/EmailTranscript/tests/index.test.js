import React from 'react';
import { shallow } from 'enzyme';
import EmailTranscript from '../index';

describe('<EmailTranscript />', () => {
  const mockEmailTranscript = {
    contentType: 'html',
    type: 'email',
    data: '<p>Hello, this is a test message!</p>',
    attachments: [
      {
        artifactFileId: 'artifact-1',
        filename: 'body.txt',
        url: 'https://files.com/body.txt',
      },
      {
        artifactFileId: 'artifact-2',
        filename: 'body.html',
        url: 'https://files.com/body.html',
      },
    ],
    subject: 'Hey i need some help!',
    from: [{ name: 'Scarlett Johanson', address: 'sjohanson@serenova.com' }],
    to: [{ name: 'Emily Blunt', address: 'eblunt@serenova.com' }],
    cc: [],
    bcc: [],
  };

  it('should render email transcript component correctly', () => {
    const rendered = shallow(
      <EmailTranscript transcript={mockEmailTranscript} />
    );
    expect(rendered).toMatchSnapshot();
  });
  it('should render "from" recipients when name === address', () => {
    mockEmailTranscript.from = [
      { name: 'sjohanson@serenova.com', address: 'sjohanson@serenova.com' },
    ];
    const rendered = shallow(
      <EmailTranscript transcript={mockEmailTranscript} />
    );
    expect(rendered).toMatchSnapshot();
  });
  it('should render "cc" recipients', () => {
    mockEmailTranscript.cc = [
      { name: 'Elizabeth Olsen', address: 'eolsen@serenova.com' },
    ];
    const rendered = shallow(
      <EmailTranscript transcript={mockEmailTranscript} />
    );
    expect(rendered).toMatchSnapshot();
  });
  it('should render "bcc" recipients', () => {
    mockEmailTranscript.bcc = [
      { name: 'Karen Gillan', address: 'kgillan@serenova.com' },
    ];
    const rendered = shallow(
      <EmailTranscript transcript={mockEmailTranscript} />
    );
    expect(rendered).toMatchSnapshot();
  });
  it('should render plaintext body when contentType is not html', () => {
    mockEmailTranscript.contentType = 'plainText';
    mockEmailTranscript.data = '>>Hello, this is a test message!';
    const rendered = shallow(
      <EmailTranscript transcript={mockEmailTranscript} />
    );
    expect(rendered).toMatchSnapshot();
  });
});
