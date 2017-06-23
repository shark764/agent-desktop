/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import { List, Map, fromJS } from 'immutable';

export default class Interaction {
  constructor({
    interactionId,
    channelType,
    autoAnswer,
    direction,
    timeout,
    toolbarFeatures,
    recording,
    customerOnHold,
    status,
    customer,
    activeResources,
    contact,
    hideNewInteractionPanelOnWorkAccepted,
    contactMode,
  }) {
    if (channelType === 'voice') {
      // recordingUpdate could be undefined for old flows, but should be enabled in that case
      this.agentRecordingEnabled =
        toolbarFeatures && toolbarFeatures.recordingUpdate !== false;
      // recording and onHold can have been set by an incoming transfer
      this.recording = recording === true;
      this.onHold = customerOnHold === true;
      this.muted = false;
      this.warmTransfers = new List();
    } else if (channelType === 'sms' || channelType === 'messaging') {
      this.customerAvatarIndex = Math.floor(Math.random() * 17);
      this.messageHistory = [];
    }
    if (channelType === 'email' || channelType === 'sms') {
      this.customer = customer;
    }
    if (channelType === 'email' && direction === 'outbound') {
      this.emailReply = new Map({
        message: '',
        tos: new List([
          {
            address: customer,
            name: customer,
          },
        ]),
        ccs: new List(),
        bccs: new List(),
        subject: '',
        attachments: new List(),
      });
    }
    this.channelType = channelType;
    this.direction = direction;
    this.interactionId =
      interactionId || `${direction}-${channelType}-${customer}`;
    this.contactMode = contactMode || 'search';
    this.timeout = new Date(timeout).valueOf();
    this.autoAnswer = autoAnswer;
    this.status = status || 'work-offer';
    if (activeResources) {
      this.warmTransfers = new List(
        activeResources.map((resource) => {
          const mappedResource = Object.assign({}, resource);
          mappedResource.targetResource = mappedResource.id;
          mappedResource.status = 'connected';
          if (mappedResource.externalResource) {
            mappedResource.name = mappedResource.extension;
          } else {
            mappedResource.name = 'Agent';
            CxEngage.entities.getUser({ resourceId: resource.id });
          }
          return new Map(mappedResource);
        })
      );
    }
    this.wrapupDetails = new Map({
      wrapupUpdateAllowed: false,
      wrapupEnabled: false,
    });
    this.dispositionDetails = new Map({
      forceSelect: false,
      dispositions: new List(),
      categories: new List(),
      selected: new List(),
    });
    this.note = new Map({
      body: '',
      title: '',
      notesPanelHeight: 300,
    });
    this.contact = contact ? new Map(contact) : undefined;
    this.query = new Map();
    this.sidePanelTabIndex = 0;
    if (hideNewInteractionPanelOnWorkAccepted !== undefined) {
      this.hideNewInteractionPanelOnWorkAccepted = hideNewInteractionPanelOnWorkAccepted;
    }
    this.activeContactForm = fromJS(activeContactFormBlank);
  }
}

export const activeContactFormBlank = {
  formIsDirty: false,
  formIsValid: false,
  contactForm: {},
  formErrors: {},
  showErrors: {},
  unusedFields: {},
  selectedIndexes: {},
  editingContacts: [],
  saveLoading: false,
};
