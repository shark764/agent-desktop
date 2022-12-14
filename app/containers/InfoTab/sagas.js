/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import { takeEvery, put, select } from 'redux-saga/effects';

import {
  selectLocale,
  selectAttributes,
  selectLayout,
  selectNextNotificationId,
  selectOneTimeNotifications,
} from './selectors';
import { addNotification, addOneTimeNotification } from './actions';
import { VALIDATE_CONTACT_LAYOUT_TRANSLATIONS } from './constants';

export function* goValidateContactLayoutTranslations() {
  const locale = yield select(selectLocale);
  const attributes = yield select(selectAttributes);
  const contactLayout = yield select(selectLayout);
  const oneTimeNotifications = yield select(selectOneTimeNotifications);
  let isOneTimeNotification;
  let isMissingLocaleTranslations;
  contactLayout.layout.forEach((subLayout) => {
    if (subLayout.label[locale] === undefined) {
      isMissingLocaleTranslations = true;
    } else {
      subLayout.attributes.forEach((layoutAttributeId) => {
        const layoutAttribute = attributes.find(
          (attribute) => attribute.id === layoutAttributeId
        );
        if (layoutAttribute && layoutAttribute.label[locale] === undefined) {
          isMissingLocaleTranslations = true;
        }
      });
    }
  });
  oneTimeNotifications.forEach((notification) => {
    if (
      notification.get('messageType') ===
      'contactLayoutMissingLocaleTranslations'
    ) {
      isOneTimeNotification = true;
    }
  });

  if (isMissingLocaleTranslations && !isOneTimeNotification) {
    const id = yield select(selectNextNotificationId);
    yield put(
      addOneTimeNotification({
        id,
        messageType: 'contactLayoutMissingLocaleTranslations',
      })
    );
    yield put(
      addNotification({
        id,
        messageType: 'contactLayoutMissingLocaleTranslations',
      })
    );
  }
}

export function* validateContactLayoutTranslations() {
  yield takeEvery(
    VALIDATE_CONTACT_LAYOUT_TRANSLATIONS,
    goValidateContactLayoutTranslations
  );
}

export default [validateContactLayoutTranslations];
