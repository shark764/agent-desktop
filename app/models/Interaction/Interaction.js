import { List, Map } from 'immutable';

export default class Interaction {
  constructor({ interactionId, channelType, autoAnswer, direction, timeout, toolbarFeatures, recording, customerOnHold, status, customer, activeResources, contact }) {
    if (channelType === 'voice') {
      // recordingUpdate could be undefined for old flows, but should be enabled in that case
      this.agentRecordingEnabled = toolbarFeatures && toolbarFeatures.recordingUpdate !== false;
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
    this.channelType = channelType;
    this.direction = direction;
    this.interactionId = interactionId || `${direction}-${channelType}-${customer}`;
    this.timeout = new Date(timeout).valueOf();
    this.autoAnswer = autoAnswer;
    this.status = status || 'work-offer';
    if (activeResources) {
      this.warmTransfers = new List(activeResources.map((resource) => {
        const mappedResource = Object.assign({}, resource);
        mappedResource.targetResource = mappedResource.id;
        mappedResource.status = 'connected';
        if (mappedResource.externalResource) {
          mappedResource.name = mappedResource.extension;
        } else {
          mappedResource.name = 'Agent';
          SDK.entities.get.user({ entityId: resource.id });
        }
        return new Map(mappedResource);
      }));
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
    this.contact = contact;
    this.contactAction = contact ? 'view' : 'search';
    this.query = new Map();
    this.sidePanelTabIndex = 0;
  }
}
