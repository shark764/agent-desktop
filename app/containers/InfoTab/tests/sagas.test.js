/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import { fromJS } from 'immutable';
import { goValidateContactLayoutTranslations } from 'containers/InfoTab/sagas';

const locale = 'en-US';
const contactAttributes = [
  { id: '1', label: { 'en-US': 'Attribute one' } },
  { id: '2', label: { 'en-US': 'Attribute two' } },
];
const contactLayout = {
  layout: [{ label: { 'en-US': 'Contact layout' }, attributes: ['1', '2'] }],
};

let oneTimeNotifications = [];

describe('goValidateContactLayoutTranslations saga', () => {
  let generator;
  describe('if no locales are missing', () => {
    beforeAll(() => {
      generator = goValidateContactLayoutTranslations();
    });
    it('should select locale', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('should select attributes', () => {
      expect(generator.next(locale)).toMatchSnapshot();
    });
    it('should select layout', () => {
      expect(generator.next(contactAttributes)).toMatchSnapshot();
    });
    it('should select oneTimeNotifications', () => {
      expect(generator.next(contactLayout)).toMatchSnapshot();
    });
    it('should be finished', () => {
      expect(generator.next(oneTimeNotifications)).toMatchSnapshot();
    });
  });
  describe('if locale is missing in layout', () => {
    let contactLayoutWithMissingTranslation;
    beforeAll(() => {
      contactLayoutWithMissingTranslation = Object.assign({}, contactLayout);
      contactLayoutWithMissingTranslation.layout[0].label = {
        'fr-CA': 'Mise en page des contacts',
      };
      generator = goValidateContactLayoutTranslations();
    });
    it('should select locale', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('should select attributes', () => {
      expect(generator.next(locale)).toMatchSnapshot();
    });
    it('should select layout', () => {
      expect(
        generator.next(contactLayoutWithMissingTranslation)
      ).toMatchSnapshot();
    });
    it('should select oneTimeNotifications', () => {
      expect(generator.next(contactLayout)).toMatchSnapshot();
    });
    it('should select the next notification id', () => {
      expect(generator.next(oneTimeNotifications)).toMatchSnapshot();
    });
    it('should add the addOneTimeNotification', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('should add the notification', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('should be finished', () => {
      expect(generator.next()).toMatchSnapshot();
    });
  });
  describe('if locale is missing in attribute', () => {
    let contactAttributesWithMissingTranslation;
    beforeAll(() => {
      contactAttributesWithMissingTranslation = Object.assign(
        {},
        contactAttributes
      );
      contactAttributesWithMissingTranslation[1].label = {
        'fr-CA': 'Attribut deux',
      };
      generator = goValidateContactLayoutTranslations();
    });
    it('should select locale', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('should select attributes', () => {
      expect(generator.next(locale)).toMatchSnapshot();
    });
    it('should select layout', () => {
      expect(
        generator.next(contactAttributesWithMissingTranslation)
      ).toMatchSnapshot();
    });
    it('should select oneTimeNotifications', () => {
      expect(generator.next(contactLayout)).toMatchSnapshot();
    });
    it('should select the next notification id', () => {
      expect(generator.next(oneTimeNotifications)).toMatchSnapshot();
    });
    it('should add the addOneTimeNotification', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('should add the notification', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('should be finished', () => {
      expect(generator.next()).toMatchSnapshot();
    });
  });
  describe('if locale is missing in attribute and notification has already been shown', () => {
    let contactAttributesWithMissingTranslation;
    beforeAll(() => {
      contactAttributesWithMissingTranslation = Object.assign(
        {},
        contactAttributes
      );
      contactAttributesWithMissingTranslation[1].label = {
        'fr-CA': 'Attribut deux',
      };
      oneTimeNotifications = fromJS([
        { id: '1', label: { 'en-US': 'Attribute one' } },
      ]);
      generator = goValidateContactLayoutTranslations();
    });
    it('should select locale', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('should select attributes', () => {
      expect(generator.next(locale)).toMatchSnapshot();
    });
    it('should select layout', () => {
      expect(
        generator.next(contactAttributesWithMissingTranslation)
      ).toMatchSnapshot();
    });
    it('should select oneTimeNotifications', () => {
      expect(generator.next(contactLayout)).toMatchSnapshot();
    });
    it('should be finished', () => {
      expect(generator.next(oneTimeNotifications)).toMatchSnapshot();
    });
  });
});
