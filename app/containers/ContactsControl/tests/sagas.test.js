/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import {
  goEditContact,
  goMergeContacts,
} from 'containers/ContactsControl/sagas';
import { fromJS } from 'immutable';

let generator;
describe('goEditContact Saga', () => {
  const mockLayoutSections = [{
    label: 'label',
    attributes: [
      { objectName: 'attribute1', default: 'attribute' },
      { objectName: 'attribute2' },
    ],
  }];

  describe('when action.contact is undefined', () => {
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
      mockLayoutSections[0].attributes.push({ objectName: 'attribute3', default: 'A new value' });
      mockLayoutSections[0].attributes.push({ objectName: 'attribute4' });
      generator.next();
      expect(generator.next(mockLayoutSections)).toMatchSnapshot();
    });
  });
});

describe('goMergeContacts saga', () => {
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
    mockAttributeMap = mockAttributeMap.push({ objectName: 'attribute3', default: 'A new value' });
    mockAttributeMap = mockAttributeMap.push({ objectName: 'attribute4' });
    generator.next(mockAttributeMap);
    expect(generator.next()).toMatchSnapshot();
  });
});
