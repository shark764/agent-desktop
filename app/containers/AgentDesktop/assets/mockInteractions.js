const outboundConnectingVoiceInteraction = {
  interactionId: 'outbound-interaction-1',
  channelType: 'voice',
  direction: 'outbound',
  status: 'connecting-to-outbound',
  wrapupDetails: {
    wrapupUpdateAllowed: true,
    wrapupEnabled: true,
    wrapupTime: '20',
    targetWrapupTime: '10',
  },
  query: {},
};

const voiceInteractionWithTransfersAndScripts = {
  channelType: 'voice',
  interactionId: '0000000-0000-0000-0000-3333333333333',
  status: 'wrapup', // 'work-offer',
  timeout: Date.now() + 60000,
  number: '+3134126623',
  query: {},
  wrapupDetails: {
    wrapupUpdateAllowed: true,
    wrapupEnabled: true,
    wrapupTime: '45',
    targetWrapupTime: '30',
  },
  script: {
    elements: [
      {
        type: 'text',
        icon: 'fa-font',
        label: 'Text',
        text: 'justText Placeholder',
        id: 'ebe65c75-feda-45c9-852f-62cb6d2faca9',
        name: 'justtext',
        description: 'justTextDescription',
      }, {
        type: 'freeform',
        icon: 'fa-list',
        label: 'Freeform Input',
        text: 'Textinput placeholder',
        id: '5c091844-8d5c-4259-88e0-cef6502baf33',
        name: 'textinput',
        description: 'textinputdescription',
      }, {
        type: 'dropdown',
        icon: 'fa-list-alt',
        label: 'Dropdown',
        text: 'Dropfield Placeholder Text',
        options: [
          {
            name: 'optionname',
            value: 'optionval',
          },
        ],
        inputs: [
          {
            type: 'list',
            name: 'options',
            object: {
              name: 'text',
              value: 'text',
            },
            label: 'Options',
          },
        ],
        id: '6d855feb-4286-4d9d-8799-bc11efe39b03',
        name: 'dropfieldinput',
        description: 'dropfielddescription',
      }, {
        type: 'scale',
        icon: 'fa-circle-o',
        label: 'Scale',
        inputs: [
          {
            type: 'number',
            min: '0',
            max: '1',
            name: 'lowerBound',
            label: 'Lower Bound',
          }, {
            type: 'string',
            name: 'lowerBoundLabel',
            label: 'Lower Bound Label',
          }, {
            type: 'number',
            min: '1',
            max: '10',
            name: 'upperBound',
            label: 'Upper Bound',
          }, {
            type: 'string',
            name: 'upperBoundLabel',
            label: 'Upper Bound Label',
          },
        ],
        text: 'Scale Input Placeholder Text',
        id: '32dd691b-aaed-4e6d-a9db-8aa153c33072',
        name: 'scaleinput',
        description: 'scaleinputdesc',
        lowerBound: 1,
        lowerBoundLabel: 'lower bound label',
        upperBound: 10,
        upperBoundLabel: 'upperboundlabel',
      }, {
        type: 'image',
        icon: 'fa-picture-o',
        label: 'Image',
        text: 'Image Placeholder Text',
        inputs: [
          {
            type: 'string',
            name: 'value',
            label: 'Image source',
          },
        ],
        id: '1ddcde81-e987-40b3-a3f0-7285e691f468',
        name: 'imagefield',
        description: 'imagedescription',
        value: 'https://s-media-cache-ak0.pinimg.com/originals/8c/d0/6a/8cd06a1e9863595ba76ee9932fc4a164.jpg',
      }, {
        type: 'checkbox',
        icon: 'fa-check-square-o',
        label: 'Checkbox',
        text: 'Checkbox Placeholder Text',
        options: [
          {
            name: 'checkoption',
            value: 'checkvalue',
          },
        ],
        inputs: [
          {
            type: 'list',
            name: 'options',
            object: {
              name: 'text',
              value: 'text',
            },
            label: 'Options',
          },
        ],
        id: '51a6a8d7-e22e-4084-b211-f9e119936c7e',
        name: 'checkboxinput',
        description: 'checkboxdescription',
      }, {
        type: 'link',
        icon: 'fa-link',
        label: 'Link',
        text: 'link Placeholder Text',
        inputs: [
          {
            type: 'string',
            name: 'href',
            label: 'Link address',
          },
        ],
        id: '69c5443f-a0eb-4f6f-9bbe-631584427a32',
        name: 'linkinput',
        description: 'linkinputdescription',
        href: 'http://cnn.com',
      },
    ],
    id: '522ca8e2-3edc-497e-a03b-ed34b6608a0c',
    name: 'script',
  },
  recording: true,
  agentRecordingEnabled: true, // false
  warmTransfers: [
    {
      id: '1111111',
      type: 'agent',
      name: 'Agent with a very very very long name',
      status: 'connected',
    }, {
      id: '22222',
      type: 'queue',
      name: 'Queue #1',
      status: 'connected',
    }, {
      id: '33333',
      type: 'pstn',
      name: 'Some PSTN number',
      status: 'transferring',
    },
  ],
};

const emailInteractionWithAttachmentsAndScript = {
  channelType: 'email',
  interactionId: '0000000-0000-0000-0000-111111111',
  status: 'work-accepted', // 'work-offer',
  timeout: Date.now() + 60000,
  query: {},
  wrapupDetails: {
    wrapupUpdateAllowed: true,
    wrapupEnabled: true,
    wrapupTime: '20',
    targetWrapupTime: '10',
  },
  script: {
    elements: [
      {
        type: 'text',
        icon: 'fa-font',
        label: 'Text',
        text: 'Email Text Placeholder',
        id: 'ebe65c75-feda-45c9-852f-62cb6d2faca9',
        name: 'justtext',
        description: 'justTextDescription',
      }, {
        type: 'scale',
        icon: 'fa-circle-o',
        label: 'Scale',
        inputs: [
          {
            type: 'number',
            min: '0',
            max: '1',
            name: 'lowerBound',
            label: 'Lower Bound',
          }, {
            type: 'string',
            name: 'lowerBoundLabel',
            label: 'Lower Bound Label',
          }, {
            type: 'number',
            min: '1',
            max: '10',
            name: 'upperBound',
            label: 'Upper Bound',
          }, {
            type: 'string',
            name: 'upperBoundLabel',
            label: 'Upper Bound Label',
          },
        ],
        text: 'Email Scale Input Placeholder Text',
        id: '32dd691b-aaed-4e6d-a9db-8aa153c33072',
        name: 'scaleinput',
        description: 'scaleinputdesc',
        lowerBound: 1,
        lowerBoundLabel: 'lower bound label',
        upperBound: 10,
        upperBoundLabel: 'upperboundlabel',
      },
    ],
    id: '522ca8e2-3edc-497e-a03b-ed34b6608a0c',
    name: 'script',
  },
  email: {
    to: 'support@help.com',
    from: 'j.englebert@yahoo.com',
    timestamp: new Date().toISOString(),
    subject: 'Files not uploading to my Cloud account',
    attachments: [{ name: 'image.jpg', src: 'http://s14.postimg.org/mkyfiphgx/lgtm_with_gorilla.jpg' }, { name: 'PDF.pdf', src: 'http://www.pdf995.com/samples/pdf.pdf' }],
    content: 'Hello,<br/><br/>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.<br/><br/><b>John Englebert</b><br/>Software Developer<br/>An Organization<br/>313.218.9814',
  },
};

const emailInteraction = {
  channelType: 'email',
  interactionId: '0000000-0000-0000-0000-222222222222',
  status: 'work-accepted', // 'work-offer',
  timeout: Date.now() + 60000,
  wrapupDetails: {
    wrapupUpdateAllowed: true,
    wrapupEnabled: true,
    wrapupTime: '20',
    targetWrapupTime: '10',
  },
  query: {},
  email: {
    to: 'support@help.com',
    from: 'test@yahoo.com',
    timestamp: new Date().toISOString(),
    subject: 'Files not uploading to my Cloud account',
    attachments: [],
    content: 'Hello,<br/><br/><img src="https://assets-cdn.github.com/images/icons/emoji/unicode/1f4dd.png" alt="image test" />Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.<br/><br/><b>John Englebert</b><br/>Software Developer<br/>An Organization<br/>313.218.9814',
  },
};

const smsInteractionWithLotsOfMessagesAndScript = {
  channelType: 'sms',
  customerAvatarIndex: 5,
  interactionId: '11111111111111111111112',
  status: 'work-accepted',
  query: {},
  wrapupDetails: {
    wrapupUpdateAllowed: true,
    wrapupEnabled: true,
    wrapupTime: '20',
    targetWrapupTime: '10',
  },
  script: {
    elements: [
      {
        type: 'text',
        icon: 'fa-font',
        label: 'Text',
        text: 'justText Placeholder',
        id: 'ebe65c75-feda-45c9-852f-62cb6d2faca9',
        name: 'justtext',
        description: 'justTextDescription',
      }, {
        type: 'freeform',
        icon: 'fa-list',
        label: 'Freeform Input',
        text: 'Textinput placeholder',
        id: '5c091844-8d5c-4259-88e0-cef6502baf33',
        name: 'textinput',
        description: 'textinputdescription',
      },
    ],
    id: '522ca8e2-3edc-497e-a03b-ed34b6608a0c',
    name: 'script',
  },
  messageHistory: [
    {
      text: 'this is a test',
      from: '+15552213456',
      type: 'sms',
      timestamp: new Date(new Date().setDate(new Date().getDate() - 9)).toISOString(),
      unread: false,
    }, {
      text: 'this is a test',
      from: '+15552213456',
      type: 'sms',
      timestamp: new Date(new Date().setDate(new Date().getDate() - 8)).toISOString(),
      unread: false,
    }, {
      text: 'this is a test',
      from: '+15552213456',
      type: 'sms',
      timestamp: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString(),
      unread: false,
    }, {
      text: 'this is a test',
      from: '+15552213456',
      type: 'sms',
      timestamp: new Date(new Date().setDate(new Date().getDate() - 6)).toISOString(),
      unread: false,
    }, {
      text: 'this is a test',
      from: '+15552213456',
      type: 'sms',
      timestamp: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
      unread: false,
    }, {
      text: 'this is a test',
      from: '+15552213456',
      type: 'sms',
      timestamp: new Date(new Date().setDate(new Date().getDate() - 4)).toISOString(),
      unread: false,
    }, {
      text: 'this is a test',
      from: '+15552213456',
      type: 'sms',
      timestamp: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(),
      unread: false,
    }, {
      text: 'this is a test',
      from: '+15552213456',
      type: 'sms',
      timestamp: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
      unread: false,
    }, {
      text: 'this is a test',
      from: '+15552213456',
      type: 'sms',
      timestamp: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
      unread: false,
    }, {
      text: 'this is a test',
      from: '+15552213456',
      type: 'sms',
      timestamp: new Date().toISOString(),
      unread: false,
    },
  ],
};

export {
  outboundConnectingVoiceInteraction,
  voiceInteractionWithTransfersAndScripts,
  emailInteractionWithAttachmentsAndScript,
  emailInteraction,
  smsInteractionWithLotsOfMessagesAndScript,
};
