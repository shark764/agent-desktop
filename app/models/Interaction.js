import { List } from 'immutable';

export default class Interaction {
  constructor({ interactionId, channelType, autoAnswer, direction, timeout, toolbarFeatures, recording, customerOnHold, status, customer }) {
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
    } else if (channelType === 'email') {
      this.customer = customer;
    }
    this.channelType = channelType;
    this.direction = direction;
    this.interactionId = interactionId;
    this.timeout = new Date(timeout).valueOf();
    this.autoAnswer = autoAnswer;
    this.status = status || 'work-offer';
    this.query = {};
    this.wrapupDetails = {
      wrapupUpdateAllowed: false,
      wrapupEnabled: false,
    };
    this.contactAction = 'search';
    this.dispositionDetails = {
      forceSelect: false,
      dispositions: [],
      categories: [],
    };
  }
}
