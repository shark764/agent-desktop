/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import {
  goEditContact,
  goMergeContacts,
  getInteraction,
  goAddContactNotification,
  goAddContactErrorNotification,
  goSubmitContactCreate,
  goSubmitContactEdit,
  goSubmitContactMerge,
} from 'containers/ContactsControl/sagas';
import { fromJS } from 'immutable';

describe('getInteraction generator', () => {
  let generator;
  describe('if interactionId is undefined', () => {
    beforeEach(() => {
      generator = getInteraction('creating-new-interaction');
    });
    it('should select the no interaction contact panel', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('should complete and yield the selected interaction', () => {
      generator.next();
      expect(generator.next('mockNoInteractionPanel')).toMatchSnapshot();
    });
  });
  describe('if interactionId is creating-new-interaction', () => {
    beforeEach(() => {
      generator = getInteraction('creating-new-interaction');
    });
    it('should select the new interaction contact panel', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('should complete and yield the selected interaction', () => {
      generator.next();
      expect(generator.next('mockNewInteractionPanel')).toMatchSnapshot();
    });
  });
  describe('if interactionId is any other string', () => {
    const mockInteractionList = fromJS([
      { interactionId: 'mockInteractionId' },
      { interactionId: '¡mockInteractionId!' },
    ]);
    beforeEach(() => {
      generator = getInteraction('mockInteractionId');
    });
    it('should select the interaction List', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('should complete and yield the interaction with the specified id', () => {
      generator.next();
      expect(generator.next(mockInteractionList)).toMatchSnapshot();
    });
  });
});

describe('goEditContact Saga', () => {
  const mockLayoutSections = [
    {
      label: 'label',
      attributes: [
        { objectName: 'attribute1', default: 'attribute' },
        { objectName: 'attribute2' },
      ],
    },
  ];

  describe('when action.contact is undefined', () => {
    let generator;
    beforeEach(() => {
      generator = goEditContact({ interactionId: 'mockInteractionId' });
      generator.next();
    });

    it('should init form with default values', () => {
      expect(generator.next(mockLayoutSections)).toMatchSnapshot();
    });

    it('should set editing contacts to an empty object in an array', () => {
      generator.next(mockLayoutSections);
      expect(generator.next()).toMatchSnapshot();
    });

    it('should set contact mode to "create"', () => {
      generator.next(mockLayoutSections);
      generator.next();
      expect(generator.next()).toMatchSnapshot();
    });
  });

  describe('when action.contact is defined', () => {
    let generator;
    beforeEach(() => {
      generator = goEditContact({
        interactionId: 'mockInteractionId',
        contact: {
          attributes: {
            attribute1: 'contact attribute 1',
            attribute2: 'contact attribute 2',
          },
        },
      });
    });

    it('should init form with contact values', () => {
      generator.next();
      expect(generator.next(mockLayoutSections)).toMatchSnapshot();
    });

    it('should set editing contacts to provided contact in array', () => {
      generator.next();
      generator.next(mockLayoutSections);
      expect(generator.next()).toMatchSnapshot();
    });

    it('should set contact mode to "edit"', () => {
      generator.next();
      generator.next(mockLayoutSections);
      generator.next();
      expect(generator.next()).toMatchSnapshot();
    });

    it('should set default values (or blank strings) for attributes created after contact is created', () => {
      mockLayoutSections[0].attributes.push({
        objectName: 'attribute3',
        default: 'A new value',
      });
      mockLayoutSections[0].attributes.push({ objectName: 'attribute4' });
      generator.next();
      expect(generator.next(mockLayoutSections)).toMatchSnapshot();
    });
  });
});

describe('goMergeContacts saga', () => {
  let generator;
  const mockCheckedContacts = [
    {
      id: 'contactId1',
      attributes: {
        attribute1: 'contact 1',
        attribute2: '',
      },
    },
    {
      id: 'contactId2',
      attributes: {
        attribute1: 'contact 2',
        attribute2: '',
      },
    },
  ];
  let mockAttributeMap = fromJS([
    { objectName: 'attribute1', default: 'attribute' },
    { objectName: 'attribute2' },
  ]);
  beforeEach(() => {
    generator = goMergeContacts({ interactionId: 'mockInteractionId' });
    generator.next();
    generator.next(mockCheckedContacts);
  });

  it('should set editing contacts to checked contacts in array', () => {
    expect(generator.next(mockAttributeMap)).toMatchSnapshot();
  });

  it('should init form with contact values and selected indexes', () => {
    generator.next(mockAttributeMap);
    expect(generator.next()).toMatchSnapshot();
  });

  it('should set contact mode to "merge"', () => {
    generator.next(mockAttributeMap);
    generator.next();
    expect(generator.next()).toMatchSnapshot();
  });

  it('should set form validity to true', () => {
    generator.next(mockAttributeMap);
    generator.next();
    generator.next();
    expect(generator.next()).toMatchSnapshot();
  });

  it('should set default values (or blank strings) for attributes created after contact is created', () => {
    mockAttributeMap = mockAttributeMap.push({
      objectName: 'attribute3',
      default: 'A new value',
    });
    mockAttributeMap = mockAttributeMap.push({ objectName: 'attribute4' });
    generator.next(mockAttributeMap);
    expect(generator.next()).toMatchSnapshot();
  });
});

describe('goAddContactNotification Saga', () => {
  let generator;
  const mockNotificationId = 234;
  const mockAction = {
    interactionId: 'mockInteractionId',
    notificationInfo: {
      mockNotificationInfo: 'mockNotificationInfo',
    },
  };
  beforeAll(() => {
    generator = goAddContactNotification(mockAction);
  });
  it('should select the next notification id', () => {
    expect(generator.next()).toMatchSnapshot();
  });
  it('should put the addNotification action with correct keys', () => {
    expect(generator.next(mockNotificationId)).toMatchSnapshot();
  });
  it('should delay for 3000ms', () => {
    expect(generator.next()).toMatchSnapshot();
  });
  it('should put the dismissNotification action with the selected id', () => {
    expect(generator.next()).toMatchSnapshot();
  });
});

describe('goAddContactErrorNotification Saga', () => {
  let generator;
  const mockNotificationId = 234;
  const mockAction = {
    interactionId: 'mockInteractionId',
    notificationInfo: {
      mockNotificationInfo: 'mockNotificationInfo',
    },
  };
  beforeAll(() => {
    generator = goAddContactErrorNotification(mockAction);
  });
  it('should select the next notification id', () => {
    expect(generator.next()).toMatchSnapshot();
  });
  it('should put the addNotification action with correct keys', () => {
    expect(generator.next(mockNotificationId)).toMatchSnapshot();
  });
});

describe('goSubmitContactCreate Saga', () => {
  let generator;
  const mockAction = {
    interactionId: 'mockInteractionId',
  };
  const mockInteraction = {
    activeContactForm: {
      contactForm: 'mockContactForm',
    },
  };
  beforeAll(() => {
    global.CxEngage = {
      contacts: {
        create: 'mockContactCreate',
      },
    };
    generator = goSubmitContactCreate(mockAction);
  });
  it('should call the getInteraction generator with the interactionId', () => {
    expect(generator.next()).toMatchSnapshot();
  });
  it('should put a setContactSaveLoading true action', () => {
    expect(generator.next(mockInteraction)).toMatchSnapshot();
  });
  it('should call the promise util with the contact create SDK method and correct arguments', () => {
    expect(generator.next()).toMatchSnapshot();
  });
  it('should put a addContactNotification action with correct message type', () => {
    expect(generator.next('mockCreatedContact')).toMatchSnapshot();
  });
  it('should put a contactAssign action with the created contact', () => {
    expect(generator.next()).toMatchSnapshot();
  });
  it('should put a set contact mode action', () => {
    expect(generator.next()).toMatchSnapshot();
  });
  it('should put a setContactSaveLoading false action', () => {
    expect(generator.next()).toMatchSnapshot();
  });
  it('should put a resetForm action', () => {
    expect(generator.next()).toMatchSnapshot();
  });
});

describe('goSubmitContactEdit Saga', () => {
  let generator;
  const mockAction = {
    interactionId: 'mockInteractionId',
  };
  const mockInteraction = {
    activeContactForm: {
      contactForm: 'mockContactForm',
      editingContacts: [{ id: 'mockContactId' }],
    },
  };
  beforeAll(() => {
    global.CxEngage = {
      contacts: {
        update: 'mockContactUpdate',
      },
    };
    generator = goSubmitContactEdit(mockAction);
  });
  it('should call the getInteraction generator with the interactionId', () => {
    expect(generator.next()).toMatchSnapshot();
  });
  it('should put a setContactSaveLoading true action', () => {
    expect(generator.next(mockInteraction)).toMatchSnapshot();
  });
  it('should call the promise util with the contact update SDK method and correct arguments', () => {
    expect(generator.next()).toMatchSnapshot();
  });
  it('should put a addContactNotification action with correct message type', () => {
    expect(generator.next()).toMatchSnapshot();
  });
  it('should put a set contact mode action', () => {
    expect(generator.next()).toMatchSnapshot();
  });
  it('should put a setContactSaveLoading false action', () => {
    expect(generator.next()).toMatchSnapshot();
  });
  it('should put a resetForm action', () => {
    expect(generator.next()).toMatchSnapshot();
  });
});

describe('goSubmitContactMerge Saga', () => {
  let generator;
  const mockAction = {
    interactionId: 'mockInteractionId',
  };
  const mockInteractionList = fromJS([
    { interactionId: 'mockInteractionId', contact: { id: 'mockContactId' } },
    { interactionId: 'mockInteractionId1', contact: { id: 'mockContactId1' } },
    { interactionId: 'mockInteractionId2', contact: { id: 'mockContactId2' } },
    { interactionId: '¡mockInteractionId!' },
  ]);
  const mockInteraction = {
    activeContactForm: {
      contact: { id: 'mockContactId' },
      contactForm: 'mockContactForm',
      editingContacts: [{ id: 'mockContactId' }, { id: 'mockContactId1' }],
    },
  };
  beforeAll(() => {
    global.CxEngage = {
      contacts: {
        merge: 'mockContactMerge',
      },
    };
    generator = goSubmitContactMerge(mockAction);
  });
  it('should call the getInteraction generator with the interactionId', () => {
    expect(generator.next()).toMatchSnapshot();
  });
  it('should put a setContactSaveLoading true action', () => {
    expect(generator.next(mockInteraction)).toMatchSnapshot();
  });
  it('should call the promise util with the contact merge SDK method and correct arguments', () => {
    expect(generator.next()).toMatchSnapshot();
  });
  it('should put a addContactNotificationAction with correct message type', () => {
    expect(generator.next('mockNewContact')).toMatchSnapshot();
  });
  it('should select the interactionsList', () => {
    expect(generator.next()).toMatchSnapshot();
  });
  it('should yield an assign contact put for action interaction', () => {
    expect(generator.next(mockInteractionList)).toMatchSnapshot();
  });
  it('should put a set contact mode action', () => {
    expect(generator.next()).toMatchSnapshot();
  });
  it('should yield an assign contact put for each affected interaction', () => {
    expect(generator.next()).toMatchSnapshot();
  });
  it('should put a remove search filter action', () => {
    expect(generator.next()).toMatchSnapshot();
  });
  it('should put a setContactSaveLoading false action', () => {
    expect(generator.next()).toMatchSnapshot();
  });
  it('should put a resetForm action', () => {
    expect(generator.next()).toMatchSnapshot();
  });
});
