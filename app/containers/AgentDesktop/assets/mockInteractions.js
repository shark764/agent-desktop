/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import cloneDeep from 'lodash/cloneDeep';
import { activeContactFormBlank } from 'models/Interaction/Interaction';

const processedDispositionDetails = {
  dispositions: [
    {
      name: 'Cat 1',
      dispositions: [
        {
          shared: true,
          tenantId: '57e2f960-3328-11e6-8dd4-c88eee4d9f61',
          externalId: null,
          active: true,
          name: 'Issue resolved',
          sortOrder: 0,
          dispositionId: '89c2d1d0-332d-11e6-8dd4-c88eee4d9f61',
          hierarchy: [
            'Cat 1'
          ],
          description: 'Issue resolved'
        },
        {
          shared: true,
          tenantId: '57e2f960-3328-11e6-8dd4-c88eee4d9f61',
          externalId: null,
          active: true,
          name: 'Refund',
          sortOrder: 1,
          dispositionId: '89c34700-332d-11e6-8dd4-c88eee4d9f61',
          hierarchy: [
            'Cat 1'
          ],
          description: 'Refund'
        }
      ],
      type: 'category'
    },
    {
      shared: true,
      tenantId: '57e2f960-3328-11e6-8dd4-c88eee4d9f61',
      externalId: null,
      active: true,
      name: 'Partial refund',
      sortOrder: 2,
      dispositionId: '89c39520-332d-11e6-8dd4-c88eee4d9f61',
      hierarchy: [],
      description: 'Partial refund'
    }
  ],
  forceSelect: true,
  selected: []
};

const script = {
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
          name: 'AppleJacks ',
          value: 'wow1'
        },
        {
          name: 'Raisin Bran',
          value: 'wow2'
        },
        {
          name: 'Cheerios',
          value: 'wow3'
        },
        {
          name: 'Cocoa Puffs',
          value: 'wow4'
        },
        {
          name: 'Cinnamon Toast Crunch',
          value: 'wow5'
        },
        {
          name: 'Frosted Flakes',
          value: 'wow6'
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
};

const customFields = [
  {
    label: 'Field 1',
    value: 'Value 1',
  },
  {
    label: 'Field 2',
    value: 'Value 2',
  },
  {
    label: 'Field 3',
    value: 'Value 3',
  },
];

const outboundConnectingVoiceInteraction = {
  interactionId: 'outbound-voice-interaction-1',
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

const voiceInteraction = {
  channelType: 'voice',
  interactionId: 'voice-interaction-1',
  status: 'work-accepted', // 'wrapup', // 'work-initiated',
  timeout: Date.now() + 70000,
  number: '+3134126623',
  contact: {
    attributes: {
      name: 'Jazz Finner'
    },
  },
  query: {},
  autoAnswer: false,
  dispositionDetails: processedDispositionDetails,
  activeContactForm: activeContactFormBlank,
  wrapupDetails: {
    wrapupUpdateAllowed: true,
    wrapupEnabled: true,
    wrapupTime: '45',
    targetWrapupTime: '30',
  },
  warmTransfers: [],
  selectedSidePanelTab: 'info',
  note: {
    body: '',
    title: '',
    notesPanelHeight: 300,
  },
  customFields,
  customFieldsCollapsed: true,
};

const voiceInteractionWithTransfersAndScripts = {
  channelType: 'voice',
  interactionId: '0000000-0000-0000-0000-3333333333333',
  status: 'work-accepted', // 'wrapup', // 'work-offer',
  timeout: Date.now() + 60000,
  number: '+3134126623',
  query: {},
  dispositionDetails: processedDispositionDetails,
  activeContactForm: activeContactFormBlank,
  wrapupDetails: {
    wrapupUpdateAllowed: true,
    wrapupEnabled: true,
    wrapupTime: '45',
    targetWrapupTime: '30',
  },
  script: script,
  selectedSidePanelTab: 'info',
  note: {
    body: '',
    title: '',
    notesPanelHeight: 300,
  },
  recording: true,
  agentRecordingEnabled: true,
  onHold: true,
  meOnHold: true,
  warmTransfers: [
    {
      id: '1111111',
      type: 'agent',
      name: 'Agent with a very very very long name',
      status: 'connected',
      onHold: true,
      targetResource: 'targetResource1',
      addedTimestamp: Date.now() - 10000,
    }, {
      id: '22222',
      type: 'queue',
      name: 'Queue #1',
      status: 'connected',
      muted: true,
      targetResource: 'targetResource2',
      addedTimestamp: Date.now() - 5000,
    // }, {
    //   id: '33333',
    //   type: 'pstn',
    //   name: 'Some PSTN number',
    //   status: 'transferring',
    //   addedTimestamp: Date.now(),
    },
  ],
};

// Remove emailDetails and emailHtmlBody to mock loading states.
const emailInteraction = {
  customFields,
  customFieldsCollapsed: true,
  channelType: 'email',
  interactionId: '0000000-0000-0000-0000-222222222222',
  customer: 'jclowater-longlonglonglonglonglonglonglonglonglong@serenova.com',
  autoAnswer: false,
  status: 'work-accepted', // 'work-initiated', 'work-ended-pending-script'
  timeout: Date.now() + 60000,
  dispositionDetails: processedDispositionDetails,
  activeContactForm: activeContactFormBlank,
  wrapupDetails: {
    wrapupUpdateAllowed: true,
    wrapupEnabled: true,
    wrapupTime: '20',
    targetWrapupTime: '10',
  },
  query: {},
  selectedSidePanelTab: 'script',
  script: script,
  note: {
    body: '',
    title: '',
    notesPanelHeight: 300,
  },
  // Add sendingReply to mock the state between an email reply being sent and the interaction ending
  // sendingReply: true,
  // emailReply: {
  //   tos: [
  //     {
  //       address: 'jclowater@serenova.com',
  //       name: 'Joshua Clowater'
  //     }
  //   ],
  //   ccs: [
  //     {
  //       address: 'jclowater@serenova.com',
  //       name: 'Joshua Clowater'
  //     },
  //     {
  //       address: 'josh.clowater@gmail.com',
  //       name: 'josh.clowater@gmail.com'
  //     }
  //   ],
  //   bccs: [],
  //   subject: 'RE: ergerg',
  //   attachments: [],
  //   message: ''
  // },
  emailPlainBody: 'erggregre\r\n\r\nre\r\n\r\n\r\n\r\n        gregr\r\n\r\n\r\n\r\n        ergreg\r\n\r\n',
  emailHtmlBody: '<html><head>\r\n<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">\r\n<style type="text/css" style="display:none;"><!-- P {margin-top:0;margin-bottom:0;} --></style>\r\n</head>\r\n<body dir="ltr">\r\n<div id="divtagdefaultwrapper" style="font-size:12pt;color:#000000;font-family:Calibri,Arial,Helvetica,sans-serif;" dir="ltr">\r\n<p>erggregre</p>\r\n<p>\r\n<table cellspacing="0" role="table" class="ms-rteTable-default" style="border-collapse:collapse; border: 1px solid rgb(198, 198, 198);">\r\n<tbody>\r\n<tr>\r\n<td class="ms-rteTable-default" style="border-collapse: collapse; border: 1px solid rgb(198, 198, 198); width: 120px;">\r\nre</td>\r\n<td class="ms-rteTable-default" style="border-collapse: collapse; border: 1px solid rgb(198, 198, 198); width: 120px;">\r\n<br>\r\n</td>\r\n<td class="ms-rteTable-default" style="border-collapse: collapse; border: 1px solid rgb(198, 198, 198); width: 120px;">\r\n<br>\r\n</td>\r\n</tr>\r\n<tr>\r\n<td class="ms-rteTable-default" style="border-collapse:collapse; border: 1px solid rgb(198, 198, 198);">\r\n<br>\r\n</td>\r\n<td class="ms-rteTable-default" style="border-collapse:collapse; border: 1px solid rgb(198, 198, 198);">\r\ngregr</td>\r\n<td class="ms-rteTable-default" style="border-collapse:collapse; border: 1px solid rgb(198, 198, 198);">\r\n<br>\r\n</td>\r\n</tr>\r\n<tr>\r\n<td class="ms-rteTable-default" style="border-collapse:collapse; border: 1px solid rgb(198, 198, 198);">\r\n<br>\r\n</td>\r\n<td class="ms-rteTable-default" style="border-collapse:collapse; border: 1px solid rgb(198, 198, 198);">\r\n<br>\r\n</td>\r\n<td class="ms-rteTable-default" style="border-collapse:collapse; border: 1px solid rgb(198, 198, 198);">\r\nergreg</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<br>\r\n</p>\r\n</div>\r\n</body>\r\n</html>\r\n',
  emailDetails: {
     cc: [
       {
         address: 'jclowater@serenova.com',
         name: 'Joshua Clowater'
       },
       {
         address: 'josh.clowater@gmail.com',
         name: 'josh.clowater@gmail.com'
       }
     ],
     'date-received': '2017-03-15T16:07:27Z',
     bcc: [],
     body: {
       html: {
         filename: 'body-html',
         headers: [
           {
             'Content-Type': 'text/html; charset="iso-8859-1"'
           },
           {
             'Content-Transfer-Encoding': 'quoted-printable'
           },
           {
             'X-Microsoft-Exchange-Diagnostics': '1;MWHPR22MB0528;27:g3U/PO60LY3fQO7LovQAPMK/h9ADwMXBo0yAxqixSnsHVwk8KKif68BbOm0PX9tEwPzJb37bW+cK5jKuZdgg9GX/aFrIXIzYm/eQa87pqp/9kybCSusPkc1lspZGBzbqu4lu0zY/wQJN1gNNAWPiXA=='
           },
           {
             'X-Microsoft-Antispam-Mailbox-Delivery': 'abwl:0;wl:0;pcwl:0;kl:0;iwl:0;ijl:0;dwl:0;dkl:0;rwl:0;ex:0;auth:1;dest:I;WIMS-SenderIP:104.47.42.62;WIMS-SPF:serenova%2ecom;WIMS-DKIM:serenova%2ecom;WIMS-822:jclowater%40serenova%2ecom;WIMS-PRA:jclowater%40serenova%2ecom;WIMS-AUTH:PASS;ENG:(5061607094)(102400140);'
           }
         ],
         artifactFileId: '138fb634-1baf-457e-bcf5-5bb153995918'
       },
       plain: {
         filename: 'body-plain',
         headers: [
           {
             'Content-Type': 'text/plain; charset="iso-8859-1"'
           },
           {
             'Content-Transfer-Encoding': 'quoted-printable'
           },
           {
             'X-Microsoft-Exchange-Diagnostics': '1;MWHPR22MB0528;27:g3U/PO60LY3fQO7LovQAPMK/h9ADwMXBo0yAxqixSnsHVwk8KKif68BbOm0PX9tEwPzJb37bW+cK5jKuZdgg9GX/aFrIXIzYm/eQa87pqp/9kybCSusPkc1lspZGBzbqu4lu0zY/wQJN1gNNAWPiXA=='
           },
           {
             'X-Microsoft-Antispam-Mailbox-Delivery': 'abwl:0;wl:0;pcwl:0;kl:0;iwl:0;ijl:0;dwl:0;dkl:0;rwl:0;ex:0;auth:1;dest:I;WIMS-SenderIP:104.47.42.62;WIMS-SPF:serenova%2ecom;WIMS-DKIM:serenova%2ecom;WIMS-822:jclowater%40serenova%2ecom;WIMS-PRA:jclowater%40serenova%2ecom;WIMS-AUTH:PASS;ENG:(5061607094)(102400140);'
           }
         ],
         artifactFileId: 'bf13896e-53c3-4878-9af6-f19028b7dac3'
       }
     },
     headers: [
       {
         'MIME-Version': '1.0'
       },
       {
         Received: 'from MWHPR22CA0011.namprd22.prod.outlook.com (10.172.163.149) by MWHPR22MB0528.namprd22.prod.outlook.com (10.172.171.18) with Microsoft SMTP Server (version=TLS1_2, cipher=TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384_P384) id 15.1.947.12 via Mailbox Transport; Wed, 15 Mar 2017 16:07:27 +0000'
       },
       {
         Received: 'from inbound.mail.protection.outlook.com (216.32.180.85) by MWHPR22CA0011.outlook.office365.com (10.172.163.149) with Microsoft SMTP Server (version=TLS1_2, cipher=TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384_P384) id 15.1.977.11 via Frontend Transport; Wed, 15 Mar 2017 16:07:27 +0000'
       },
       {
         Received: 'from SN1NAM04FT043.eop-NAM04.prod.protection.outlook.com (10.152.88.55) by SN1NAM04HT110.eop-NAM04.prod.protection.outlook.com (10.152.89.168) with Microsoft SMTP Server (version=TLS1_2, cipher=TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384_P384) id 15.1.961.10; Wed, 15 Mar 2017 16:07:26 +0000'
       },
       {
         'Authentication-Results': 'spf=pass (sender IP is 104.47.42.62) smtp.mailfrom=serenova.com; outlook.com; dkim=pass (signature was verified) header.d=SERENOVA.COM;outlook.com; dmarc=pass action=none header.from=serenova.com;'
       },
       {
         'Received-SPF': 'Pass (protection.outlook.com: domain of serenova.com designates 104.47.42.62 as permitted sender) receiver=protection.outlook.com; client-ip=104.47.42.62; helo= NAM03-BY2-obe.outbound.protection.outlook.com;'
       },
       {
         Received: 'from COL004-MC3F22.hotmail.com (10.152.88.57) by SN1NAM04FT043.mail.protection.outlook.com (10.152.89.45) with Microsoft SMTP Server (version=TLS1_2, cipher=TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384_P384) id 15.1.961.10 via Frontend Transport; Wed, 15 Mar 2017 16:07:26 +0000'
       },
       {
         'X-IncomingTopHeaderMarker': 'OriginalChecksum:B7931E91765CC087916F665CA3A4A278B45245E86F7F0764B7837E1A5CC6E3D0;UpperCasedChecksum:91420C31FD6142BEADD2A7179C79A10F6148B9CB1D69E91CEF4AF69886ABCD1C;SizeAsReceived:4591;Count:36'
       },
       {
         Received: 'from NAM03-BY2-obe.outbound.protection.outlook.com ([104.47.42.62]) by COL004-MC3F22.hotmail.com over TLS secured channel with Microsoft SMTPSVC(7.5.7601.23143); Wed, 15 Mar 2017 09:07:07 -0700'
       },
       {
         'DKIM-Signature': 'v=1; a=rsa-sha256; c=relaxed/relaxed; d=SERENOVA.COM; s=selector2; h=From:Date:Subject:Message-ID:Content-Type:MIME-Version; bh=/F7kI7sOVeybV31UdwEdu5g9Bmp8JXn8sypn10x+iVY=; b=1aqkY/QArpmIevkMWSFp9LL98tXEQEFBwFlYs8cRn3erplqIaQPFF0oPQW0bw0Mg950F4tX6zQzln3jpy/gGQsZUDPmz8c5Q7oGJqE7Z36CXWPjHWFGw8ibJAwgxvc+N+SZmeCVYA9I4D0bO8xwy5X2Iv2eW3a8FkvBhIAAIV+I='
       },
       {
         Received: 'from MWHPR17MB0957.namprd17.prod.outlook.com (10.173.121.11) by MWHPR17MB0959.namprd17.prod.outlook.com (10.173.121.13) with Microsoft SMTP Server (version=TLS1_2, cipher=TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384_P384) id 15.1.961.17; Wed, 15 Mar 2017 16:07:04 +0000'
       },
       {
         Received: 'from MWHPR17MB0957.namprd17.prod.outlook.com ([10.173.121.11]) by MWHPR17MB0957.namprd17.prod.outlook.com ([10.173.121.11]) with mapi id 15.01.0961.020; Wed, 15 Mar 2017 16:07:05 +0000'
       },
       {
         From: 'Joshua Clowater <jclowater@serenova.com>'
       },
       {
         To: '"novaxtech@outlook.com" <novaxtech@outlook.com>'
       },
       {
         Subject: 'ergerg'
       },
       {
         'Thread-Topic': 'ergerg'
       },
       {
         'Thread-Index': 'AQHSnaYwxGuH7/BcUUWJ47whWDZrSQ=='
       },
       {
         Date: 'Wed, 15 Mar 2017 16:07:04 +0000'
       },
       {
         'Message-ID': '<MWHPR17MB09577273A3C96A38D6F92945DD270@MWHPR17MB0957.namprd17.prod.outlook.com>'
       },
       {
         'Accept-Language': 'en-CA, en-US'
       },
       {
         'Content-Language': 'en-CA'
       },
       {
         'X-MS-Has-Attach': ''
       },
       {
         'X-MS-TNEF-Correlator': ''
       },
       {
         'authentication-results': 'outlook.com; dkim=none (message not signed) header.d=none;outlook.com; dmarc=none action=none header.from=serenova.com;'
       },
       {
         'x-originating-ip': '[207.179.161.106]'
       },
       {
         'X-Microsoft-Exchange-Diagnostics-untrusted': '1;MWHPR17MB0959;6:j5aqiX9qAug7pX9gbZHMuGgr/xOKfwVsUncVUq4slM0MYA/MwA7xXEy1AcgmEx0eGEpV5JRhnBSWAT8uefIaspTasFcfFrEA3qgzpXCd3JgC0RDLN7v1mztONRkO13N0mIRPI4uUk7694FF1KRMhzGYLIHoaP9pXk6qxDPZGWXQ7uj+hZJxxHV2P8UmbnsMF1YNs80UURX9+mYRU3jcgdZu5nLXGzR8wOz5s6x4z6o2tG+U84TZmv9SxDvea7E7T0UqrbG9eGy61L6RzVK0diq2SrMssMY5bBxYgf9H99zE=;5:7ZxJAS0we2MiyKr/Oq5FssGpTFU5XoKo6SgHPdPkbxB6R9IiA3+BuHs7x2ZDanxsUcJfPhLP1o+666ZyvDZ4AftA5wYCt0EEGVSuZZC84unybA5kgEhmyJLhnNtH8gyCHcyaZ8u8lq0z0YD7jyH8hQ==;24:JQjch2qKr8lT2y8SyTJTs7DG1tzeibQFiGWVn6pCzTgMaa3ydGU4A0qo12uBQMsj0otxRdWlG8REP9WfqIU07xKZZXUViwFnS+v/LjBj4bA=;7:xHb8vCFcExZC2vhtaoKSzRTkLjEIpWZkZk4kCpzCXBHCv4kTkLC5k7qjOMxDKDJYSpa+0JlKxJJzgtYDCYW/7p1tOakgAQN/cfwEXU5qIXKOKkwedwJZMjb1YJPQrB7/Wv0KO4Uo/fHyaCKT5QrXgq4F3Fk6TVBLXEnK4owpeKXgfKyFM7MphsYji4XcEOBg7Xo1kzNroGgQb5qUzMsPIrVHw5uMJN541A31Du6zXl9xKJvqFJKSFfcXwlYNDTtiG2kvDenzX5yVlg1gPQoI4/KmsbxSPjofYbB+M2ZWNl3ryKGccZZLhHXyBUTurgbaUzMX2uawpm4x+0uFZT4rRw=='
       },
       {
         'X-MS-Office365-Filtering-Correlation-Id': 'cfa8506f-af95-402a-9faf-08d46bbd5fd4'
       },
       {
         'X-Microsoft-Antispam-Untrusted': 'UriScan:;BCL:0;PCL:0;RULEID:(22001);SRVR:MWHPR17MB0959;'
       },
       {
         'x-microsoft-antispam-prvs': '<MWHPR17MB0959BF87BEEC15D2D131C39EDD270@MWHPR17MB0959.namprd17.prod.outlook.com>'
       },
       {
         'x-exchange-antispam-report-test': 'UriScan:;'
       },
       {
         'x-exchange-antispam-report-cfa-test': 'BCL:0;PCL:0;RULEID:(6040375)(601004)(2401047)(5005006)(8121501046)(3002001)(10201501046)(6041248)(20161123562025)(20161123564025)(20161123555025)(20161123558025)(20161123560025)(6072148);SRVR:MWHPR17MB0959;BCL:0;PCL:0;RULEID:;SRVR:MWHPR17MB0959;BCL:0;PCL:0;RULEID:(444111366)(82015058);SRVR:SN1NAM04HT110;BCL:0;PCL:0;RULEID:;SRVR:SN1NAM04HT110;'
       },
       {
         'x-forefront-prvs': '02475B2A01'
       },
       {
         'X-Forefront-Antispam-Report-Untrusted': 'SFV:NSPM;SFS:(10009020)(6009001)(39450400003)(2501003)(53936002)(102836003)(9686003)(3846002)(39060400002)(50986999)(122556002)(7736002)(54356999)(54896002)(8936002)(4270600005)(86362001)(189998001)(6116002)(77096006)(38730400002)(3480700004)(19627405001)(81166006)(110136004)(1730700003)(8676002)(5640700003)(6916009)(74316002)(66066001)(6506006)(588024002)(5660300001)(25786008)(6436002)(221733001)(6606003)(2906002)(99286003)(3280700002)(7696004)(558084003)(33656002)(2351001)(7116003)(3660700001)(55016002)(2900100001)(135393001)(217283001)(220243001);DIR:OUT;SFP:1101;SCL:1;SRVR:MWHPR17MB0959;H:MWHPR17MB0957.namprd17.prod.outlook.com;FPR:;SPF:None;MLV:ovrnspm;PTR:InfoNoRecords;LANG:en;'
       },
       {
         SpamDiagnosticOutput: '1:99'
       },
       {
         SpamDiagnosticMetadata: 'NSPM'
       },
       {
         'Content-Type': 'multipart/alternative; boundary="_000_MWHPR17MB09577273A3C96A38D6F92945DD270MWHPR17MB0957namp_"'
       },
       {
         'X-MS-Exchange-Transport-CrossTenantHeadersStamped': 'MWHPR17MB0959'
       },
       {
         'Return-Path': 'jclowater@serenova.com'
       },
       {
         'X-OriginalArrivalTime': '15 Mar 2017 16:07:07.0131 (UTC) FILETIME=[31B604B0:01D29DA6]'
       },
       {
         'X-IncomingHeaderCount': '36'
       },
       {
         'X-MS-Exchange-Organization-Network-Message-Id': 'cfa8506f-af95-402a-9faf-08d46bbd5fd4'
       },
       {
         'X-EOPAttributedMessage': '0'
       },
       {
         'X-EOPTenantAttributedMessage': '84df9e7f-e9f6-40af-b435-aaaaaaaaaaaa:0'
       },
       {
         'X-MS-Exchange-Organization-MessageDirectionality': 'Incoming'
       },
       {
         'CMM-sender-ip': '104.47.42.62'
       },
       {
         'CMM-sending-ip': '104.47.42.62'
       },
       {
         'CMM-Authentication-Results': 'hotmail.com; spf=pass (sender IP is 104.47.42.62; identity alignment result is pass and alignment mode is relaxed) smtp.mailfrom=jclowater@serenova.com; dkim=pass (identity alignment result is pass and alignment mode is relaxed) header.d=serenova.com; x-hmca=pass header.id=jclowater@serenova.com'
       },
       {
         'CMM-X-SID-PRA': 'jclowater@serenova.com'
       },
       {
         'CMM-X-AUTH-Result': 'PASS'
       },
       {
         'CMM-X-SID-Result': 'PASS'
       },
       {
         'CMM-X-Message-Status': 'n:n'
       },
       {
         'CMM-X-Message-Delivery': 'Vj0xLjE7dXM9MDtsPTE7YT0xO0Q9MTtHRD0xO1NDTD0w'
       },
       {
         'CMM-X-Message-Info': 'l9qkOyR/cpRVB4gl2jVpEwsmhxXIuwcq0A1YqVmiun9IDLG0jEvWH+hkkC9v2R5+tVTWZmZjgofyvwhh8DHX571g18c1RclI9YFhPa6PmbwfPRChTE80G2GY55VI+eFA72kheLQIFlr+FvFuc6ZzSt7s+gO/ZrpiSbEDZgFdDBrhQmTaWBZw/86nYx4+THnSng/4bWCcZa6LXOhtfyjwtbJRwVCHa1YZYdPiv0T2mgqUov0v7WoISIcr7c10I123'
       },
       {
         'X-MS-Exchange-Organization-PCL': '2'
       },
       {
         'X-MS-Exchange-Transport-CrossTenantHeadersStripped': 'SN1NAM04FT043.eop-NAM04.prod.protection.outlook.com'
       },
       {
         'X-Microsoft-Exchange-Diagnostics': '1;SN1NAM04FT043;1:XY2M4sU+LVzdDObUNRMx7E/emC6AXW4s5sFDmuwzViROGRlYLCl393h8dRLIiVlvRkp/K4HFRd0FLmnS4q+PnT+BK3WtXrpnuLmk+1TQ0jneeOB7b17oD5DECrG4Vk16f5oJAMJjXzyiQAgkpbR+2IFwOcKqddD2NIErfIe0MkU='
       },
       {
         'X-Forefront-Antispam-Report': 'EFV:NLI;SFV:NSPM;SFS:(98900017);DIR:INB;SFP:;SCL:1;SRVR:SN1NAM04HT110;H:COL004-MC3F22.hotmail.com;FPR:;SPF:None;LANG:en;'
       },
       {
         'X-Microsoft-Antispam': 'BCL:0;PCL:0;RULEID:(22001)(8291500097)(8291501071);SRVR:SN1NAM04HT110;'
       },
       {
         'X-Microsoft-Exchange-Diagnostics': '1;SN1NAM04HT110;3:lFEePicOXVaXEnLvpx4dZPleTPsztZIO95h5lznm7ZurL/7QFtN2Vrl5jzxsvsCGsuHnK16DgiVnzvACGoEV3YZahAKz3d894ZSPW5ErYCU7ojCB5VD3avb89QQ+69hfCOesRO9NiG0nz+lFJXNSnMCIGKt7dxgQJaxboRitJjlfwIq1isUdZx8GRA5Q2wJPqBHZ4xmK7xfmgBiXEkxIUDtb5gdGY0GMtcucu+2d0YSayEfpqbeDo4tt/7WRTLV/UW6IRo9Vc8V7i+JQDTIcJEhl+sJ403ibTDNyzxCw7BvYf/ZQtx/8HXMpVAiOtAcNpyeOI4ANf5JPow/XeQf/46rCtX7G4iZqNLQHwLt0cO0jIlfpQZAHHV5XOZmN1l9l;25:8y/Wvxx/w6mrZf+Z5M80zLYkk/5OsfwKGlZzd2b6597pgdid84cRkLumMVICiT2RSv67guxL78FH6UXF4fPawCrvzPSC4Ml1i97+KGuGQD7COIuwt5wwSCjc6RatyjA3IGsClHuH/Z0N1e1oOZnKJ4XKc9nQrrTsDNcRuSIEMz49xnDy4hirjecPx+bvRskbBcr+3HvDGOg0bap8JZuesh8PRgWdUsaH+dE6jwEbzWCxvlQQM+lwA24mOwii6GcVZOXiLnBWSHwuXhyj+OrPE7ww6j/r7+q+QICQB5oBZLFgP0V7H9IGdjf9WU8SjItHEMFXk/z6vb3yPR+Xe8/b0ZOxb0ulzB4os4VTgFJsEhkfZ/cMiQx74NvklO/41XWf;31:xccuSTpSkDdm0wEHcTfxXcbvKi4f2jlNmyaBD103cbsMiziZPCmgL3HeWbVtByg4q/LCQwPxfr6Nb3Pozhp+HGEm74J5IG0A6U5M4GeSOd6XSsOohfomF3/hjJZqurby+A7acq4gv4zR+wxcx3Y/mA=='
       },
       {
         'X-MS-Exchange-Organization-AVStamp-Service': '1.0'
       },
       {
         'X-Microsoft-Exchange-Diagnostics': '1;SN1NAM04HT110;4:brlqNwlMr63ydFFfTKiINbyxzmc2kzPpqKcYRr0n7icrmXERTFUApA+qCGkMeGseaApf0rCsnmnsuaR4Fsp7wBw7Mk0s/3lNvUfjDTWGZhMAfhte5CwByS4mexoBYOO6t/IGMQ+nWArllxi5nTkYjZ+OOyfcy9Rkxvj6zfLapoFRyJQ1zmXVCyXTct0dsOPRZpzaj+wvWnabj1DoWZS2Pw==;23:rgukZRu4aVrK5i/aKurTLQgxHKPJjbdjo4+pUls5KhNaMp9gcbLODn89nTr+jrScSu0Q43osSKbBU9N3nwMvRzcrWKpMB1GbFCOxrDZf6JgP2T9WV0pa4S04WnW1004RkSsF9v7i4YYf9JNNI7WW1+p+DT7ubD6O4wpvwP8SElqs6ChrYA2bVDzCGJPzvaSKPeABhZmI/KW5VwAcwfdysg==;6:iqcWevv+FMF7Z+SbHqFAuw3s3KuMB3u0YRBTy/fV8GupwmOwh3Kw8RdLg+PrgZXAlop3WnUQuevwMowDdrG0Eqbze0nGVlfu+g1aTH4BOoxDTb19NoJe0/8lKfzAFT1spjoaQ5BtRERxOT139UU9nFpntV1HwEHoR/td+EdI5EjdTo4T2Qj0n3T+FWbC4tkosdYwHtVHzsImu9Dyh7LFhhG2+kg+c7eJdZFEZGq4B5IUvFoWoX3bhgnOkYkotQ5vwXGmf6fcRBLfjk4JzYXYp3RO6iPcz+N5b3pP3DFTP04=;5:A70gkribx1o67THAUz99N3AGQSC/Ip1Z7vD5yL7FsFG2FWeHoDlklDgHT4PLTpXUKDIz3Yxjomaa9ZFyKC4DxiaKfL0fKQdTGRkvvFLp2PW5wZdFqbYBMZO5EytyvRDjzwQimZeO/JzTwx76qWt5Ig=='
       },
       {
         'X-MS-Exchange-Organization-SCL': '1'
       },
       {
         'X-Microsoft-Exchange-Diagnostics': '1;SN1NAM04HT110;24:A4UsPGqqVehd9Yt5n+9RRZX/w+ASOHBiUc7ybxYjiZL6O3QJ0lxEneNFLvuFMZWXAvEdpk8QJcPPI2H5SXQOGCL9jLlhVCiSUR4Pu9KfLPM=;7:lolPya6qWgsWMY5SI4bW3h7KjkZ2qvmrpIM7rU3FEEQUzFh00933nCMrznrzXIVQwdJ6x9Er/Hn4mY40lbulG/uEtDjNzQFF4vbpyNQpGcH8FFXi19FeRzTu+SIJXF4TQxc2G2jS4AYn0NR2VLeXvsbpq5IDn+czsTy5Di+p3TZXYB8huRbJ9XBII6YrZyyVLRSGugiL/a7TIjySTpbjg/0i+J2iPg90LVUHIt7YG6smyu5j/CZy+zaymuyJq0MZPxFYXsxNON36ME6xj21eUZpxfFmjuYsHJfLAxknmcKIMcM2FIL3xYdzDpz5LoLWzCpiz/SE7W3rCAydWzjVl+w=='
       },
       {
         'X-MS-Exchange-CrossTenant-OriginalArrivalTime': '15 Mar 2017 16:07:26.1530 (UTC)'
       },
       {
         'X-MS-Exchange-CrossTenant-Id': '84df9e7f-e9f6-40af-b435-aaaaaaaaaaaa'
       },
       {
         'X-MS-Exchange-CrossTenant-FromEntityHeader': 'Internet'
       },
       {
         'X-MS-Exchange-Transport-CrossTenantHeadersStamped': 'SN1NAM04HT110'
       },
       {
         'X-MS-Exchange-Organization-AuthSource': 'SN1NAM04FT043.eop-NAM04.prod.protection.outlook.com'
       },
       {
         'X-MS-Exchange-Organization-AuthAs': 'Anonymous'
       },
       {
         'X-OriginatorOrg': 'outlook.com'
       },
       {
         'X-MS-Exchange-Transport-EndToEndLatency': '00:00:01.0778816'
       },
       {
         'X-Microsoft-Exchange-Diagnostics': '1;MWHPR22MB0528;27:g3U/PO60LY3fQO7LovQAPMK/h9ADwMXBo0yAxqixSnsHVwk8KKif68BbOm0PX9tEwPzJb37bW+cK5jKuZdgg9GX/aFrIXIzYm/eQa87pqp/9kybCSusPkc1lspZGBzbqu4lu0zY/wQJN1gNNAWPiXA=='
       },
       {
         'X-Microsoft-Antispam-Mailbox-Delivery': 'abwl:0;wl:0;pcwl:0;kl:0;iwl:0;ijl:0;dwl:0;dkl:0;rwl:0;ex:0;auth:1;dest:I;WIMS-SenderIP:104.47.42.62;WIMS-SPF:serenova%2ecom;WIMS-DKIM:serenova%2ecom;WIMS-822:jclowater%40serenova%2ecom;WIMS-PRA:jclowater%40serenova%2ecom;WIMS-AUTH:PASS;ENG:(5061607094)(102400140);'
       }
     ],
     from: [
       {
         address: 'jclowater@serenova.com',
         name: 'Joshua Clowater'
       }
     ],
     subject: 'ergerg',
     'content-type': 'multipart/alternative;  boundary*0=_000_MWHPR17MB09577273A3C96A38D6F92945DD270MWHPR17MB0957namp;  boundary*1=_',
     attachments: [
       {
        filename: 'lgtm.png',
        headers: [
          {
            contentType: 'image/png; name="lgtm.png"'
          },
          {
            contentDescription: 'lgtm.png'
          },
          {
            contentDisposition: 'attachment; filename="lgtm.png"; size=6558; creation-date="Mon, 20 Mar 2017 17:12:07 GMT"; modification-date="Mon, 20 Mar 2017 17:12:07 GMT"'
          },
          {
            contentTransferEncoding: 'base64'
          },
          {
            xMicrosoftExchangeDiagnostics: '1;MWHPR22MB0528;27:f8r9VLyfgVsPUJ6wrzQyqMyKoyW7dnvXEdSf0HeGtQG2kDCrIyxklY0U9+Iq5MzJjM+tQaJkXiPTnnbsEeOG7Tf63TiyjWPsO4arv+8B9fHi9Tq13PA6SngOyoPpcyVoRrkXq2KUfnSt0+H6UXtZhw=='
          },
          {
            xMicrosoftAntispamMailboxDelivery: 'abwl:0;wl:1;pcwl:1;iwl:0;rwl:0;ex:0;auth:1;dest:I;WIMS-SenderIP:104.47.34.54;WIMS-SPF:serenova%2ecom;WIMS-DKIM:serenova%2ecom;WIMS-822:jclowater%40serenova%2ecom;WIMS-PRA:jclowater%40serenova%2ecom;WIMS-AUTH:PASS;ENG:(5061607094)(102400140)(102409045);OFR:TrustedSenderList;'
          }
        ],
        artifactFileId: 'aae9dd03-d241-4e7a-a667-cac1438dcfdf',
        // Comment out url to mock loading attachment state
        url: 'https://cdn.meme.am/instances/63480649.jpg'
       }
     ],
     'multipart?': true,
     sender: null,
     'date-sent': '2017-03-15T16:07:04Z',
     id: '<MWHPR17MB09577273A3C96A38D6F92945DD270@MWHPR17MB0957.namprd17.prod.outlook.com>',
     to: [
       {
         address: 'novaxtech@outlook.com',
         name: 'novaxtech@outlook.com'
       }
     ]
   },
};

const smsInteractionWithLotsOfMessagesAndScript = {
  customFields,
  customFieldsCollapsed: true,
  channelType: 'sms',
  customerAvatarIndex: 5,
  interactionId: 'smsInteractionWithLotsOfMessagesAndScript',
  status: 'work-accepted',
  autoAnswer: false,
  timeout: Date.now() + 60000,
  customer: '+15552213456',
  query: {},
  wrapupDetails: {
    wrapupUpdateAllowed: true,
    wrapupEnabled: true,
    wrapupTime: '20',
    targetWrapupTime: '10',
  },
  note: {
    body: '',
    title: '',
    notesPanelHeight: 300,
  },
  selectedSidePanelTab: 'script',
  dispositionDetails: processedDispositionDetails,
  activeContactForm: activeContactFormBlank,
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
      text: 'this is a test long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long',
      from: '+15552213456',
      type: 'message',
      timestamp: new Date(new Date().setDate(new Date().getDate() - 9)).toISOString(),
    }, {
      text: 'this is a test',
      from: '+15552213456',
      type: 'message',
      timestamp: new Date(new Date().setDate(new Date().getDate() - 8)).toISOString(),
    }, {
      text: 'this is a test',
      from: '+15552213456',
      type: 'message',
      timestamp: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString(),
    }, {
      text: 'this is a test',
      from: '+15552213456',
      type: 'message',
      timestamp: new Date(new Date().setDate(new Date().getDate() - 6)).toISOString(),
    }, {
      text: 'this is a test',
      from: '+15552213456',
      type: 'message',
      timestamp: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
    }, {
      text: 'this is a test',
      from: '+15552213456',
      type: 'message',
      timestamp: new Date(new Date().setDate(new Date().getDate() - 4)).toISOString(),
    }, {
      text: 'this is a test',
      from: '+15552213456',
      type: 'message',
      timestamp: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(),
    }, {
      text: 'this is a test',
      from: '+15552213456',
      type: 'message',
      timestamp: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
    }, {
      text: 'this is a test',
      from: '+15552213456',
      type: 'message',
      timestamp: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
    }, {
      text: 'long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long',
      from: '+15552213456',
      type: 'message',
      timestamp: new Date().toISOString(),
    }, {
      text: 'this is a long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long test',
      from: 'Agent',
      type: 'agent',
      timestamp: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
    },
  ],
};

const smsInteractionWithLotsOfMessagesAndScript2 = cloneDeep(smsInteractionWithLotsOfMessagesAndScript);
smsInteractionWithLotsOfMessagesAndScript2.interactionId = 'smsInteractionWithLotsOfMessagesAndScript2';
const smsInteractionWithLotsOfMessagesAndScript3 = cloneDeep(smsInteractionWithLotsOfMessagesAndScript);
smsInteractionWithLotsOfMessagesAndScript3.interactionId = 'smsInteractionWithLotsOfMessagesAndScript3';
const smsInteractionWithLotsOfMessagesAndScript4 = cloneDeep(smsInteractionWithLotsOfMessagesAndScript);
smsInteractionWithLotsOfMessagesAndScript4.interactionId = 'smsInteractionWithLotsOfMessagesAndScript4';
const smsInteractionWithLotsOfMessagesAndScript5 = cloneDeep(smsInteractionWithLotsOfMessagesAndScript);
smsInteractionWithLotsOfMessagesAndScript5.interactionId = 'smsInteractionWithLotsOfMessagesAndScript5';
const smsInteractionWithLotsOfMessagesAndScript6 = cloneDeep(smsInteractionWithLotsOfMessagesAndScript);
smsInteractionWithLotsOfMessagesAndScript6.interactionId = 'smsInteractionWithLotsOfMessagesAndScript6';

const smsInteractionWithUnrespondedMessageAndScript = cloneDeep(smsInteractionWithLotsOfMessagesAndScript);
smsInteractionWithUnrespondedMessageAndScript.interactionId = 'smsInteractionWithUnrespondedMessageAndScript';
smsInteractionWithUnrespondedMessageAndScript.messageHistory.splice(6);
const smsInteractionWithUnrespondedMessageAndScript2 = cloneDeep(smsInteractionWithUnrespondedMessageAndScript);
smsInteractionWithUnrespondedMessageAndScript2.interactionId = 'smsInteractionWithUnrespondedMessageAndScript2';

const scriptOnly = {
  interactionId: 'scriptOnlyInteraction',
  status: 'script-only',
  isScriptOnly: true,
  script: script,
  selectedSidePanelTab: 'info',
  query: {},
  contact: {},
  activeContactForm: activeContactFormBlank
}

const smsWithWrapup = cloneDeep(smsInteractionWithUnrespondedMessageAndScript);
smsWithWrapup.status = 'wrapup';
smsWithWrapup.wrapupStarted = Date.now();
smsWithWrapup.interactionId = 'smsWithWrapup';

export {
  outboundConnectingVoiceInteraction,
  voiceInteraction,
  voiceInteractionWithTransfersAndScripts,
  emailInteraction,
  smsInteractionWithLotsOfMessagesAndScript,
  smsInteractionWithLotsOfMessagesAndScript2,
  smsInteractionWithLotsOfMessagesAndScript3,
  smsInteractionWithLotsOfMessagesAndScript4,
  smsInteractionWithLotsOfMessagesAndScript5,
  smsInteractionWithLotsOfMessagesAndScript6,
  smsInteractionWithUnrespondedMessageAndScript,
  smsInteractionWithUnrespondedMessageAndScript2,
  scriptOnly,
  smsWithWrapup,
};
