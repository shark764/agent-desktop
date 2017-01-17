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
        'aa4a1fd8-4f81-42a7-8fbe-60e6634dac8b',
        'a9421440-f508-4b46-ad82-5e17806de066',
      ],
    },
    {
      label: {
        en: 'Contact Information',
      },
      attributes: [
        '49bb3ef8-0e96-4cb3-83f3-8e97b9b2097e',
        '49bb3ef8-0e96-4cb3-83f3-8e97b9b2097r',
      ],
    },
  ],
  contactAttributes: [
    {
      id: 'aa4a1fd8-4f81-42a7-8fbe-60e6634dac8b',
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
      id: '49bb3ef8-0e96-4cb3-83f3-8e97b9b2097e',
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
      id: '49bb3ef8-0e96-4cb3-83f3-8e97b9b2097r',
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
      id: 'a9421440-f508-4b46-ad82-5e17806de066',
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
