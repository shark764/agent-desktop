/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import { List, Map, fromJS } from 'immutable';
import { isToolbar } from 'utils/url';
import moment from 'moment';

export default class Interaction {
  constructor({
    interactionId,
    channelType,
    source,
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
    outboundAni,
    script,
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
      this.messageTemplateFilter = undefined;
      this.selectedMessageTemplateIndex = 0;
      if (source === 'smooch') {
        this.currentAttachedFile = null;
      }
    }
    if (channelType === 'email' || channelType === 'sms') {
      this.customer = customer;
    }
    if (channelType === 'email' && direction === 'agent-initiated') {
      this.emailReply = fromJS({
        message: '',
        tos: [
          {
            address: customer,
            name: customer,
          },
        ],
        ccs: [],
        bccs: [],
        subjectInput: '',
        attachments: [],
        toInput: '',
        ccInput: '',
        bccInput: '',
      });
    }
    this.isEnding = false;
    this.isMuting = false;
    this.isHolding = false;
    this.isColdTransferring = false;
    this.warmTransfers = new List();
    this.customFieldsCollapsed = true;
    this.channelType = channelType;
    if (source) {
      this.source = source;
    }
    this.direction = direction;
    this.interactionId =
      interactionId || `${direction}-${channelType}-${customer}`;
    this.contactMode = contactMode || 'search';
    this.timeout = new Date(timeout).valueOf();
    this.autoAnswer = autoAnswer;
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
      const waitingFor = moment(callbackRequest.callbackRequestedTime).fromNow(
        true
      );
      notifications = notifications.push(
        new Map({
          messageKey: 'callbackRequest',
          messageValues: new Map({
            callbackNumber: callbackRequest.callbackNumber,
            waitingFor,
          }),
          isDimissible: true,
        })
      );
    }
    this.notifications = notifications;
    if (popUri) {
      this.popUri = popUri;
    }
    if (outboundAni) {
      this.customFields = fromJS([
        {
          id: 'outboundAniLabel',
          isLocalized: true,
          value: `${outboundAni.label} (${outboundAni.outboundIdentifier})`,
        },
      ]);
    } else {
      this.customFields = fromJS([]);
    }
    if (script) {
      this.isScriptOnly = true;
      this.script = script;
      this.status = 'script-only';
    } else {
      this.status = status || 'work-offer';
    }
    this.transferringInConference = false;
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
