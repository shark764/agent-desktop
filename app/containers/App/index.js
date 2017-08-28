/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * AgentDesktop
 *
 */

import Raven from 'raven-js';
import React from 'react';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';
import PropTypes from 'prop-types';
import Radium from 'radium';
import axios from 'axios';

import ResponseMessage from 'models/Message/ResponseMessage';

import Login from 'containers/Login';
import NotificationBanner from 'components/NotificationBanner';
import AgentDesktop from 'containers/AgentDesktop';

import {
  setAvailableStats,
  statsReceived,
  toggleAgentMenu,
  initializeStats,
} from 'containers/Toolbar/actions';
import { showLogin, logout } from 'containers/Login/actions';
import {
  setContactLayout,
  setContactAttributes,
} from 'containers/SidePanel/actions';
import {
  setCriticalError,
  handleSDKError,
  addStatErrorId,
  removeStatErrorId,
  dismissError,
} from 'containers/Errors/actions';

import { selectAvailableStats } from 'containers/AgentStats/selectors';
import { selectActivatedStatIds } from 'containers/Toolbar/selectors';
import {
  selectCriticalError,
  selectErroredStatIds,
  selectNonCriticalError,
} from 'containers/Errors/selectors';
import errorMessages from 'containers/Errors/messages';

import {
  setCRMUnavailable,
  validateContactLayoutTranslations,
} from 'containers/InfoTab/actions';
import {
  setUserConfig,
  setExtensions,
  setPresence,
  addInteraction,
  workInitiated,
  addMessage,
  setMessageHistory,
  assignContact,
  loadContactInteractionHistory,
  setContactHistoryInteractionDetails,
  updateContact,
  setInteractionQuery,
  setInteractionStatus,
  workAccepted,
  removeInteraction,
  updateWrapupDetails,
  addScript,
  removeScript,
  selectInteraction,
  selectSidePanelTab,
  showSidePanel,
  hideSidePanel,
  setCustomFields,
  setEmailPlainBody,
  setEmailHtmlBody,
  setEmailDetails,
  setEmailAttachmentUrl,
  muteCall,
  unmuteCall,
  holdCall,
  resumeCall,
  recordCall,
  stopRecordCall,
  transferCancelled,
  resourceAdded,
  updateResourceName,
  updateResourceStatus,
  holdMe,
  resumeMe,
  resourceRemoved,
  showRefreshRequired,
  emailAddAttachment,
  setQueues,
  setDispositionDetails,
  selectDisposition,
  goNotReady,
} from 'containers/AgentDesktop/actions';

import {
  selectAgentDesktopMap,
  selectLoginMap,
  selectIsSidePanelCollapsed,
} from 'containers/AgentDesktop/selectors';

import { version as release } from '../../../package.json';

import messages from './messages';
import sdkIgnoreTopics from './sdkIgnoreTopics';
import sdkLogTopics from './sdkLogTopics';

export class App extends React.Component {
  componentWillUnmount() {
    clearInterval(this.cacheCheckInterval);
  }

  componentWillMount() {
    this.loadConf();
    this.cacheCheckInterval = setInterval(this.loadConf, 300000); // Cache busting version check every 5min

    window.addEventListener('beforeunload', (e) => {
      if (this.props.agentDesktop.interactions.length) {
        e.returnValue = true;
      }
    });
  }

  loadConf = () => {
    axios({
      method: 'get',
      url: `${window.location.href}config.json`,
    }).then((res) => {
      if (typeof res.data !== 'undefined') {
        if (window.ADconf !== undefined) {
          if (window.ADconf.version !== res.data.config.version) {
            this.props.showRefreshRequired(true);
            clearInterval(this.cacheCheckInterval);
          }
        }
        window.ADconf = res.data.config;
      }
      if (typeof window.CxEngage.subscribe === 'undefined') {
        this.init();
      }
    });
  };

  hideRefreshBanner = () => {
    this.props.showRefreshRequired(false);
  };

  logoutAndReload = () => {
    try {
      CxEngage.authentication.logout(
        (error) => error && window.location.reload()
      );
    } catch (e) {
      window.location.reload();
    }
  };

  checkStatErrors = (statsObject) => {
    // TODO: move into saga
    this.props.activatedStatIds.forEach((statId) => {
      const hasData = statsObject[statId] && statsObject[statId].status === 200;
      const hasNewError =
        statsObject[statId] && statsObject[statId].status !== 200;
      const isErrored = this.props.erroredStatIds.includes(statId);
      if (hasNewError && !isErrored) {
        this.props.addStatErrorId(statId);
      } else if (hasData && isErrored) {
        this.props.removeStatErrorId(statId);
      }
    });
  };

  init = () => {
    let where;
    let environment;
    let logLevel;
    let blastSqsOutput;
    let reportingRefreshRate;
    if (typeof window.ADconf !== 'undefined') {
      where = window.ADconf.api;
      environment = window.ADconf.env;
      logLevel = window.ADconf.logLevel;
      blastSqsOutput = window.ADconf.blastSqsOutput;
      reportingRefreshRate = window.ADconf.refreshRate;
    } else if (location.hostname === 'localhost') {
      where = 'dev-api.cxengagelabs.net/v1/';
      environment = 'dev';
      logLevel = 'debug';
      blastSqsOutput = true;
      reportingRefreshRate = 10000;
    } else {
      console.error('Server conf file not found, Unable to load desktop');
    }

    // Initialize Remote Logging with Sentry.io
    // Check if environment === 'prod' to re-enable
    // eslint-disable-next-line no-constant-condition
    if (false) {
      Raven.config(
        'https://892f9eb6bb314a9da98b98372c518351@sentry.io/169686',
        {
          release,
          environment,
          autoBreadcrumbs: {
            xhr: false,
          },
          dataCallback: (data) => {
            // Add state to extra data
            Object.assign(
              {},
              data
            ).extra.appState = window.store.getState().toJS();
          },
        }
      ).install();
    }

    const sdkConf = {
      baseUrl: `https://${where}`,
      logLevel,
      blastSqsOutput,
      environment,
      reportingRefreshRate,
    };

    CxEngage.initialize(sdkConf);

    Raven.setTagsContext({ sdkVersion: CxEngage.version });

    window.onerror = (errorMsg, url, lineNumber, column, errorObj) => {
      CxEngage.logging.error(
        `Error: ${errorMsg} Script: ${url} Line: ${lineNumber} Column: ${column} StackTrace: ${JSON.stringify(
          errorObj
        )} ReduxState: ${JSON.stringify(window.store)}`
      );
    };

    CxEngage.subscribe('cxengage', (error, topic, response) => {
      if (error) {
        this.props.handleSDKError(error, topic);
      } else {
        const isIgnoreTopic = sdkIgnoreTopics.includes(topic);
        const isLogTopic = sdkLogTopics.includes(topic);
        let topicUnhandled;

        switch (topic) {
          // SESSION
          case 'cxengage/session/state-change-response': {
            if (
              !this.props.agentDesktop.presence &&
              response.state === 'notready' &&
              response.reasonId === null
            ) {
              const systemPresenceReasonsList =
                this.props.agentDesktop.userConfig &&
                this.props.agentDesktop.userConfig.reasonLists &&
                this.props.agentDesktop.userConfig.reasonLists.find(
                  (list) => list.name === 'System Presence Reasons'
                );
              const loggedInReason =
                systemPresenceReasonsList &&
                systemPresenceReasonsList.reasons.find(
                  (reason) => reason.name === 'Logged in'
                );
              if (loggedInReason) {
                this.props.goNotReady(
                  loggedInReason,
                  systemPresenceReasonsList.id
                );
              }
              this.props.setPresence(response);
            } else {
              this.props.setPresence(response);
            }
            break;
          }
          case 'cxengage/session/config-details': {
            if (response.reasonLists.length < 2) {
              this.props.setCriticalError({ code: 'AD-1000' });
            } else if (response.extensions.length < 1) {
              this.props.setCriticalError({ code: 'AD-1001' });
            }
            this.props.setUserConfig(response);
            break;
          }
          case 'cxengage/session/extension-list': {
            this.props.setExtensions(response);
            break;
          }
          case 'cxengage/session/started': {
            if (Object.keys(this.props.availableStats).length === 0) {
              CxEngage.reporting.getAvailableStats();
              this.props.showLogin(false);
            }
            break;
          }
          case 'cxengage/session/ended': {
            window.location.reload();
            break;
          }

          // INTERACTIONS
          case 'cxengage/interactions/work-initiated-received': {
            const interaction = this.props.agentDesktop.interactions.find(
              (availableInteraction) =>
                availableInteraction.interactionId === response.interactionId
            );
            if (interaction !== undefined) {
              if (
                !(
                  interaction.direction === 'outbound' &&
                  (interaction.channelType === 'sms' ||
                    interaction.channelType === 'email')
                )
              ) {
                this.props.workInitiated(response);
              }

              // Attempt to auto-assign contact if it hasn't already been assigned (if it were started by click to outbound)
              if (
                interaction &&
                (interaction.channelType === 'voice' ||
                  interaction.channelType === 'sms' ||
                  interaction.channelType === 'email') &&
                (interaction.contact === undefined ||
                  interaction.contact.id === undefined)
              ) {
                this.attemptContactSearch(
                  response.customer,
                  response.interactionId,
                  true
                );
              }
              if (
                interaction.direction === 'outbound' &&
                (interaction.channelType === 'sms' ||
                  interaction.channelType === 'email')
              ) {
                CxEngage.interactions.accept({
                  interactionId: response.interactionId,
                });
              } else if (interaction.autoAnswer === true) {
                this.acceptInteraction(response.interactionId);
              }
            } else {
              console.warn(
                'Interaction not found to initiate:',
                response.interactionId
              );
            }
            break;
          }
          case 'cxengage/interactions/resource-hold-received': {
            if (
              this.props.login.agent.userId ===
              response.extraParams.targetResource
            ) {
              this.props.holdMe(response.interactionId);
            } else {
              this.props.updateResourceStatus(
                response.interactionId,
                response.extraParams.targetResource,
                'onHold',
                true
              );
            }
            break;
          }
          case 'cxengage/interactions/resource-resume-received': {
            if (
              this.props.login.agent.userId ===
              response.extraParams.targetResource
            ) {
              this.props.resumeMe(response.interactionId);
            } else {
              this.props.updateResourceStatus(
                response.interactionId,
                response.extraParams.targetResource,
                'onHold',
                false
              );
            }
            break;
          }
          case 'cxengage/interactions/disposition-codes-received': {
            if (response.dispositionCodes) {
              this.props.setDispositionDetails(
                response.interactionId,
                response.dispositionCodes.dispositions,
                response.forceSelect
              );
            }
            break;
          }
          case 'cxengage/interactions/resource-added-received': {
            if (
              this.props.login.agent.userId !==
              response.extraParams.targetResource
            ) {
              this.props.resourceAdded(response);
            }
            break;
          }
          case 'cxengage/interactions/wrapup-details-received': {
            response.wrapupEnabled = !!response.wrapupEnabled; // eslint-disable-line no-param-reassign
            this.props.updateWrapupDetails(response.interactionId, response);
            break;
          }
          case 'cxengage/interactions/work-rejected-received':
          case 'cxengage/interactions/work-ended-received': {
            this.props.removeInteraction(response.interactionId);
            break;
          }
          case 'cxengage/interactions/work-offer-received': {
            if (response.channelType === 'work-item') {
              // Auto reject work-items
              CxEngage.interactions.sendCustomInterrupt({
                interruptType: 'resource-disconnect',
                interactionId: response.interactionId,
                interruptBody: { resourceId: this.props.login.agent.userId },
              });
            } else {
              this.props.toggleAgentMenu(false);
              this.props.addInteraction(response);
            }
            break;
          }
          case 'cxengage/interactions/work-accepted-received': {
            this.props.workAccepted(response.interactionId, response);
            if (!this.context.toolbarMode) {
              this.props.showSidePanel(response.interactionId);
            }
            break;
          }
          case 'cxengage/interactions/custom-fields-received': {
            this.props.setCustomFields(
              response.interactionId,
              response.customFields
            );
            break;
          }
          case 'cxengage/interactions/resource-removed-received': {
            this.props.resourceRemoved(response);
            break;
          }
          case 'cxengage/interactions/wrapup-started': {
            this.props.setInteractionStatus(response.interactionId, 'wrapup');
            break;
          }
          case 'cxengage/interactions/enable-wrapup-acknowledged': {
            this.props.updateWrapupDetails(response.interactionId, {
              wrapupEnabled: true,
            });
            break;
          }
          case 'cxengage/interactions/disable-wrapup-acknowledged': {
            this.props.updateWrapupDetails(response.interactionId, {
              wrapupEnabled: false,
            });
            break;
          }
          case 'cxengage/interactions/script-received': {
            this.props.addScript(
              response.interactionId,
              JSON.parse(response.script)
            );
            const interaction = this.props.agentDesktop.interactions.find(
              (availableInteraction) =>
                availableInteraction.interactionId === response.interactionId
            );
            if (
              !interaction.isScriptOnly &&
              (interaction.channelType !== 'voice' || this.context.toolbarMode)
            ) {
              this.props.selectSidePanelTab(response.interactionId, 'script');
              this.props.showSidePanel(interaction.interactionId);
            }
            break;
          }
          case 'cxengage/interactions/send-script': {
            const interaction = this.props.agentDesktop.interactions.find(
              (availableInteraction) =>
                availableInteraction.interactionId === response
            );
            if (!this.context.toolbarMode) {
              if (interaction.channelType !== 'voice') {
                this.props.selectSidePanelTab(response, 'info');
              }
            } else {
              this.props.hideSidePanel(interaction.interactionId);
            }
            this.props.removeScript(response);
            break;
          }
          case 'cxengage/interactions/disposition-code-changed': {
            this.props.selectDisposition(
              response.interactionId,
              response.disposition
            );
            break;
          }

          // INTERACTIONS/VOICE
          case 'cxengage/interactions/voice/resource-mute-received': {
            if (
              response.extraParams.targetResource ===
              this.props.login.agent.userId
            ) {
              this.props.muteCall(response.interactionId);
            } else {
              this.props.updateResourceStatus(
                response.interactionId,
                response.extraParams.targetResource,
                'muted',
                true
              );
            }
            break;
          }
          case 'cxengage/interactions/voice/resource-unmute-received': {
            if (
              response.extraParams.targetResource ===
              this.props.login.agent.userId
            ) {
              this.props.unmuteCall(response.interactionId);
            } else {
              this.props.updateResourceStatus(
                response.interactionId,
                response.extraParams.targetResource,
                'muted',
                false
              );
            }
            break;
          }
          case 'cxengage/interactions/voice/customer-hold-received': {
            this.props.holdCall(response.interactionId);
            break;
          }
          case 'cxengage/interactions/voice/customer-resume-received': {
            this.props.resumeCall(response.interactionId);
            break;
          }
          case 'cxengage/interactions/voice/recording-start-received': {
            this.props.recordCall(response.interactionId);
            break;
          }
          case 'cxengage/interactions/voice/recording-end-received': {
            this.props.stopRecordCall(response.interactionId);
            break;
          }
          case 'cxengage/interactions/voice/cancel-transfer-acknowledged': {
            this.props.transferCancelled(response.interactionId);
            break;
          }
          case 'cxengage/interactions/voice/dial-response': {
            // TODO: toast error
            break;
          }

          // INTERACTIONS/MESSAGING
          case 'cxengage/interactions/messaging/history-received': {
            this.props.setMessageHistory(
              response,
              this.props.login.agent.userId
            );
            // attempt to auto-assign contact
            const interaction = this.props.agentDesktop.interactions.find(
              (availableInteraction) =>
                availableInteraction.interactionId === response[0].to
            );
            if (
              interaction !== undefined &&
              interaction.channelType === 'messaging'
            ) {
              const customerMessage = response.find(
                (message) =>
                  message.metadata && message.metadata.type === 'customer'
              ); // History has been coming in with initial customer issue message missing
              if (
                customerMessage &&
                customerMessage.metadata &&
                customerMessage.metadata.name
              ) {
                this.attemptContactSearch(
                  customerMessage.metadata.name,
                  customerMessage.to,
                  false
                );
              } else {
                console.warn('customer name not found in:', interaction);
              }
            }
            break;
          }
          case 'cxengage/interactions/messaging/new-message-received': {
            this.props.addMessage(
              response.to,
              new ResponseMessage(
                response,
                this.props.agentDesktop.selectedInteractionId
              )
            );
            break;
          }

          // INTERACTIONS/EMAIL
          case 'cxengage/interactions/email/details-received': {
            this.props.setEmailDetails(response.interactionId, response.body);
            response.body.attachments.forEach((attachment) => {
              CxEngage.interactions.email.getAttachmentUrl(
                {
                  interactionId: response.interactionId,
                  artifactId: response.body.artifactId,
                  artifactFileId: attachment.artifactFileId,
                },
                (
                  attachmentUrlError,
                  attachmentUrlTopic,
                  attachmentUrlResponse
                ) => {
                  console.log(
                    '[AgentDesktop] CxEngage.subscribe()',
                    attachmentUrlTopic,
                    attachmentUrlResponse
                  );
                  this.props.setEmailAttachmentUrl(
                    response.interactionId,
                    attachment.artifactFileId,
                    attachmentUrlResponse.url
                  );
                }
              );
            });
            break;
          }
          case 'cxengage/interactions/email/attachment-added': {
            this.props.emailAddAttachment(response.interactionId, {
              attachmentId: response.attachmentId,
              name: response.filename,
            });
            break;
          }
          case 'cxengage/interactions/email/plain-body-received': {
            this.props.setEmailPlainBody(response.interactionId, response.body);
            break;
          }
          case 'cxengage/interactions/email/html-body-received': {
            this.props.setEmailHtmlBody(response.interactionId, response.body);
            break;
          }

          // CONTACTS
          case 'cxengage/contacts/list-layouts-response': {
            const activeLayouts = response.filter((layout) => layout.active);
            if (activeLayouts.length === 0) {
              this.props.setCRMUnavailable('crmUnavailableLayout');
              break;
            } else if (activeLayouts.length > 1) {
              console.warn('More than one layout found. Only using first one.');
            }
            this.props.setContactLayout(activeLayouts[0]);
            this.props.validateContactLayoutTranslations();
            break;
          }
          case 'cxengage/contacts/list-attributes-response': {
            if (response.length === 0) {
              this.props.setCRMUnavailable('crmUnavailableAttribute');
              break;
            }
            this.props.setContactAttributes(response);
            break;
          }
          case 'cxengage/contacts/update-contact-response': {
            this.props.updateContact(response);
            break;
          }

          // REPORTING
          case 'cxengage/reporting/get-available-stats-response': {
            // The user friendly names are too long, need to trim them
            const stats = { ...response };
            delete stats.status;
            Object.keys(stats).forEach((key) => {
              stats[key].userFriendlyName = stats[key].userFriendlyName.replace(
                /(\sCount|Count of|Percentage of)/,
                ''
              );
              if (
                stats[key].userFriendlyName === 'Resource Conversation Starts'
              ) {
                stats[key].userFriendlyName = 'Conversation Starts';
              }
            });
            this.props.setAvailableStats(stats);
            this.props.initializeStats();
            break;
          }
          case 'cxengage/reporting/get-interaction-response': {
            this.props.setContactHistoryInteractionDetails(response);
            break;
          }
          case 'cxengage/reporting/batch-response': {
            this.checkStatErrors(response);
            this.props.statsReceived(response);
            break;
          }

          // ENTITIES
          case 'cxengage/entities/get-user-response': {
            this.props.updateResourceName(response);
            break;
          }
          case 'cxengage/entities/get-queues-response': {
            this.props.setQueues(response.result);
            break;
          }
          default: {
            topicUnhandled = true;
          }
        }
        if (!isIgnoreTopic) {
          if (isLogTopic || !topicUnhandled) {
            console.log('[AgentDesktop] CxEngage.subscribe()', topic, response);
          } else {
            console.warn(
              '[AgentDesktop] CxEngage.subscribe(): No pub sub for',
              topic,
              response,
              error
            );
          }
        }
      }
    });
  };

  attemptContactSearch = (from, interactionId, exact) => {
    if (this.context.crmEnabled) {
      CxEngage.contacts.search(
        {
          query: {
            q: exact
              ? encodeURIComponent(`"${from}"`)
              : encodeURIComponent(from),
          },
        },
        (searchError, searchTopic, searchResponse) => {
          if (searchError) {
            this.props.setInteractionQuery(interactionId, { q: `"${from}"` });
          } else {
            console.log(
              '[AgentDesktop] CxEngage.subscribe()',
              searchTopic,
              searchResponse
            );
            if (searchResponse.count === 1) {
              // if single contact found, auto assign to interaction
              CxEngage.interactions.assignContact(
                {
                  interactionId,
                  contactId: searchResponse.results[0].id,
                },
                (assignError, assignTopic, assignResponse) => {
                  console.log(
                    '[ContactsControl] CxEngage.subscribe()',
                    assignTopic,
                    assignResponse
                  );
                  if (assignError) {
                    console.error('Assign error', assignError);
                    this.props.setInteractionQuery(interactionId, {
                      q: `"${from}"`,
                    });
                  } else {
                    this.props.loadContactInteractionHistory(
                      searchResponse.results[0].id
                    );
                    this.props.assignContact(
                      interactionId,
                      searchResponse.results[0]
                    );
                  }
                }
              );
            } else {
              this.props.setInteractionQuery(interactionId, { q: `"${from}"` });
            }
          }
        }
      );
    }
  };

  selectInteraction = (interactionId) => {
    this.props.selectInteraction(interactionId);
  };

  acceptInteraction = (interactionId) => {
    const interaction = this.props.agentDesktop.interactions.find(
      (availableInteraction) =>
        availableInteraction.interactionId === interactionId
    );
    this.props.setInteractionStatus(interactionId, 'work-accepting');
    if (
      interaction.isScriptOnly === true &&
      (interaction.channelType !== 'voice' || this.context.toolbarMode)
    ) {
      this.props.selectSidePanelTab(interactionId, 'script');
      this.props.showSidePanel(interactionId);
    }
    CxEngage.interactions.accept({ interactionId });
  };

  styles = {
    base: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    desktop: {
      height: '100vh',
      width: '100vw',
    },
    toolbarModeCollapsed: {
      height: '800px',
      width: '400px',
    },
    toolbarModeExpanded: {
      height: '800px',
      width: '800px',
    },
    notificationBanner: {
      flex: '1 0 content',
      alignSelf: 'flex-start',
    },
  };

  getToolbarSizing = () => {
    if (this.context.toolbarMode) {
      if (this.props.isSidePanelCollapsed) {
        return this.styles.toolbarModeCollapsed;
      } else {
        return this.styles.toolbarModeExpanded;
      }
    }
    return {};
  };

  render() {
    const banners = [];
    const refreshBannerIsVisible =
      this.props.agentDesktop.refreshRequired &&
      location.hostname !== 'localhost' &&
      location.hostname !== '127.0.0.1';
    let errorDescriptionMessage;
    const errorInfo = this.props.criticalError || this.props.nonCriticalError;

    if (refreshBannerIsVisible) {
      banners.push(
        <NotificationBanner
          key={messages.newVersion.id}
          id="version-refresh-banner"
          descriptionMessage={messages.newVersion}
          descriptionStyle={{
            textAlign: 'center',
          }}
          fullBannerAction={() => location.reload()}
          dismiss={this.hideRefreshBanner}
        />
      );
    }

    if (errorInfo) {
      const code = errorInfo.code;
      const interactionFatal = errorInfo.interactionFatal;
      if (interactionFatal) {
        errorDescriptionMessage = this.props.intl.formatMessage(
          errorMessages.interactionFailed
        );
      } else if (code && errorMessages[code]) {
        // Specific error message is found for this code
        errorDescriptionMessage = this.props.intl.formatMessage(
          errorMessages[code]
        );
      } else if (errorInfo.message) {
        // Fallback to message provided by error (for SDK errors)
        errorDescriptionMessage = errorInfo.message;
      } else {
        // Use default for other errors (probably made by us)
        errorDescriptionMessage = errorMessages.default;
      }
      if (code) {
        errorDescriptionMessage += ` (Code: ${code})`;
      }
    }

    if (this.props.criticalError) {
      banners.push(
        <NotificationBanner
          key={messages.criticalError.id}
          id="critical-error-banner"
          style={this.styles.notificationBanner}
          titleMessage={messages.criticalError}
          descriptionMessage={errorDescriptionMessage}
          isError
          rightLinkAction={this.logoutAndReload}
          rightLinkMessage={messages.reload}
        />
      );
    } else if (this.props.nonCriticalError) {
      banners.push(
        <NotificationBanner
          key={messages.nonCriticalError.id}
          id="noncritical-error-banner"
          style={this.styles.notificationBanner}
          titleMessage={messages.nonCriticalError}
          descriptionMessage={errorDescriptionMessage}
          isError
          dismiss={this.props.dismissError}
        />
      );
    }
    return (
      <div
        style={[this.styles.base, this.styles.desktop, this.getToolbarSizing()]}
      >
        {banners}
        {this.props.login.showLogin ||
        this.props.agentDesktop.presence === undefined ||
        // If error code is AD-100X, keep them in Login, or else AgentDesktop will break
        (this.props.criticalError &&
          this.props.criticalError.code &&
          this.props.criticalError.code.toString().includes('AD-100'))
          ? <Login />
          : <AgentDesktop />}
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  login: selectLoginMap(state, props).toJS(),
  agentDesktop: selectAgentDesktopMap(state, props).toJS(),
  availableStats: selectAvailableStats(state, props),
  criticalError: selectCriticalError(state, props),
  activatedStatIds: selectActivatedStatIds(state, props).toJS(),
  erroredStatIds: selectErroredStatIds(state, props),
  nonCriticalError: selectNonCriticalError(state, props),
  isSidePanelCollapsed: selectIsSidePanelCollapsed(state, props),
});

function mapDispatchToProps(dispatch) {
  return {
    showRefreshRequired: (show) => dispatch(showRefreshRequired(show)),
    showLogin: (show) => dispatch(showLogin(show)),
    setUserConfig: (response) => dispatch(setUserConfig(response)),
    setExtensions: (response) => dispatch(setExtensions(response)),
    updateWrapupDetails: (interactionId, wrapupDetails) =>
      dispatch(updateWrapupDetails(interactionId, wrapupDetails)),
    addScript: (interactionId, script) =>
      dispatch(addScript(interactionId, script)),
    removeScript: (interactionId) => dispatch(removeScript(interactionId)),
    setPresence: (response) => dispatch(setPresence(response)),
    setInteractionStatus: (interactionId, newStatus, response) =>
      dispatch(setInteractionStatus(interactionId, newStatus, response)),
    workAccepted: (interactionId, response) =>
      dispatch(workAccepted(interactionId, response)),
    addInteraction: (interaction) => dispatch(addInteraction(interaction)),
    workInitiated: (response) => dispatch(workInitiated(response)),
    removeInteraction: (interactionId) =>
      dispatch(removeInteraction(interactionId)),
    setMessageHistory: (response, agentId) =>
      dispatch(setMessageHistory(response, agentId)),
    assignContact: (interactionId, contact) =>
      dispatch(assignContact(interactionId, contact)),
    loadContactInteractionHistory: (contactId, page) =>
      dispatch(loadContactInteractionHistory(contactId, page)),
    setContactHistoryInteractionDetails: (response) =>
      dispatch(setContactHistoryInteractionDetails(response)),
    updateContact: (updatedContact) => dispatch(updateContact(updatedContact)),
    addMessage: (interactionId, message) =>
      dispatch(addMessage(interactionId, message)),
    selectInteraction: (interactionId) =>
      dispatch(selectInteraction(interactionId)),
    setContactLayout: (layout) => dispatch(setContactLayout(layout)),
    setContactAttributes: (attributes) =>
      dispatch(setContactAttributes(attributes)),
    setInteractionQuery: (interactionId, query) =>
      dispatch(setInteractionQuery(interactionId, query)),
    setCustomFields: (interactionId, customFields) =>
      dispatch(setCustomFields(interactionId, customFields)),
    setEmailPlainBody: (interactionId, body) =>
      dispatch(setEmailPlainBody(interactionId, body)),
    setEmailHtmlBody: (interactionId, body) =>
      dispatch(setEmailHtmlBody(interactionId, body)),
    setEmailDetails: (interactionId, details) =>
      dispatch(setEmailDetails(interactionId, details)),
    setEmailAttachmentUrl: (interactionId, artifactFileId, url) =>
      dispatch(setEmailAttachmentUrl(interactionId, artifactFileId, url)),
    muteCall: (interactionId) => dispatch(muteCall(interactionId)),
    unmuteCall: (interactionId) => dispatch(unmuteCall(interactionId)),
    holdCall: (interactionId) => dispatch(holdCall(interactionId)),
    resumeCall: (interactionId) => dispatch(resumeCall(interactionId)),
    recordCall: (interactionId) => dispatch(recordCall(interactionId)),
    stopRecordCall: (interactionId) => dispatch(stopRecordCall(interactionId)),
    transferCancelled: (interactionId) =>
      dispatch(transferCancelled(interactionId)),
    resourceAdded: (response) => dispatch(resourceAdded(response)),
    updateResourceName: (response) => dispatch(updateResourceName(response)),
    updateResourceStatus: (
      interactionId,
      targetResource,
      statusKey,
      statusValue
    ) =>
      dispatch(
        updateResourceStatus(
          interactionId,
          targetResource,
          statusKey,
          statusValue
        )
      ),
    holdMe: (interactionId) => dispatch(holdMe(interactionId)),
    resumeMe: (interactionId) => dispatch(resumeMe(interactionId)),
    resourceRemoved: (response) => dispatch(resourceRemoved(response)),
    emailAddAttachment: (interactionId, attachment) =>
      dispatch(emailAddAttachment(interactionId, attachment)),
    setAvailableStats: (stats, tenantId, userId) =>
      dispatch(setAvailableStats(stats, tenantId, userId)),
    initializeStats: () => dispatch(initializeStats()),
    statsReceived: (stats) => dispatch(statsReceived(stats)),
    setQueues: (queues) => dispatch(setQueues(queues)),
    setDispositionDetails: (interactionId, dispositions, forceSelect) =>
      dispatch(setDispositionDetails(interactionId, dispositions, forceSelect)),
    selectDisposition: (interactionId, disposition) =>
      dispatch(selectDisposition(interactionId, disposition)),
    selectSidePanelTab: (interactionId, tabName) =>
      dispatch(selectSidePanelTab(interactionId, tabName)),
    showSidePanel: (interactionId) => dispatch(showSidePanel(interactionId)),
    hideSidePanel: (interactionId) => dispatch(hideSidePanel(interactionId)),
    logout: () => dispatch(logout()),
    toggleAgentMenu: (show) => dispatch(toggleAgentMenu(show)),
    goNotReady: (reason, listId) => dispatch(goNotReady(reason, listId)),
    validateContactLayoutTranslations: () =>
      dispatch(validateContactLayoutTranslations()),
    handleSDKError: (error, topic) => dispatch(handleSDKError(error, topic)),
    setCriticalError: (error) => dispatch(setCriticalError(error)),
    setCRMUnavailable: (reason) => dispatch(setCRMUnavailable(reason)),
    addStatErrorId: (statId) => dispatch(addStatErrorId(statId)),
    removeStatErrorId: (statId) => dispatch(removeStatErrorId(statId)),
    dismissError: () => dispatch(dismissError()),
    dispatch,
  };
}

App.propTypes = {
  intl: intlShape.isRequired,
  showLogin: PropTypes.func.isRequired,
  setUserConfig: PropTypes.func.isRequired,
  setExtensions: PropTypes.func.isRequired,
  setPresence: PropTypes.func.isRequired,
  setInteractionStatus: PropTypes.func.isRequired,
  workAccepted: PropTypes.func.isRequired,
  updateWrapupDetails: PropTypes.func.isRequired,
  addScript: PropTypes.func.isRequired,
  removeScript: PropTypes.func.isRequired,
  addInteraction: PropTypes.func.isRequired,
  workInitiated: PropTypes.func.isRequired,
  removeInteraction: PropTypes.func.isRequired,
  setMessageHistory: PropTypes.func.isRequired,
  assignContact: PropTypes.func.isRequired,
  loadContactInteractionHistory: PropTypes.func.isRequired,
  setContactHistoryInteractionDetails: PropTypes.func.isRequired,
  updateContact: PropTypes.func.isRequired,
  addMessage: PropTypes.func.isRequired,
  selectInteraction: PropTypes.func.isRequired,
  setContactLayout: PropTypes.func.isRequired,
  setContactAttributes: PropTypes.func.isRequired,
  setInteractionQuery: PropTypes.func.isRequired,
  setCustomFields: PropTypes.func.isRequired,
  setEmailPlainBody: PropTypes.func.isRequired,
  setEmailHtmlBody: PropTypes.func.isRequired,
  setEmailDetails: PropTypes.func.isRequired,
  setEmailAttachmentUrl: PropTypes.func.isRequired,
  muteCall: PropTypes.func.isRequired,
  unmuteCall: PropTypes.func.isRequired,
  holdCall: PropTypes.func.isRequired,
  resumeCall: PropTypes.func.isRequired,
  recordCall: PropTypes.func.isRequired,
  stopRecordCall: PropTypes.func.isRequired,
  transferCancelled: PropTypes.func.isRequired,
  resourceAdded: PropTypes.func.isRequired,
  updateResourceName: PropTypes.func.isRequired,
  updateResourceStatus: PropTypes.func.isRequired,
  holdMe: PropTypes.func.isRequired,
  resumeMe: PropTypes.func.isRequired,
  resourceRemoved: PropTypes.func.isRequired,
  emailAddAttachment: PropTypes.func.isRequired,
  setAvailableStats: PropTypes.func.isRequired,
  statsReceived: PropTypes.func.isRequired,
  setQueues: PropTypes.func.isRequired,
  setDispositionDetails: PropTypes.func.isRequired,
  selectDisposition: PropTypes.func.isRequired,
  selectSidePanelTab: PropTypes.func.isRequired,
  showSidePanel: PropTypes.func.isRequired,
  hideSidePanel: PropTypes.func.isRequired,
  initializeStats: PropTypes.func.isRequired,
  showRefreshRequired: PropTypes.func.isRequired,
  toggleAgentMenu: PropTypes.func.isRequired,
  goNotReady: PropTypes.func.isRequired,
  validateContactLayoutTranslations: PropTypes.func.isRequired,
  handleSDKError: PropTypes.func.isRequired,
  setCriticalError: PropTypes.func.isRequired,
  setCRMUnavailable: PropTypes.func.isRequired,
  addStatErrorId: PropTypes.func.isRequired,
  removeStatErrorId: PropTypes.func.isRequired,
  login: PropTypes.object,
  agentDesktop: PropTypes.object,
  availableStats: PropTypes.object,
  activatedStatIds: PropTypes.array,
  erroredStatIds: PropTypes.array,
  criticalError: PropTypes.any,
  nonCriticalError: PropTypes.any,
  isSidePanelCollapsed: PropTypes.bool,
  dismissError: PropTypes.func,
};

App.contextTypes = {
  crmEnabled: PropTypes.bool,
  toolbarMode: PropTypes.bool,
};

export default injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(Radium(App))
);
