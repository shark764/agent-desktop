/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import { takeEvery, put, select, call } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { formatValue, getError } from 'utils/contact';
import sdkCallToPromise from 'utils/sdkCallToPromise';
import { selectPopulatedLayout } from 'containers/ContactView/selectors';
import {
  selectCheckedContacts,
  selectNextNotificationId,
} from 'containers/InfoTab/selectors';
import { selectAttributes } from 'containers/ContactSearchBar/selectors';
import {
  addNotification,
  dismissNotification,
} from 'containers/InfoTab/actions';
import {
  setContactMode,
  initForm,
  setFormValidity,
  setEditingContacts,
  setContactSaveLoading,
  assignContact,
  resetForm,
  removeSearchFilter,
} from 'containers/AgentDesktop/actions';
import {
  selectInteractionsList,
  selectNoInteractionContactPanel,
  selectNewInteractionPanel,
} from 'containers/AgentDesktop/selectors';
import {
  addContactNotification as addContactNotificationAction,
  addContactErrorNotification as addContactErrorNotificationAction,
} from './actions';
import {
  EDIT_CONTACT,
  MERGE_CONTACTS,
  NEW_CONTACT,
  SUBMIT_CONTACT_EDIT,
  SUBMIT_CONTACT_CREATE,
  SUBMIT_CONTACT_MERGE,
  ADD_CONTACT_NOTIFICATION,
  ADD_CONTACT_ERROR_NOTIFICATION,
} from './constants';

export function* getInteraction(interactionId) {
  let interaction;
  if (!interactionId) {
    interaction = yield select(selectNoInteractionContactPanel);
  } else if (interactionId === 'creating-new-interaction') {
    interaction = yield select(selectNewInteractionPanel);
  } else {
    const interactionsList = yield select(selectInteractionsList);
    const interactionMap = interactionsList.find(
      listInteraction => listInteraction.get('interactionId') === interactionId
    );
    interaction = interactionMap && interactionMap.toJS();
  }
  return interaction;
}

export function* goEditContact(action) {
  const contactAttributes =
    action.contact && action.contact.attributes
      ? action.contact.attributes
      : {};
  const layoutSections = yield select(selectPopulatedLayout);
  const contactForm = {};
  const formErrors = {};
  const showErrors = {};
  for (
    let sectionIndex = 0;
    sectionIndex < layoutSections.length;
    sectionIndex += 1
  ) {
    const { attributes } = layoutSections[sectionIndex];
    for (
      let attributeIndex = 0;
      attributeIndex < attributes.length;
      attributeIndex += 1
    ) {
      const attribute = attributes[attributeIndex];
      const isExistingValueDefined =
        contactAttributes &&
        contactAttributes[attribute.objectName] !== undefined;
      let initialValue = isExistingValueDefined
        ? contactAttributes[attribute.objectName]
        : attribute.default || '';
      initialValue = formatValue(attribute, initialValue);
      contactForm[attribute.objectName] = initialValue;
      formErrors[attribute.objectName] = getError(attribute, initialValue);
      showErrors[attribute.objectName] = false;
    }
  }
  yield put(
    initForm(action.interactionId, contactForm, formErrors, showErrors)
  );
  yield put(setEditingContacts(action.interactionId, [action.contact || {}]));
  yield put(
    setContactMode(action.interactionId, action.contact ? 'edit' : 'create')
  );
}

export function* goMergeContacts(action) {
  const checkedContacts = yield select(selectCheckedContacts);
  const firstContact = checkedContacts[0].attributes;
  const secondContact = checkedContacts[1].attributes;
  const attributesMap = yield select(selectAttributes);
  const attributes = attributesMap.toJS();
  const values = attributes.map(attr => attr.objectName);
  const contactForm = {};
  const formErrors = {};
  const showErrors = {};
  const unusedFields = {};
  const selectedIndexes = {};
  for (let valueIndex = 0; valueIndex < values.length; valueIndex += 1) {
    const attributeName = values[valueIndex];
    const attribute = attributes.find(
      attr => attr.objectName === attributeName
    );
    if (
      firstContact[attributeName] === undefined ||
      firstContact[attributeName] === ''
    ) {
      contactForm[attributeName] =
        secondContact[attributeName] || attribute.default || '';
      formErrors[attributeName] = getError(
        attribute,
        secondContact[attributeName]
      );
    } else {
      contactForm[attributeName] = firstContact[attributeName];
      formErrors[attributeName] = getError(
        attribute,
        firstContact[attributeName]
      );
      if (
        secondContact[attributeName] !== undefined &&
        secondContact[attributeName] !== ''
      ) {
        unusedFields[attributeName] = secondContact[attributeName];
        selectedIndexes[attributeName] = 0;
      }
    }
    showErrors[attributeName] = false;
  }
  yield put(
    setEditingContacts(action.interactionId, [
      checkedContacts[0],
      checkedContacts[1],
    ])
  );
  yield put(
    initForm(
      action.interactionId,
      contactForm,
      formErrors,
      showErrors,
      unusedFields,
      selectedIndexes
    )
  );
  yield put(setContactMode(action.interactionId, 'merge'));
  yield put(setFormValidity(action.interactionId, true));
}

export function* goAddContactNotification(action) {
  const notificationId = yield select(selectNextNotificationId);
  yield put(
    addNotification({
      ...action.notificationInfo,
      id: notificationId,
      isError: false,
    })
  );
  yield call(delay, 3000);
  yield put(dismissNotification(notificationId));
}

export function* goAddContactErrorNotification(action) {
  const notificationId = yield select(selectNextNotificationId);
  yield put(
    addNotification({
      ...action.notificationInfo,
      id: notificationId,
      isError: true,
    })
  );
}

function clean(contactForm) {
  const newContactForm = contactForm;
  const propNames = Object.getOwnPropertyNames(newContactForm);
  for (let i = 0; i < propNames.length; i += 1) {
    const propName = propNames[i];
    if (
      newContactForm[propName] === null ||
      newContactForm[propName] === undefined ||
      newContactForm[propName] === ''
    ) {
      delete newContactForm[propName];
    }
  }
  return newContactForm;
}

export function* goSubmitContactCreate(action) {
  const interaction = yield call(getInteraction, action.interactionId);
  const targetContactForm = interaction.activeContactForm;
  const { contactForm } = targetContactForm;
  clean(contactForm);
  yield put(setContactSaveLoading(action.interactionId, true));
  try {
    const createdContact = yield call(
      sdkCallToPromise,
      CxEngage.contacts.create,
      { attributes: contactForm },
      'ContactsControl'
    );
    yield put(addContactNotificationAction({ messageType: 'created' }));
    yield put(assignContact(action.interactionId, createdContact)); // loadOff
    yield put(setContactMode(action.interactionId, 'view'));
    yield put(setContactSaveLoading(action.interactionId, false));
    yield put(resetForm(action.interactionId));
  } catch (error) {
    console.error(error);
    yield put(setContactSaveLoading(action.interactionId, false));
    yield put(
      addContactErrorNotificationAction({
        errorType: 'serverError',
        messageType: 'notCreated',
      })
    );
  }
}

export function* goSubmitContactEdit(action) {
  const interaction = yield call(getInteraction, action.interactionId);
  const targetContactForm = interaction.activeContactForm;
  const { contactForm } = targetContactForm;
  clean(contactForm);
  const originalContacts = targetContactForm.editingContacts;
  yield put(setContactSaveLoading(action.interactionId, true));
  try {
    yield call(
      sdkCallToPromise,
      CxEngage.contacts.update,
      { attributes: contactForm, contactId: originalContacts[0].id },
      'ContactsControl'
    );
    yield put(addContactNotificationAction({ messageType: 'saved' }));
    const editedAssigned =
      interaction.contact && originalContacts[0].id === interaction.contact.id;
    yield put(
      setContactMode(action.interactionId, editedAssigned ? 'view' : 'search')
    );
    yield put(setContactSaveLoading(action.interactionId, false));
    yield put(resetForm(action.interactionId));
  } catch (error) {
    console.error(error);
    yield put(setContactSaveLoading(action.interactionId, false));
    yield put(
      addContactErrorNotificationAction({
        errorType: 'serverError',
        messageType: 'notSaved',
      })
    );
  }
}

export function* goSubmitContactMerge(action) {
  const interaction = yield call(getInteraction, action.interactionId);
  const targetContactForm = interaction.activeContactForm;
  const { contactForm } = targetContactForm;
  clean(contactForm);
  const originalContacts = targetContactForm.editingContacts;
  yield put(setContactSaveLoading(action.interactionId, true));
  try {
    const createdContact = yield call(
      sdkCallToPromise,
      CxEngage.contacts.merge,
      {
        attributes: contactForm,
        contactIds: originalContacts.map(contact => contact.id),
      },
      'ContactsControl'
    );
    yield put(addContactNotificationAction({ messageType: 'merged' }));
    const interactionsList = yield select(selectInteractionsList);
    yield put(assignContact(action.interactionId, createdContact));
    yield put(setContactMode(action.interactionId, 'view'));
    yield interactionsList
      .toJS()
      .filter(
        inter =>
          inter.interactionId !== action.interactionId &&
          inter.contact &&
          [originalContacts[0].id, originalContacts[1].id].includes(
            inter.contact.id
          )
      )
      .map(inter => put(assignContact(inter.interactionId, createdContact)));
    yield put(removeSearchFilter());
    yield put(setContactSaveLoading(action.interactionId, false));
    yield put(resetForm(action.interactionId));
  } catch (error) {
    console.error(error);
    yield put(setContactSaveLoading(action.interactionId, false));
    yield put(
      addContactErrorNotificationAction({
        errorType: 'serverError',
        messageType: 'notMerged',
      })
    );
  }
}

export function* editContact() {
  yield takeEvery(EDIT_CONTACT, goEditContact);
}

export function* newContact() {
  yield takeEvery(NEW_CONTACT, goEditContact);
}

export function* mergeContacts() {
  yield takeEvery(MERGE_CONTACTS, goMergeContacts);
}

export function* submitContactEdit() {
  yield takeEvery(SUBMIT_CONTACT_EDIT, goSubmitContactEdit);
}

export function* submitContactCreate() {
  yield takeEvery(SUBMIT_CONTACT_CREATE, goSubmitContactCreate);
}

export function* submitContactMerge() {
  yield takeEvery(SUBMIT_CONTACT_MERGE, goSubmitContactMerge);
}

export function* addContactNotification() {
  yield takeEvery(ADD_CONTACT_NOTIFICATION, goAddContactNotification);
}

export function* addContactErrorNotification() {
  yield takeEvery(
    ADD_CONTACT_ERROR_NOTIFICATION,
    goAddContactErrorNotification
  );
}

export default [
  editContact,
  newContact,
  mergeContacts,
  submitContactEdit,
  submitContactCreate,
  submitContactMerge,
  addContactNotification,
  addContactErrorNotification,
];
