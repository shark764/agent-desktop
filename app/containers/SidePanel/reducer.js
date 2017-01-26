/*
 *
 * SidePanel reducer
 *
 */

import { fromJS } from 'immutable';
import {
  SET_CONTACT_LAYOUT,
  SET_CONTACT_ATTRIBUTES,
} from './constants';

const initialState = fromJS({
  contactLayout: [
    {
      label: {
        en: 'Personal Information',
        fr: 'Coordonnées',
      },
      attributes: [
        'aa4a1fd8-4f81-42a7-8fbe-60e6634dac81',
        'a9421440-f508-4b46-ad82-5e17806de064',
      ],
    },
    {
      label: {
        en: 'Contact Information',
      },
      attributes: [
        'a9421440-f508-4b46-ad82-5e17806de065',
        'a9421440-f508-4b46-ad82-5e17806de066',
        '49bb3ef8-0e96-4cb3-83f3-8e97b9b20972',
        '49bb3ef8-0e96-4cb3-83f3-8e97b9b20973',
      ],
    },
    {
      label: {
        en: 'Address Information',
      },
      attributes: [
        'a9421440-f508-4b46-ad82-5e17806de067',
        'a9421440-f508-4b46-ad82-5e17806de068',
        'a9421440-f508-4b46-ad82-5e17806de069',
        'a9421440-f508-4b46-ad82-5e17806de070',
        'a9421440-f508-4b46-ad82-5e17806de071',
      ],
    },
  ],
  contactAttributes: [
    {
      id: 'aa4a1fd8-4f81-42a7-8fbe-60e6634dac81',
      label: {
        'en-US': 'Name',
        en: 'Name',
        fr: 'Nom',
      },
      objectName: 'name',
      type: 'text',
      mandatory: true,
      default: 'Jane Doe',
      created: '2016-07-18T19:44:54Z',
      createdBy: '6b287680-4ccf-4ffb-8256-646e0febf780',
      updated: '2016-07-18T19:44:54Z',
      updatedBy: '6b287680-4ccf-4ffb-8256-646e0febf780',
    },
    {
      id: '49bb3ef8-0e96-4cb3-83f3-8e97b9b20972',
      label: {
        'en-US': 'Cell',
        en: 'Mobile',
        fr: 'Mobile',
      },
      objectName: 'mobile',
      type: 'phone',
      mandatory: false,
      default: '',
      created: '2016-07-18T19:44:54Z',
      createdBy: '6b287680-4ccf-4ffb-8256-646e0febf780',
      updated: '2016-07-18T19:44:54Z',
      updatedBy: '6b287680-4ccf-4ffb-8256-646e0febf780',
    },
    {
      id: '49bb3ef8-0e96-4cb3-83f3-8e97b9b20973',
      label: {
        en: 'Email',
      },
      objectName: 'email',
      type: 'email',
      mandatory: false,
      default: '',
      created: '2016-07-18T19:44:54Z',
      createdBy: '6b287680-4ccf-4ffb-8256-646e0febf780',
      updated: '2016-07-18T19:44:54Z',
      updatedBy: '6b287680-4ccf-4ffb-8256-646e0febf780',
    },
    {
      id: 'a9421440-f508-4b46-ad82-5e17806de064',
      label: {
        en: 'Age',
        fr: 'Âge',
      },
      objectName: 'age',
      type: 'number',
      mandatory: false,
      default: '',
      created: '2016-07-18T19:44:54Z',
      createdBy: '6b287680-4ccf-4ffb-8256-646e0febf780',
      updated: '2016-07-18T19:44:54Z',
      updatedBy: '6b287680-4ccf-4ffb-8256-646e0febf780',
    },
    {
      id: 'a9421440-f508-4b46-ad82-5e17806de065',
      label: {
        en: 'Title',
        fr: 'Title',
      },
      objectName: 'title',
      type: 'text',
      mandatory: false,
      default: '',
      created: '2016-07-18T19:44:54Z',
      createdBy: '6b287680-4ccf-4ffb-8256-646e0febf780',
      updated: '2016-07-18T19:44:54Z',
      updatedBy: '6b287680-4ccf-4ffb-8256-646e0febf780',
    },
    {
      id: 'a9421440-f508-4b46-ad82-5e17806de066',
      label: {
        en: 'Market Segment',
        fr: 'Market Segment',
      },
      objectName: 'marketSegment',
      type: 'text',
      mandatory: false,
      default: '',
      created: '2016-07-18T19:44:54Z',
      createdBy: '6b287680-4ccf-4ffb-8256-646e0febf780',
      updated: '2016-07-18T19:44:54Z',
      updatedBy: '6b287680-4ccf-4ffb-8256-646e0febf780',
    },
    {
      id: 'a9421440-f508-4b46-ad82-5e17806de067',
      label: {
        en: 'Mailing Address 1',
        fr: 'Mailing Address 1',
      },
      objectName: 'address1',
      type: 'text',
      mandatory: false,
      default: '',
      created: '2016-07-18T19:44:54Z',
      createdBy: '6b287680-4ccf-4ffb-8256-646e0febf780',
      updated: '2016-07-18T19:44:54Z',
      updatedBy: '6b287680-4ccf-4ffb-8256-646e0febf780',
    },
    {
      id: 'a9421440-f508-4b46-ad82-5e17806de068',
      label: {
        en: 'Mailing Address 2',
        fr: 'Mailing Address 2',
      },
      objectName: 'address2',
      type: 'text',
      mandatory: false,
      default: '',
      created: '2016-07-18T19:44:54Z',
      createdBy: '6b287680-4ccf-4ffb-8256-646e0febf780',
      updated: '2016-07-18T19:44:54Z',
      updatedBy: '6b287680-4ccf-4ffb-8256-646e0febf780',
    },
    {
      id: 'a9421440-f508-4b46-ad82-5e17806de069',
      label: {
        en: 'Mailing City',
        fr: 'Mailing City',
      },
      objectName: 'city',
      type: 'text',
      mandatory: false,
      default: '',
      created: '2016-07-18T19:44:54Z',
      createdBy: '6b287680-4ccf-4ffb-8256-646e0febf780',
      updated: '2016-07-18T19:44:54Z',
      updatedBy: '6b287680-4ccf-4ffb-8256-646e0febf780',
    },

    {
      id: 'a9421440-f508-4b46-ad82-5e17806de070',
      label: {
        en: 'Mailing State',
        fr: 'Mailing State',
      },
      objectName: 'state',
      type: 'text',
      mandatory: false,
      default: '',
      created: '2016-07-18T19:44:54Z',
      createdBy: '6b287680-4ccf-4ffb-8256-646e0febf780',
      updated: '2016-07-18T19:44:54Z',
      updatedBy: '6b287680-4ccf-4ffb-8256-646e0febf780',
    },
    {
      id: 'a9421440-f508-4b46-ad82-5e17806de071',
      label: {
        en: 'Mailing Zip Code',
        fr: 'Mailing Zip Code',
      },
      objectName: 'zipCode',
      type: 'text',
      mandatory: false,
      default: '',
      created: '2016-07-18T19:44:54Z',
      createdBy: '6b287680-4ccf-4ffb-8256-646e0febf780',
      updated: '2016-07-18T19:44:54Z',
      updatedBy: '6b287680-4ccf-4ffb-8256-646e0febf780',
    },
  ],
});

function sidePanelReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CONTACT_LAYOUT:
      return state.set('contactLayout', action.layout);
    case SET_CONTACT_ATTRIBUTES:
      return state.set('contactLayout', action.attributes);
    default:
      return state;
  }
}

export default sidePanelReducer;
