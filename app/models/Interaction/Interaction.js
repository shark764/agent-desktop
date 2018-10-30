/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import { List, Map, fromJS } from 'immutable';
import { timeSince } from 'utils/time';
import { isToolbar } from 'utils/url';

export default class Interaction {
  constructor({
    interactionId,
    channelType,
    autoAnswer,
    direction,
    timeout,
    toolbarFeatures,
    status,
    customer,
    contact,
    hideNewInteractionPanelOnWorkAccepted,
    initiatedByCurrentAgent,
    contactMode,
    isSidePanelCollapsed,
    subject,
    timeAccepted,
    callbackRequest,
    popUri,
  }) {
    if (channelType === 'voice') {
      // recordingUpdate could be undefined for old flows, but should be enabled in that case
      this.agentRecordingEnabled =
        toolbarFeatures && toolbarFeatures.recordingUpdate !== false;
      this.muted = false;
      this.togglingRecording = false;
      if (direction === 'agent-initiated' || direction === 'outbound') {
        this.customerConnected = false;
      } else {
        this.customerConnected = true;
      }
    } else if (channelType === 'sms' || channelType === 'messaging') {
      this.customerAvatarIndex = Math.floor(Math.random() * 17);
      this.messageHistory = new List();
      this.currentMessage = '';
      this.isCopied = false;
    }
    if (channelType === 'email' || channelType === 'sms') {
      this.customer = customer;
    }
    if (channelType === 'email' && direction === 'agent-initiated') {
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
    this.isEnding = false;
    this.isMuting = false;
    this.isHolding = false;
    this.warmTransfers = new List();
    this.customFieldsCollapsed = true;
    this.channelType = channelType;
    this.direction = direction;
    this.interactionId =
      interactionId || `${direction}-${channelType}-${customer}`;
    this.contactMode = contactMode || 'search';
    this.timeout = new Date(timeout).valueOf();
    this.autoAnswer = autoAnswer;
    this.status = status || 'work-offer';
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
      notesPanelHeight: isToolbar() ? 180 : 300,
    });
    if (contact) {
      this.contact = fromJS(contact);
    }
    this.query = new Map();
    this.isSidePanelCollapsed =
      isSidePanelCollapsed !== undefined ? isSidePanelCollapsed : true;
    this.selectedSidePanelTab = 'info';
    if (hideNewInteractionPanelOnWorkAccepted !== undefined) {
      this.hideNewInteractionPanelOnWorkAccepted = hideNewInteractionPanelOnWorkAccepted;
    }
    if (initiatedByCurrentAgent !== undefined) {
      this.initiatedByCurrentAgent = initiatedByCurrentAgent;
    }
    this.activeContactForm = fromJS(activeContactFormBlank);
    if (subject) {
      this.subject = subject;
    }
    if (timeAccepted) {
      this.timeAccepted = timeAccepted;
    }

    let notifications = new List();
    if (callbackRequest) {
      notifications = notifications.push(
        new Map({
          messageKey: 'callbackRequest',
          messageValues: new Map({
            callbackNumber: callbackRequest.callbackNumber,
            waitingFor: timeSince(callbackRequest.callbackRequestedTime),
          }),
          isDimissable: true,
        })
      );
    }
    this.notifications = notifications;
    if (popUri) {
      this.popUri = popUri;
    }
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
