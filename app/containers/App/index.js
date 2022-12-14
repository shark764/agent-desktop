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
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import Radium from 'radium';
import axios from 'axios';
import { hot } from 'react-hot-loader';
import { createSearchQuery } from 'utils/contact';
import { isUUID } from 'utils/validator';
import crmCssAdapter from 'utils/crmCssAdapter';
import { generateErrorMessage } from 'utils/errorMessage';
import { generateUUID } from 'utils/uuid';
import { getDefaultWorkMode } from 'utils/url';

import { kebabCaseToCamelCase } from 'serenova-js-utils/strings';
import PresenceStateIconSVG from 'components/PresenceStateIconSVG';
import DirectionIconSVG from 'components/DirectionIconSVG';

import voiceIcon from 'assets/icons/voice.png';
import messageIcon from 'assets/icons/message_new.png';
import emailIcon from 'assets/icons/email_new.png';
import workItemIcon from 'assets/icons/work_item_new.png';

import notificationSound from 'assets/sounds/SynthDoubleHit.mp3';

import {
  DEFAULT_TOOLBAR_WIDTH,
  EXPANDED_TOOLBAR_WIDTH,
  DEFAULT_TOOLBAR_HEIGHT,
} from 'containers/AgentDesktop/constants';

import ResponseMessage from 'models/Message/ResponseMessage';

import Login from 'containers/Login';
import NotificationBanner from 'components/NotificationBanner';
import ConfirmationPopupGoReady from 'containers/ConfirmationPopupGoReady';
import LoginPopup from 'containers/LoginPopup';

import AgentDesktop from 'containers/AgentDesktop';

import { selectLocale } from 'containers/LanguageProvider/selectors';
import { sendScript, sendTimeoutScript } from 'containers/AgentScript/thunks';
import {
  setAvailableStats,
  statsReceived,
  toggleAgentMenu,
  initializeStats,
} from 'containers/Toolbar/actions';
import { showLogin } from 'containers/Login/actions';
import {
  setContactLayout,
  setContactAttributes,
} from 'containers/SidePanel/actions';
import {
  setCriticalError,
  setSessionEndedBySupervisor,
  setNonCriticalError,
  handleSDKError,
  addStatErrorId,
  removeStatErrorId,
  dismissError,
} from 'containers/Errors/actions';

import {
  selectAudioPreferences,
  selectVisualPreferences,
} from 'containers/AgentNotificationsMenu/selectors';
import { selectAvailableStats } from 'containers/AgentStats/selectors';
import {
  selectActivatedStatIds,
  selectReadyState,
} from 'containers/Toolbar/selectors';
import {
  selectCriticalError,
  selectSessionEnded,
  selectErroredStatIds,
  selectNonCriticalError,
} from 'containers/Errors/selectors';

import errorMessages from 'containers/Errors/messages';

import {
  setCRMUnavailable,
  validateContactLayoutTranslations,
  setLoading,
} from 'containers/InfoTab/actions';
import { startOutboundEmail } from 'containers/EmailContentArea/actions';
import { setResourceCapactiy, setUsers } from 'containers/TransferMenu/actions';
import {
  setUserConfig,
  setAgentDirection,
  setExtensions,
  setPresence,
  addInteraction,
  workInitiated,
  addMessage,
  setSmoochMessageHistory,
  addSmoochMessage,
  setCustomerTyping,
  setCustomerRead,
  setMessageHistory,
  updateMessageHistoryAgentName,
  assignContact,
  setAssignedContact,
  unassignContact,
  dismissContactWasAssignedNotification,
  dismissContactWasUnassignedNotification,
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
  updateCallControls,
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
  emailCanSendReply,
  emailAddAttachment,
  setQueues,
  setDispositionDetails,
  selectDisposition,
  goNotReady,
  setCrmModule,
  setStandalonePopup,
  setCrmActiveTab,
  startOutboundInteraction,
  loadCrmInteractionHistory,
  openNewInteractionPanel,
  toggleInteractionNotification,
  setQueuesTime,
  toggleIsOnline,
  customerConnected,
  setTransferListsFromFlow,
  setTranferringInConference,
  dismissAgentDirection,
  dismissAgentPresenceState,
  setContactMode,
  removeContact,
  crmDownloadComplete,
} from 'containers/AgentDesktop/actions';

import { toggleSelectedQueueTransferMenuPreference } from 'containers/AgentTransferMenuPreferenceMenu/actions';

import {
  selectAgentDesktopMap,
  selectLoginMap,
  selectQueues,
  selectCrmModule,
  getSelectedInteractionId,
  selectIsCrmDownloaded,
  selectHasInteractions,
} from 'containers/AgentDesktop/selectors';

import {
  updateActiveOutputRingtoneDevices,
  updateActiveOutputSpeakerDevices,
  goUpdateAudioOutputUserPreferences,
} from 'containers/AudioOutputMenu/thunks';
import { setOutputSelectionSupported } from 'containers/AudioOutputMenu/reducer';
import {
  getActiveOutputNotificationDevice,
  selectOutputSelectionSupported,
  selectActiveExtensionIsTwilio,
} from 'containers/AudioOutputMenu/selectors';
import {
  selectAgentDirection,
  selectSelectedPresenceReason,
} from 'containers/AgentStatusMenu/selectors';

import { store } from 'store';
import { sdkResponseLog } from '../../utils/logs';

import { selectHasCrmPermissions } from './selectors';

import { version as release } from '../../../package.json';

import messages from './messages';
import sdkIgnoreTopics from './sdkIgnoreTopics';
import sdkLogTopics from './sdkLogTopics';

import { setGlobalLocale } from '../../i18n';

export class App extends React.Component {
  componentWillMount() {
    if (
      window.location.hostname === 'localhost' ||
      window.location.hostname.includes('ngrok')
    ) {
      this.init();
    } else {
      this.loadConf();
    }
    window.addEventListener('beforeunload', (e) => {
      if (window.opener && this.targetOrigin) {
        window.opener.postMessage(
          { error: null, topic: 'skylight/closed' },
          this.targetOrigin
        );
      }
      if (this.props.agentDesktop.interactions.length) {
        e.returnValue = true;
      }
    });

    window.addEventListener('online', this.setOnlineStatus);
    window.addEventListener('offline', this.setOnlineStatus);

    if (
      window.parent === window &&
      Notification.permission !== 'granted' &&
      Notification.permission !== 'denied'
    ) {
      Notification.requestPermission();
    }
  }

  targetOrigin;

  setOnlineStatus = () => {
    if (!navigator.onLine) {
      this.props.toggleIsOnline(false);
    } else {
      this.props.dismissError();
      this.props.toggleIsOnline(true);
    }
  };

  loadConf = () => {
    const relativeUrl = window.location.href.substr(
      0,
      window.location.href.lastIndexOf('/')
    );
    axios({
      method: 'get',
      url: `${relativeUrl}/config.json?t=${Date.now()}`,
    }).then((res) => {
      if (typeof res.data !== 'undefined') {
        if (
          release !== res.data.config.version &&
          !window.location.hostname.includes('frontend-prs.cxengagelabs.net')
        ) {
          this.props.showRefreshRequired(true);
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
    CxEngage.authentication.logout();
    window.location.reload();
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

  playAudioNotification = () => {
    const audio = new Audio(notificationSound);
    if (
      this.props.activeExtensionIsTwilio &&
      this.props.isOutputSelectionSupported
    ) {
      // https://www.twilio.com/docs/voice/client/javascript/device#browser-support
      audio.setSinkId(this.props.activeNotificationDeviceId);
    }
    audio.play();
  };

  init = () => {
    let where;
    let environment;
    let logLevel;
    let blastSqsOutput;
    let reportingRefreshRate;

    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has('api') && urlParams.has('env')) {
      where = urlParams.get('api');
      environment = urlParams.get('env');
      console.log('Using URL params for api and env', where, environment);
      logLevel = 'debug';
      blastSqsOutput = true;
      reportingRefreshRate = 10000;
    } else if (typeof window.ADconf !== 'undefined') {
      where = window.ADconf.api;
      environment = window.ADconf.env;
      ({ logLevel, blastSqsOutput } = window.ADconf);
      reportingRefreshRate = window.ADconf.refreshRate;
    } else if (
      window.location.hostname === 'localhost' ||
      window.location.hostname.includes('ngrok')
    ) {
      where = 'qe-api.cxengagelabs.net/v1/';
      environment = 'qe';
      logLevel = 'debug';
      blastSqsOutput = true;
      reportingRefreshRate = 10000;
    } else {
      console.error('Server conf file not found, Unable to load desktop');
    }

    /**
     * Setting locale for internationalization,
     * datetime formatted displaying for Agent-Desktop purpose
     */
    setGlobalLocale(this.props.locale);

    // Initialize Remote Logging with Sentry.io
    // Check if environment === 'prod' to re-enable
    if (
      environment !== 'qe' &&
      window.location.hostname !== 'localhost' &&
      !window.location.hostname.includes('ngrok')
    ) {
      Raven.config(
        'https://174eac35087743728280b4c0fad5fcc9@sentry.io/1015776',
        {
          release,
          environment,
          autoBreadcrumbs: {
            xhr: false,
          },
          shouldSendCallback: (data) => data.logError,
          dataCallback: (data) => {
            const dataWithState = { ...data };
            try {
              const state = store.getState().toJS();
              delete state.login.agent.tenants;
              delete state.login.agent.accountTenants;
              delete state.sidePanel.contactAttributes;
              dataWithState.extra = state;
            } catch (error) {
              Raven.captureException(error, {
                logError: true,
                tags: { type: 'storeError' },
              });
            }
            return dataWithState;
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
      locale: this.props.locale,
    };

    const crmModule = new URL(window.location.href).searchParams.get(
      'crmModule'
    );

    if (crmModule) {
      if (
        crmModule === 'zendesk' ||
        crmModule === 'salesforce-classic' ||
        crmModule === 'salesforce-lightning'
      ) {
        sdkConf.crmModule = crmModule;
        this.props.setCrmModule(crmModule);
      } else {
        console.error(
          `Unsupported CRM module: ${crmModule}. Supported CRM modules are: zendesk, salesforce-classic, salesforce-lightning`
        );
        this.props.setCrmModule('none');
      }
    } else {
      this.props.setCrmModule('none');
    }

    const standalonePopup = new URL(window.location.href).searchParams.get(
      'standalonePopup'
    );

    if (standalonePopup) {
      this.props.setStandalonePopup();
    }

    CxEngage.initialize(sdkConf);

    Raven.setTagsContext({ sdkVersion: CxEngage.version });

    window.onerror = (errorMsg, url, lineNumber, column, errorObj) => {
      // Log error if the url in first line of the stack trace is the SDK
      if (errorObj && errorObj.stack) {
        const errorStackArray = errorObj.stack.split('\n', 2);
        if (
          errorStackArray.length === 2 &&
          errorStackArray[1].includes('https://sdk.cxengage.net/js/agent')
        ) {
          Raven.captureException(errorObj, {
            tags: {
              type: 'sdk',
            },
            logError: true,
          });
        }
      }
    };

    const skylightController = new URL(window.location.href).searchParams.get(
      'skylightController'
    );

    if (skylightController) {
      console.log('skylightController set', skylightController);
      window.addEventListener('message', (event) => {
        if (
          event &&
          event.data &&
          event.data.skylightController &&
          event.data.controllerInit
        ) {
          if (!this.targetOrigin) {
            this.targetOrigin = event.origin;
            console.log('targetOrigin set', event.origin);
            event.source.postMessage(
              { error: null, topic: 'skylight/target-origin-defined' },
              this.targetOrigin
            );
          } else {
            console.warn(
              'targetOrigin has already been defined',
              this.targetOrigin
            );
            if (event.source) {
              event.source.postMessage(
                {
                  error: true,
                  topic: 'skylight/target-origin-already-defined',
                },
                event.origin
              );
            }
          }
          return;
        }
        if (
          !this.targetOrigin ||
          (this.targetOrigin !== '*' && event.origin !== this.targetOrigin)
        ) {
          return;
        }
        if (event && event.data && event.data.skylightController) {
          console.log('skylightController event', event.data);
          if (event.data.command === 'dumpState') {
            const sdkState = CxEngage.dumpState();
            window.opener.postMessage(
              {
                error: null,
                topic: 'cxengage/state',
                response: {
                  interactions: sdkState.interactions,
                  session: sdkState.session,
                  user: sdkState.user,
                },
              },
              this.targetOrigin
            );
          } else if (event.data.subModule) {
            CxEngage[event.data.module][event.data.subModule][
              event.data.command
            ](event.data.data);
          } else {
            CxEngage[event.data.module][event.data.command](event.data.data);
          }
        } else {
          console.warn(
            'Unexpected data format. Expected data.skylightController',
            event
          );
        }
      });

      if (window.opener) {
        window.opener.postMessage(
          { error: null, topic: 'skylight/loaded' },
          '*'
        );
      }
    }

    CxEngage.subscribe('cxengage', (error, topic, response) => {
      if (skylightController && window.opener) {
        if (this.targetOrigin) {
          window.opener.postMessage(
            { error, topic, response },
            this.targetOrigin
          );
        } else {
          console.warn(
            'skylightController has been set, but there is not yet a targetOrigin'
          );
        }
      }
      if (
        error &&
        topic !== 'cxengage/errors/error/mqtt-lost-connection' // Error handled the same as non-error
      ) {
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
          case 'cxengage/session/set-direction-response':
          case 'cxengage/session/direction-change-response': {
            this.props.setAgentDirection(response);
            break;
          }
          case 'cxengage/session/started': {
            if (Object.keys(this.props.availableStats).length === 0) {
              CxEngage.reporting.getAvailableStats();
            }
            this.props.showLogin(false);
            const defaultWorkMode = getDefaultWorkMode();
            if (defaultWorkMode) {
              CxEngage.session.setDirection({ direction: defaultWorkMode });
            }
            break;
          }
          case 'cxengage/session/ended': {
            if (response.supervisorId) {
              this.props.setSessionEndedBySupervisor(response, {
                code: 'sessionEnded',
              });
            } else {
              this.props.setCriticalError({ code: 2003 });
            }
            // We clear any open banner for direction
            // or state change from monitoring
            this.props.dismissAgentDirection();
            this.props.dismissAgentPresenceState();
            break;
          }

          // NOTIFICATIONS
          case 'cxengage/notifications/show-banner': {
            if (response.notification === 'whatsapp-customer-disconnect') {
              this.props.setNonCriticalError({ code: 'AD-1011' });
            } else if (response.notification === 'facebook-invalid-token') {
              this.props.setNonCriticalError({ code: 'AD-1012' });
            } else if (response.notification === 'failed-smooch-message') {
              this.props.setNonCriticalError({ code: 'AD-1013', source: response.source, additionalMessage: response.message });
            } else if (response.interactionId && response.extraParams) {
              const extraParamsKeys = Object.keys(response.extraParams);
              extraParamsKeys.forEach((extraParam) => {
                this.props.toggleInteractionNotification(
                  response.interactionId,
                  {
                    isDismissible: false,
                    isError: false,
                    messageKey: extraParam,
                  }
                );
              });
            } else {
              console.error(
                'Missing interactions id and extraParams:',
                response
              );
            }
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
                  interaction.direction === 'agent-initiated' &&
                  (interaction.channelType === 'sms' ||
                    interaction.channelType === 'email')
                )
              ) {
                this.props.workInitiated(response);
              }

              if (
                interaction.direction === 'agent-initiated' &&
                (interaction.channelType === 'sms' ||
                  interaction.channelType === 'email')
              ) {
                CxEngage.interactions.accept({
                  interactionId: response.interactionId,
                });
              } else if (interaction.autoAnswer === true) {
                this.acceptInteraction(response.interactionId);
              }

              if (!document.hasFocus()) {
                if (
                  window.parent === window &&
                  Notification.permission === 'granted' &&
                  this.props.visualNotificationsEnabled
                ) {
                  let icon;
                  if (interaction.channelType === 'voice') {
                    icon = voiceIcon;
                  } else if (
                    interaction.channelType === 'messaging' ||
                    interaction.channelType === 'sms'
                  ) {
                    icon = messageIcon;
                  } else if (interaction.channelType === 'email') {
                    icon = emailIcon;
                  } else if (interaction.channelType === 'work-item') {
                    icon = workItemIcon;
                  }
                  let body;
                  if (
                    interaction.channelType !== 'messaging' &&
                    interaction.channelType !== 'work-item'
                  ) {
                    body = response.customer;
                  }
                  const notification = new Notification(
                    this.props.intl.formatMessage(messages.newInteraction),
                    {
                      body,
                      icon,
                    }
                  );
                  notification.onclick = (e) => {
                    e.preventDefault();
                    window.focus();
                    window.parent.focus();
                    e.currentTarget.close();
                  };
                  setTimeout(() => {
                    notification.close();
                  }, 5000);
                }
                if (
                  interaction.channelType !== 'voice' &&
                  this.props.audioNotificationsEnabled
                ) {
                  this.playAudioNotification();
                }
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
            this.props.customerConnected(response.interactionId);
            if (
              this.props.login.agent.userId !==
              response.extraParams.targetResource
            ) {
              this.props.resourceAdded(response);
              if (!response.extraParams.externalResource) {
                CxEngage.entities.getUser(
                  {
                    resourceId: response.extraParams.targetResource,
                  },
                  (getUserError, getUserTopic, getUserResponse) => {
                    if (!getUserError) {
                      const {
                        firstName,
                        lastName,
                        id,
                        email,
                      } = getUserResponse.result;
                      const name =
                        firstName || lastName
                          ? `${firstName} ${lastName}`
                          : email;
                      this.props.updateResourceName(
                        response.interactionId,
                        id,
                        name
                      );
                    }
                  }
                );
              }
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
            const interaction = this.props.agentDesktop.interactions.find(
              (availableInteraction) =>
                availableInteraction.interactionId === response.interactionId
            );
            if (
              interaction &&
              interaction.script &&
              interaction.script.autoScriptDismiss
            ) {
              this.props.sendScript(
                response.interactionId,
                interaction.script,
                true,
                'script-auto-dismissed'
              );
            }
            this.props.removeInteraction(response.interactionId);
            break;
          }
          case 'cxengage/interactions/work-offer-received': {
            this.props.toggleAgentMenu(false);
            this.props.addInteraction(response);
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
          case 'cxengage/interactions/interaction-update-transfer-menu': {
            this.props.setTransferListsFromFlow(
              response.interactionId,
              response.transferListsFromFlow
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
              loadingWrapupStatusUpdate: false,
            });
            break;
          }
          case 'cxengage/interactions/disable-wrapup-acknowledged': {
            this.props.updateWrapupDetails(response.interactionId, {
              wrapupEnabled: false,
              loadingWrapupStatusUpdate: false,
            });
            break;
          }
          case 'cxengage/interactions/script-received': {
            const script = JSON.parse(response.script);
            this.props.addScript(
              response.interactionId,
              script,
              response.scriptId
            );
            const interaction = this.props.agentDesktop.interactions.find(
              (availableInteraction) =>
                availableInteraction.interactionId === response.interactionId
            );
            if (
              !interaction.isScriptOnly &&
              interaction.channelType !== 'voice'
            ) {
              this.props.selectSidePanelTab(response.interactionId, 'script');
              this.props.showSidePanel(interaction.interactionId);
            }
            if (
              script.submitAfterTimeoutValue &&
              script.submitAfterTimeoutUnit
            ) {
              this.props.sendTimeoutScript(
                script,
                interaction.interactionId,
                response.scriptId,
                'script-timeout'
              );
            }
            break;
          }
          case 'cxengage/interactions/send-script': {
            const interaction = this.props.agentDesktop.interactions.find(
              (availableInteraction) =>
                availableInteraction.interactionId === response
            );
            if (interaction) {
              if (!this.context.toolbarMode) {
                if (interaction.channelType !== 'voice') {
                  this.props.selectSidePanelTab(response, 'info');
                }
              } else {
                this.props.hideSidePanel(interaction.interactionId);
              }
              this.props.removeScript(response);
            } else {
              console.warn(
                'Received send-script, but no associated interaction in state',
                response
              );
            }
            break;
          }
          case 'cxengage/interactions/disposition-code-changed': {
            this.props.selectDisposition(
              response.interactionId,
              response.disposition
            );
            break;
          }
          case 'cxengage/interactions/screen-pop-received': {
            // Ignore screen pop v1
            if (response.version !== 'v2') {
              console.log('Ignoring non v2 screen-pop');
              break;
            }
            const interaction = this.props.agentDesktop.interactions.find(
              (availableInteraction) =>
                availableInteraction.interactionId === response.interactionId
            );
            if (interaction && interaction.channelType === 'work-item') {
              console.log('Ignoring screen-pop for work-items');
              break;
            }
            if (!this.context.toolbarMode && this.props.hasCrmPermissions) {
              if (response.popType === 'external-url') {
                console.log(
                  'Ignoring external-url screen-pop; handled by the SDK.'
                );
              } else if (response.popType === 'url') {
                // Internal screen pop: retrieve specific contact
                if (isUUID(response.popUri)) {
                  CxEngage.contacts.get(
                    { contactId: response.popUri },
                    (contactGetError, contactGetTopic, contactGetResponse) => {
                      if (!contactGetError) {
                        sdkResponseLog(
                          '[AgentDesktop] CxEngage.subscribe()',
                          contactGetTopic,
                          contactGetResponse
                        );
                        this.props.assignContact(
                          response.interactionId,
                          contactGetResponse
                        );
                      }
                    }
                  );
                } else {
                  console.warn(
                    'Unexpectedly received non-UUID popUri. Ignoring.',
                    response.popUri
                  );
                }
              } else if (response.popType === 'search-pop') {
                if (response.searchType === 'strict') {
                  if (response.filterType === 'or') {
                    this.attemptContactSearch(
                      response.filter,
                      response.interactionId,
                      interaction
                    );
                  } else if (response.filterType === 'and') {
                    this.attemptContactSearch(
                      { op: 'and', ...response.filter },
                      response.interactionId,
                      interaction
                    );
                  } else {
                    console.error(
                      `Unhandled filterType: ${response.filterType}`
                    );
                  }
                } else if (response.searchType === 'fuzzy') {
                  const terms = response.terms.filter((term) => {
                    if (!term) {
                      console.warn(
                        'Excluding falsey term from screen pop',
                        term
                      );
                    }
                    return term;
                  });
                  const fuzzySearchString = terms
                    .map((term) => {
                      const trimmedTerm = term.trim();
                      if (
                        trimmedTerm.includes(' ') &&
                        !trimmedTerm.includes('"')
                      ) {
                        return `"${trimmedTerm}"`;
                      } else {
                        return trimmedTerm;
                      }
                    })
                    .join(' ');
                  this.attemptContactSearch(
                    { q: fuzzySearchString },
                    response.interactionId,
                    interaction,
                    terms
                  );
                } else {
                  console.error(`Unhandled searchType: ${response.searchType}`);
                }
              } else {
                console.error(`Unhandled pop type: ${response.popType}`);
              }
            } else {
              console.log('Ignoring screen-pop. Not using skylight CRM');
            }
            break;
          }

          // INTERACTIONS/VOICE
          case 'cxengage/interactions/voice/update-call-controls': {
            this.props.updateCallControls(
              response.interactionId,
              response.extraParams
            );
            break;
          }
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
          case 'cxengage/interactions/voice/customer-connected': {
            this.props.customerConnected(response.interactionId);
            break;
          }
          case 'cxengage/interactions/voice/transfer-started': {
            this.props.setTranferringInConference(response.interactionId, true);
            break;
          }
          case 'cxengage/interactions/voice/transfer-connected':
          case 'cxengage/interactions/voice/transfer-cancelled': {
            this.props.setTranferringInConference(
              response.interactionId,
              false
            );
            break;
          }

          // INTERACTIONS/MESSAGING
          case 'cxengage/interactions/smooch-messaging/history-received': {
            this.props.setSmoochMessageHistory(response);
            break;
          }
          case 'cxengage/interactions/messaging/history-received': {
            if (response && response.length > 0) {
              this.props.setMessageHistory(response);
              const interactionId = response[0].to;
              const agents = [];
              response.forEach((messageHistoryItem) => {
                if (
                  messageHistoryItem.metadata &&
                  messageHistoryItem.metadata.type === 'agent' &&
                  messageHistoryItem.from !== this.props.login.agent.userId &&
                  !agents.includes(messageHistoryItem.from)
                ) {
                  agents.push(messageHistoryItem.from);
                  CxEngage.entities.getUser(
                    {
                      resourceId: messageHistoryItem.from,
                    },
                    (getUserError, getUserTopic, getUserResponse) => {
                      if (!getUserError) {
                        this.props.updateMessageHistoryAgentName(
                          interactionId,
                          getUserResponse.result
                        );
                      }
                    }
                  );
                }
              });
            } else {
              console.warn(`No message history: ${response}`);
            }
            break;
          }
          case 'cxengage/errors/error/mqtt-lost-connection': {
            this.props.agentDesktop.interactions.forEach((interaction) => {
              if (
                (interaction.channelType === 'sms' ||
                  interaction.channelType === 'messaging') &&
                interaction.source !== 'smooch'
              ) {
                this.props.toggleInteractionNotification(
                  interaction.interactionId,
                  {
                    id: 'mqtt-disconnect',
                    uuid: generateUUID(),
                    code: 'AD-1008',
                    isDismissible: false,
                    isError: true,
                  }
                );
              }
            });
            break;
          }
          case 'cxengage/interactions/messaging/mqtt-session-connected': {
            this.props.agentDesktop.interactions.forEach((interaction) => {
              if (
                (interaction.channelType === 'sms' ||
                  interaction.channelType === 'messaging') &&
                interaction.source !== 'smooch'
              ) {
                let uuid;
                interaction.notifications.forEach((notification) => {
                  if (notification.id === 'mqtt-disconnect') {
                    ({ uuid } = notification);
                  }
                });
                if (uuid) {
                  this.props.toggleInteractionNotification(
                    interaction.interactionId,
                    { uuid }
                  );
                }
              }
            });
            break;
          }
          case 'cxengage/interactions/smooch-messaging/message-received':
          case 'cxengage/interactions/smooch-messaging/attachment-sent':
          case 'cxengage/interactions/messaging/new-message-received': {
            const isSmooch =
              topic ===
                'cxengage/interactions/smooch-messaging/message-received' ||
              topic ===
                'cxengage/interactions/smooch-messaging/attachment-sent';
            if (
              (!isSmooch && isUUID(response.from) === false) ||
              (isSmooch &&
                response.message &&
                response.message.type === 'customer')
            ) {
              if (this.props.crmModule === 'zendesk') {
                CxEngage.zendesk.setVisibility({ visibility: true });
              } else if (this.props.crmModule === 'salesforce-classic') {
                CxEngage.salesforceClassic.setVisibility({ visibility: true });
              } else if (this.props.crmModule === 'salesforce-lightning') {
                CxEngage.salesforceLightning.isVisible((e, t, r) => {
                  if (!r) {
                    CxEngage.salesforceLightning.setVisibility({
                      visibility: true,
                    });
                  }
                });
              }

              if (!document.hasFocus()) {
                if (
                  window.parent === window &&
                  Notification.permission === 'granted' &&
                  this.props.visualNotificationsEnabled
                ) {
                  const notification = new Notification(
                    this.props.intl.formatMessage(messages.newMessage),
                    {
                      icon: messageIcon,
                    }
                  );
                  notification.onclick = (e) => {
                    e.preventDefault();
                    window.focus();
                    window.parent.focus();
                    e.currentTarget.close();
                  };
                  setTimeout(() => {
                    notification.close();
                  }, 5000);
                }
                if (this.props.audioNotificationsEnabled) {
                  this.playAudioNotification();
                }
              }
            }

            if (isSmooch) {
              if (
                response.message.text === 'INTERACTION_NOT_FOUND_ERROR' &&
                response.message.type === 'system' &&
                this.props.agentDesktop.selectedInteractionId ===
                  response.interactionId
              ) {
                this.props.setNonCriticalError({ code: 'interactionFailed' });
                this.props.removeInteraction(response.interactionId);
              } else {
                this.props.addSmoochMessage(
                  response.interactionId,
                  response.message
                );
              }
            } else {
              this.props.addMessage(
                response.to,
                new ResponseMessage(
                  response,
                  this.props.agentDesktop.selectedInteractionId
                )
              );
            }
            break;
          }

          case 'cxengage/interactions/smooch-messaging/conversation-read-received': {
            this.props.setCustomerRead(response.interactionId, true);
            break;
          }

          case 'cxengage/interactions/smooch-messaging/typing-received': {
            const isTyping = response.messageType === 'typing-start';
            this.props.setCustomerTyping(response.interactionId, isTyping);
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
                  sdkResponseLog(
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
          case 'cxengage/interactions/email/email-reply-artifact-created': {
            this.props.emailCanSendReply(response.interactionId);
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

          // SALESFORCE CLASSIC
          case 'cxengage/salesforce-classic/initialize-complete': {
            CxEngage.salesforceClassic.setDimensions({
              width: DEFAULT_TOOLBAR_WIDTH,
            });
            this.props.crmDownloadComplete();
            break;
          }
          case 'cxengage/salesforce-classic/on-click-to-interaction': {
            CxEngage.salesforceClassic.setVisibility({ visibility: true });
            this.props.openNewInteractionPanel(
              this.context.toolbarMode,
              response.number,
              response.popUri,
              response.objectName
            );
            break;
          }
          case 'cxengage/salesforce-classic/contact-assignment-acknowledged': {
            let contact;
            if (response.hookSubType !== null && response.hookId) {
              contact = {
                type: response.hookSubType,
                id: response.hookId,
                attributes: { name: response.hookName },
              };
              this.props.setAssignedContact(response.interactionId, contact);
              setTimeout(() => {
                this.props.dismissContactWasAssignedNotification(
                  response.interactionId
                );
              }, 5000);
              break;
            } else {
              console.error(
                `Not an applicable assignment option on the current active tab,  Topic: ${topic}  Response:`,
                response
              );
              break;
            }
          }
          case 'cxengage/salesforce-classic/contact-unassignment-acknowledged': {
            this.props.unassignContact(response.interactionId);
            setTimeout(() => {
              this.props.dismissContactWasUnassignedNotification(
                response.interactionId
              );
            }, 5000);
            break;
          }
          case 'cxengage/salesforce-classic/active-tab-changed': {
            if (response.object !== undefined) {
              this.props.setCrmActiveTab(
                response.object,
                response.objectId,
                response.objectName
              );
            } else {
              console.error(
                `No salesforce object found in ${topic} response:`,
                response
              );
            }
            break;
          }

          // SALESFORCE LIGHTNING
          case 'cxengage/salesforce-lightning/initialize-complete': {
            CxEngage.salesforceLightning.setDimensions({
              width: DEFAULT_TOOLBAR_WIDTH,
            });
            this.props.crmDownloadComplete();
            break;
          }
          case 'cxengage/salesforce-lightning/on-click-to-interaction': {
            CxEngage.salesforceLightning.isVisible((e, t, r) => {
              if (!r) {
                CxEngage.salesforceLightning.setVisibility({
                  visibility: true,
                });
              }
            });

            this.props.openNewInteractionPanel(
              this.context.toolbarMode,
              response.number,
              response.popUri,
              response.hookName
            );
            break;
          }
          case 'cxengage/salesforce-lightning/contact-assignment-acknowledged': {
            let contact;
            if (response.hookSubType !== null && response.hookId) {
              contact = {
                type: response.hookSubType,
                id: response.hookId,
                attributes: { name: response.hookName },
              };
              this.props.setAssignedContact(response.interactionId, contact);
              setTimeout(() => {
                this.props.dismissContactWasAssignedNotification(
                  response.interactionId
                );
              }, 5000);
              break;
            } else {
              console.error(
                `Not an applicable assignment option on the current active tab,  Topic: ${topic}  Response:`,
                response
              );
              break;
            }
          }
          case 'cxengage/salesforce-lightning/contact-unassignment-acknowledged': {
            this.props.unassignContact(response.interactionId);
            setTimeout(() => {
              this.props.dismissContactWasUnassignedNotification(
                response.interactionId
              );
            }, 5000);
            break;
          }
          case 'cxengage/salesforce-lightning/active-tab-changed': {
            if (
              response.hookSubType !== undefined &&
              response.hookId !== undefined
            ) {
              this.props.setCrmActiveTab(
                response.hookSubType,
                response.hookId,
                response.hookName
              );
            } else {
              console.error(
                `No salesforce object found in ${topic} response:`,
                response
              );
            }
            break;
          }

          // ZENDESK
          case 'cxengage/zendesk/zendesk-initialization': {
            CxEngage.zendesk.setDimensions({
              width: DEFAULT_TOOLBAR_WIDTH,
            });
            break;
          }
          case 'cxengage/zendesk/active-tab-changed': {
            if (response.user !== undefined) {
              this.props.setCrmActiveTab(
                'user',
                response.user.id,
                response.user.name
              );
            } else if (response.ticket !== undefined) {
              this.props.setCrmActiveTab(
                'ticket',
                response.ticket.id,
                response.ticket.subject !== null
                  ? response.ticket.subject
                  : response.ticket.description
              );
            } else if (Object.keys(response).length === 0) {
              this.props.setCrmActiveTab(undefined);
            } else {
              console.error(
                `Neither user, ticket, nor blank tab found in active-tab-changed response: ${response}`
              );
            }
            break;
          }
          case 'cxengage/zendesk/internal-pop-received':
          case 'cxengage/zendesk/contact-assignment-acknowledged':
          case 'cxengage/zendesk/related-to-assignment-acknowledged': {
            let contact;
            if (topic === 'cxengage/zendesk/internal-pop-received') {
              if (response.user !== undefined) {
                contact = {
                  type: 'user',
                  id: response.user.id,
                  attributes: { name: response.user.name },
                };
              } else if (response.ticket !== undefined) {
                contact = {
                  type: 'ticket',
                  id: response.ticket.id,
                  attributes: {
                    name:
                      response.ticket.subject !== null
                        ? response.ticket.subject
                        : response.ticket.description,
                  },
                };
              } else {
                console.error(
                  `Neither user nor ticket found in ${topic} response: ${response}`
                );
                break;
              }
            } else if (response.hookSubType === 'user')
              contact = {
                type: 'user',
                id: response.id,
                attributes: { name: response.name },
              };
            else if (response.hookSubType === 'ticket') {
              contact = {
                type: 'ticket',
                id: response.id,
                attributes: {
                  name:
                    response.subject !== null
                      ? response.subject
                      : response.description,
                },
              };
            } else {
              console.error(
                `Neither user nor ticket found in ${topic} response: ${response}`
              );
              break;
            }
            this.props.setAssignedContact(response.interactionId, contact);
            setTimeout(() => {
              this.props.dismissContactWasAssignedNotification(
                response.interactionId
              );
            }, 5000);
            this.props.loadCrmInteractionHistory(contact.type, contact.id);
            break;
          }
          case 'cxengage/zendesk/contact-unassignment-acknowledged':
          case 'cxengage/zendesk/related-to-unassignment-acknowledged': {
            this.props.unassignContact(response.interactionId);
            setTimeout(() => {
              this.props.dismissContactWasUnassignedNotification(
                response.interactionId
              );
            }, 5000);
            break;
          }
          case 'cxengage/zendesk/click-to-dial-requested': {
            const existingVoiceInteraction = this.props.agentDesktop.interactions.find(
              (interaction) => interaction.channelType === 'voice'
            );
            if (existingVoiceInteraction === undefined) {
              this.props.startOutboundInteraction({
                channelType: 'voice',
                customer: response.endpoint,
              });
              CxEngage.interactions.voice.dial({
                phoneNumber: response.endpoint,
              });
            } else {
              console.log(
                'Voice call already in progress. Ignoring click-to-dial-requested.'
              );
            }
            break;
          }
          case 'cxengage/zendesk/click-to-sms-requested': {
            const existingMatchingSmsInteraction = this.props.agentDesktop.interactions.find(
              (interaction) =>
                interaction.channelType === 'sms' &&
                interaction.customer === response.endpoint
            );
            if (existingMatchingSmsInteraction === undefined) {
              this.props.startOutboundInteraction({
                channelType: 'sms',
                customer: response.endpoint,
              });
            } else {
              console.log(
                `SMS interaction already in progress for ${response.endpoint}. Ignoring click-to-sms-requested.`
              );
            }
            break;
          }
          case 'cxengage/zendesk/click-to-email-requested': {
            const existingMatchingEmailInteraction = this.props.agentDesktop.interactions.find(
              (interaction) =>
                interaction.channelType === 'email' &&
                interaction.customer === response.endpoint
            );
            if (existingMatchingEmailInteraction === undefined) {
              this.props.startOutboundEmail(response.endpoint);
            } else {
              console.log(
                `Email interaction already in progress for ${response.endpoint}. Ignoring click-to-email-requested.`
              );
            }
            break;
          }
          case 'cxengage/zendesk/user-update':
          case 'cxengage/zendesk/ticket-update': {
            let type;
            if (topic === 'cxengage/zendesk/user-update') {
              type = 'user';
            } else {
              type = 'ticket';
            }
            this.props.updateContact(
              {
                id: response.id,
                attributes: {
                  name: response.name,
                },
              },
              type
            );
            break;
          }

          /**
           * TWILIO
           */
          case 'cxengage/twilio/twilio-initialization': {
            this.props.setOutputSelectionSupported(
              response.isOutputSelectionSupported
            );

            break;
          }
          case 'cxengage/twilio/output-devices-changed': {
            this.props.goUpdateAudioOutputUserPreferences(response);

            break;
          }
          case 'cxengage/twilio/active-output-devices-changed': {
            if (response.activeOutputRingtoneDevices) {
              this.props.updateActiveOutputRingtoneDevices(
                response.activeOutputRingtoneDevices
              );
            } else if (response.activeOutputSpeakerDevices) {
              this.props.updateActiveOutputSpeakerDevices(
                response.activeOutputSpeakerDevices
              );
            }

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
            const resourceCapacityStat = Object.values(response).find(
              (stat) =>
                stat.body !== undefined &&
                stat.body.results !== undefined &&
                stat.body.results.resourceCapacity !== undefined
            );
            if (resourceCapacityStat !== undefined) {
              this.props.setResourceCapactiy(
                resourceCapacityStat.body.results.resourceCapacity
              );
            }

            if (this.props.queues !== undefined) {
              const statsKeys = Object.keys(response);
              const queuesIds = this.props.queues.map((queue) => queue.id);
              const filteredQueuesTime = statsKeys
                .filter((key) => queuesIds.includes(key))
                .reduce(
                  (obj, key) => ({
                    ...obj,
                    [key]: response[key],
                  }),
                  {}
                );
              if (Object.keys(filteredQueuesTime).length > 0) {
                this.props.setQueuesTime(filteredQueuesTime);
              }
            }
            break;
          }

          // ENTITIES
          case 'cxengage/entities/get-users-response': {
            this.props.setUsers(response.result);
            break;
          }
          case 'cxengage/entities/get-entity-response': {
            // TODO: toast error
            break;
          }
          default: {
            topicUnhandled = true;
          }
        }
        if (!isIgnoreTopic) {
          if (isLogTopic || !topicUnhandled) {
            sdkResponseLog(
              '[AgentDesktop] CxEngage.subscribe()',
              topic,
              response
            );
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

  assignAndViewContacts = (searchResponse, interactionId, query, terms) => {
    if (terms === undefined) {
      if (searchResponse.results.length === 1) {
        // If single contact found, auto assign to interaction
        this.props.assignContact(interactionId, searchResponse.results[0]);
      }
    } else {
      const exactMatchesArray = [];
      terms.forEach((term) => {
        const trimmedTerm = term
          .toString()
          .toLowerCase()
          .trim();
        searchResponse.results.forEach((result) => {
          const attributeArray = Object.values(result.attributes);
          const uniqueAttribute = attributeArray.filter(
            (value, index) => attributeArray.indexOf(value) === index
          );
          uniqueAttribute.forEach((attribute) => {
            if (attribute.toLowerCase().trim() === trimmedTerm) {
              exactMatchesArray.push(result);
            }
          });
        });
      });
      if (exactMatchesArray.length === 1) {
        // If single contact found and one of the terms exactly equals one of the contact attributes, auto assign to interaction
        this.props.assignContact(interactionId, exactMatchesArray[0]);
      }
    }

    this.props.setInteractionQuery(interactionId, query);
  };

  attemptContactSearch = (query, interactionId, interaction, terms) => {
    CxEngage.contacts.search(
      createSearchQuery(query),
      (searchError, searchTopic, searchResponse) => {
        if (searchError) {
          this.props.setInteractionQuery(interactionId, query);
        } else {
          sdkResponseLog(
            '[AgentDesktop] CxEngage.subscribe()',
            searchTopic,
            searchResponse
          );

          if (interaction && interaction.contact) {
            this.props.setInteractionQuery(interactionId, query);
          } else {
            this.assignAndViewContacts(
              searchResponse,
              interactionId,
              query,
              terms
            );
          }
        }
      }
    );
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
    desktopSfLightning: {
      paddingBottom: '40px',
    },
    toolbarModeCollapsed: {
      height: `${DEFAULT_TOOLBAR_HEIGHT}px`,
      width: `${DEFAULT_TOOLBAR_WIDTH}px`,
    },
    toolbarModeExpanded: {
      height: `${DEFAULT_TOOLBAR_HEIGHT}px`,
      width: `${EXPANDED_TOOLBAR_WIDTH}px`,
    },
    notificationBanner: {
      flex: '1 0 content',
      alignSelf: 'flex-start',
    },
  };

  // display the popup confirmation for reauthorizing the user
  // in the event of a token expiration
  displayReauthPopup = () => {
    if (this.props.expirationPromptReauth.get('showConfirmationPopupGoReady')) {
      return (
        <ConfirmationPopupGoReady
          propertiesForLocalStorage={this.props.expirationPromptReauth.get(
            'propertiesForLocalStorage'
          )}
        />
      );
    } else if (this.props.loginPopup.get('showLoginPopup')) {
      return <LoginPopup />;
    }

    return null;
  };

  render() {
    crmCssAdapter(this.styles, ['desktop'], this.props.crmModule);

    const banners = [];
    const refreshBannerIsVisible = this.props.agentDesktop.refreshRequired;
    let errorDescriptionMessage;
    const errorInfo = this.props.criticalError || this.props.nonCriticalError;

    if (refreshBannerIsVisible) {
      banners.push(
        <NotificationBanner
          key={messages.newVersion.id}
          id="version-refresh-banner"
          descriptionMessage={messages.newVersion}
          descriptionStyle={{ textAlign: 'center' }}
          fullBannerAction={() => window.location.reload()}
          dismiss={this.hideRefreshBanner}
        />
      );
    }

    if (this.props.agentDirection.supervisorId) {
      const { supervisorName, direction } = this.props.agentDirection;

      banners.push(
        <NotificationBanner
          key={messages.directionChanged.id}
          id="agent-direction-changed-banner"
          style={{ backgroundColor: '#54DA90' }}
          descriptionStyle={{ textAlign: 'center' }}
          dismiss={this.props.dismissAgentDirection}
        >
          <FormattedMessage
            {...messages.directionChanged}
            values={{
              direction: (
                <strong>
                  {this.props.intl.formatMessage(
                    messages[kebabCaseToCamelCase(direction)]
                  )}
                </strong>
              ),
              name: supervisorName,
              icon: (
                <DirectionIconSVG
                  directionIconType="secondary"
                  directionMode={direction}
                  size={25}
                  fillColor="white"
                />
              ),
            }}
          />
        </NotificationBanner>
      );
    }

    if (this.props.selectedPresenceReason.supervisorId) {
      const {
        readyState,
        selectedPresenceReason: { reason, supervisorName },
      } = this.props;

      banners.push(
        <NotificationBanner
          key={messages.presenceStateChanged.id}
          id="agent-presence-state-changed-banner"
          style={readyState === 'ready' ? { backgroundColor: '#54DA90' } : {}}
          isError={readyState !== 'ready'}
          descriptionStyle={{ textAlign: 'center' }}
          dismiss={this.props.dismissAgentPresenceState}
        >
          <FormattedMessage
            {...messages.presenceStateChanged}
            values={{
              state: (
                <strong>
                  {this.props.intl.formatMessage(messages[readyState], {
                    reason,
                  })}
                </strong>
              ),
              name: supervisorName,
              icon: (
                <PresenceStateIconSVG
                  presenceStateIconType={readyState}
                  presenceStateMode={readyState}
                  size={25}
                />
              ),
            }}
          />
        </NotificationBanner>
      );
    }

    if (errorInfo) {
      errorDescriptionMessage = generateErrorMessage(
        errorInfo,
        this.props.intl.formatMessage
      );
      if (errorInfo.code === 'interactionFailed') {
        errorDescriptionMessage = errorDescriptionMessage.replace(
          'interactionFailed',
          '4003'
        );
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
    } else if (this.props.sessionEnded !== undefined) {
      banners.push(
        <NotificationBanner
          key={messages.sessionEnded.id}
          id="session-ended-error-banner"
          style={this.styles.notificationBanner}
          isError
          descriptionStyle={{ textAlign: 'center' }}
          rightLinkAction={this.logoutAndReload}
          rightLinkMessage={messages.reload}
        >
          <FormattedMessage
            {...errorMessages.sessionEnded}
            values={{
              title: (
                <strong>
                  {this.props.intl.formatMessage(messages.sessionEnded)}
                </strong>
              ),
              name: this.props.sessionEnded.supervisorName,
              icon: (
                <PresenceStateIconSVG
                  presenceStateIconType="offline"
                  presenceStateMode="offline"
                  size={25}
                />
              ),
            }}
          />
        </NotificationBanner>
      );
    } else if (!this.props.agentDesktop.isOnline) {
      banners.push(
        <NotificationBanner
          key={messages.offline.id}
          id="offline-banner"
          descriptionMessage={messages.offline}
          descriptionStyle={{
            textAlign: 'center',
          }}
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
      <div style={[this.styles.base, this.styles.desktop]}>
        {banners}
        {this.props.login.showLogin ||
        this.props.agentDesktop.presence === undefined ||
        // If error code is AD-100X, keep them in Login, or else AgentDesktop will break
        (this.props.criticalError &&
          this.props.criticalError.code &&
          this.props.criticalError.code.toString().includes('AD-100')) ||
        // CXV1-19771 We check that Salesforce SDK is dowloaded before user logs in.
        (this.props.crmModule.includes('salesforce-') &&
          !this.props.isCrmDownloaded) ? (
            <Login />
          ) : (
            <AgentDesktop />
          )}
        {this.displayReauthPopup()}
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  login: selectLoginMap(state, props).toJS(),
  agentDesktop: selectAgentDesktopMap(state, props).toJS(),
  locale: selectLocale()(state),
  availableStats: selectAvailableStats(state, props),
  criticalError: selectCriticalError(state, props),
  sessionEnded: selectSessionEnded(state, props),
  agentDirection: selectAgentDirection(state, props),
  readyState: selectReadyState(state, props),
  selectedPresenceReason: selectSelectedPresenceReason(state, props),
  activatedStatIds: selectActivatedStatIds(state, props).toJS(),
  erroredStatIds: selectErroredStatIds(state, props),
  nonCriticalError: selectNonCriticalError(state, props),
  hasCrmPermissions: selectHasCrmPermissions(state, props),
  crmModule: selectCrmModule(state, props),
  isCrmDownloaded: selectIsCrmDownloaded(state, props),
  loginPopup: selectAgentDesktopMap(state, props).get('loginPopup'),
  expirationPromptReauth: selectAgentDesktopMap(state, props).get(
    'expirationPromptReauth'
  ),
  audioNotificationsEnabled: selectAudioPreferences(state, props),
  visualNotificationsEnabled: selectVisualPreferences(state, props),
  isOutputSelectionSupported: selectOutputSelectionSupported(state, props),
  activeExtensionIsTwilio: selectActiveExtensionIsTwilio(state, props),
  activeNotificationDeviceId: getActiveOutputNotificationDevice(state, props),
  queues: selectQueues(state, props),
  selectedInteractionId: getSelectedInteractionId(state, props),
  hasInteractions: selectHasInteractions(state, props),
});

function mapDispatchToProps(dispatch) {
  return {
    openNewInteractionPanel: (
      isSidePanelCollapsed,
      optionalInput,
      popUri,
      objectName
    ) =>
      dispatch(
        openNewInteractionPanel(
          isSidePanelCollapsed,
          optionalInput,
          popUri,
          objectName
        )
      ),
    showRefreshRequired: (show) => dispatch(showRefreshRequired(show)),
    showLogin: (show) => dispatch(showLogin(show)),
    setUserConfig: (response) => dispatch(setUserConfig(response)),
    setAgentDirection: (response) => dispatch(setAgentDirection(response)),
    setExtensions: (response) => dispatch(setExtensions(response)),
    updateWrapupDetails: (interactionId, wrapupDetails) =>
      dispatch(updateWrapupDetails(interactionId, wrapupDetails)),
    addScript: (interactionId, script, scriptId) =>
      dispatch(addScript(interactionId, script, scriptId)),
    removeScript: (interactionId) => dispatch(removeScript(interactionId)),
    sendScript: (interactionId, script, dismissed, exitReason) =>
      dispatch(sendScript(interactionId, script, dismissed, exitReason)),
    sendTimeoutScript: (script, interactionId, scriptId, exitReason) =>
      dispatch(sendTimeoutScript(script, interactionId, scriptId, exitReason)),
    setPresence: (response) => dispatch(setPresence(response)),
    setInteractionStatus: (interactionId, newStatus, response) =>
      dispatch(setInteractionStatus(interactionId, newStatus, response)),
    workAccepted: (interactionId, response) =>
      dispatch(workAccepted(interactionId, response)),
    addInteraction: (interaction) => dispatch(addInteraction(interaction)),
    workInitiated: (response) => dispatch(workInitiated(response)),
    removeInteraction: (interactionId) =>
      dispatch(removeInteraction(interactionId)),
    setSmoochMessageHistory: (response) =>
      dispatch(setSmoochMessageHistory(response)),
    addSmoochMessage: (interactionId, message) =>
      dispatch(addSmoochMessage(interactionId, message)),
    setCustomerRead: (interactionId, read) =>
      dispatch(setCustomerRead(interactionId, read)),
    setCustomerTyping: (interactionId, typing) =>
      dispatch(setCustomerTyping(interactionId, typing)),
    setMessageHistory: (response) => dispatch(setMessageHistory(response)),
    updateMessageHistoryAgentName: (interactionId, response) =>
      dispatch(updateMessageHistoryAgentName(interactionId, response)),
    assignContact: (interactionId, contact) =>
      dispatch(assignContact(interactionId, contact)),
    setAssignedContact: (interactionId, contact) =>
      dispatch(setAssignedContact(interactionId, contact)),
    unassignContact: (interactionId) =>
      dispatch(unassignContact(interactionId)),
    dismissContactWasAssignedNotification: (interactionId) =>
      dispatch(dismissContactWasAssignedNotification(interactionId)),
    dismissContactWasUnassignedNotification: (interactionId) =>
      dispatch(dismissContactWasUnassignedNotification(interactionId)),
    setContactHistoryInteractionDetails: (response) =>
      dispatch(setContactHistoryInteractionDetails(response)),
    updateContact: (updatedContact, contactType) =>
      dispatch(updateContact(updatedContact, contactType)),
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
    updateCallControls: (interactionId, callControls) =>
      dispatch(updateCallControls(interactionId, callControls)),
    muteCall: (interactionId) => dispatch(muteCall(interactionId)),
    unmuteCall: (interactionId) => dispatch(unmuteCall(interactionId)),
    holdCall: (interactionId) => dispatch(holdCall(interactionId)),
    resumeCall: (interactionId) => dispatch(resumeCall(interactionId)),
    recordCall: (interactionId) => dispatch(recordCall(interactionId)),
    stopRecordCall: (interactionId) => dispatch(stopRecordCall(interactionId)),
    transferCancelled: (interactionId) =>
      dispatch(transferCancelled(interactionId)),
    resourceAdded: (response) => dispatch(resourceAdded(response)),
    updateResourceName: (interactionId, activeResourceId, activeResourceName) =>
      dispatch(
        updateResourceName(interactionId, activeResourceId, activeResourceName)
      ),
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
    emailCanSendReply: (interactionId) =>
      dispatch(emailCanSendReply(interactionId)),
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
    toggleAgentMenu: (show) => dispatch(toggleAgentMenu(show)),
    goNotReady: (reason, listId) => dispatch(goNotReady(reason, listId)),
    validateContactLayoutTranslations: () =>
      dispatch(validateContactLayoutTranslations()),
    setLoading: (loading) => dispatch(setLoading(loading)),
    handleSDKError: (error, topic) => dispatch(handleSDKError(error, topic)),
    setCriticalError: (error) => dispatch(setCriticalError(error)),
    setNonCriticalError: (error) => dispatch(setNonCriticalError(error)),
    setSessionEndedBySupervisor: (response, error) =>
      dispatch(setSessionEndedBySupervisor(response, error)),
    setCRMUnavailable: (reason) => dispatch(setCRMUnavailable(reason)),
    addStatErrorId: (statId) => dispatch(addStatErrorId(statId)),
    removeStatErrorId: (statId) => dispatch(removeStatErrorId(statId)),
    dismissError: () => dispatch(dismissError()),
    dismissAgentDirection: () => dispatch(dismissAgentDirection()),
    dismissAgentPresenceState: () => dispatch(dismissAgentPresenceState()),
    setCrmModule: (crmModule) => dispatch(setCrmModule(crmModule)),
    crmDownloadComplete: () => dispatch(crmDownloadComplete()),
    setStandalonePopup: () => dispatch(setStandalonePopup()),
    setCrmActiveTab: (type, id, name) =>
      dispatch(setCrmActiveTab(type, id, name)),
    startOutboundInteraction: (outboundInteractionData) =>
      dispatch(startOutboundInteraction(outboundInteractionData)),
    startOutboundEmail: (customer, contact, addedByNewInteractionPanel) =>
      dispatch(
        startOutboundEmail(customer, contact, addedByNewInteractionPanel)
      ),
    loadCrmInteractionHistory: (subType, id, page) =>
      dispatch(loadCrmInteractionHistory(subType, id, page)),
    setResourceCapactiy: (resourceCapacity) =>
      dispatch(setResourceCapactiy(resourceCapacity)),
    setUsers: (users) => dispatch(setUsers(users)),
    setTransferListsFromFlow: (interactionId, transferListsFromFlow) =>
      dispatch(setTransferListsFromFlow(interactionId, transferListsFromFlow)),
    setQueuesTime: (queueData) => dispatch(setQueuesTime(queueData)),
    toggleIsOnline: (isOnline) => dispatch(toggleIsOnline(isOnline)),
    customerConnected: (interactionId) =>
      dispatch(customerConnected(interactionId)),
    setTranferringInConference: (interactionId, isColdTransferring) =>
      dispatch(setTranferringInConference(interactionId, isColdTransferring)),
    setContactMode: (interactionId, newMode) =>
      dispatch(setContactMode(interactionId, newMode)),
    removeContact: (contactId) => dispatch(removeContact(contactId)),
    toggleQueue: (queue) =>
      dispatch(toggleSelectedQueueTransferMenuPreference(queue)),
    toggleInteractionNotification: (interactionId, notification) =>
      dispatch(toggleInteractionNotification(interactionId, notification)),
    updateActiveOutputRingtoneDevices: (activeOutputRingtoneDevices) =>
      dispatch(updateActiveOutputRingtoneDevices(activeOutputRingtoneDevices)),
    updateActiveOutputSpeakerDevices: (activeOutputSpeakerDevices) =>
      dispatch(updateActiveOutputSpeakerDevices(activeOutputSpeakerDevices)),
    setOutputSelectionSupported: (isOutputSelectionSupported) =>
      dispatch(setOutputSelectionSupported(isOutputSelectionSupported)),
    goUpdateAudioOutputUserPreferences: (preferences) =>
      dispatch(goUpdateAudioOutputUserPreferences(preferences)),
    dispatch,
  };
}

App.propTypes = {
  intl: intlShape.isRequired,
  locale: PropTypes.string,
  showLogin: PropTypes.func.isRequired,
  setUserConfig: PropTypes.func.isRequired,
  setAgentDirection: PropTypes.any,
  setExtensions: PropTypes.func.isRequired,
  sendScript: PropTypes.func.isRequired,
  sendTimeoutScript: PropTypes.func,
  setPresence: PropTypes.func.isRequired,
  setInteractionStatus: PropTypes.func.isRequired,
  workAccepted: PropTypes.func.isRequired,
  updateWrapupDetails: PropTypes.func.isRequired,
  addScript: PropTypes.func.isRequired,
  removeScript: PropTypes.func.isRequired,
  addInteraction: PropTypes.func.isRequired,
  workInitiated: PropTypes.func.isRequired,
  removeInteraction: PropTypes.func.isRequired,
  setSmoochMessageHistory: PropTypes.func.isRequired,
  addSmoochMessage: PropTypes.func.isRequired,
  setCustomerTyping: PropTypes.func.isRequired,
  setCustomerRead: PropTypes.func.isRequired,
  setMessageHistory: PropTypes.func.isRequired,
  updateMessageHistoryAgentName: PropTypes.func.isRequired,
  assignContact: PropTypes.func.isRequired,
  setAssignedContact: PropTypes.func.isRequired,
  crmDownloadComplete: PropTypes.func.isRequired,
  unassignContact: PropTypes.func.isRequired,
  dismissContactWasAssignedNotification: PropTypes.func.isRequired,
  dismissContactWasUnassignedNotification: PropTypes.func.isRequired,
  setContactHistoryInteractionDetails: PropTypes.func.isRequired,
  updateContact: PropTypes.func.isRequired,
  addMessage: PropTypes.func.isRequired,
  isCrmDownloaded: PropTypes.bool,
  selectInteraction: PropTypes.func.isRequired,
  setContactLayout: PropTypes.func.isRequired,
  setContactAttributes: PropTypes.func.isRequired,
  setInteractionQuery: PropTypes.func.isRequired,
  setCustomFields: PropTypes.func.isRequired,
  setEmailPlainBody: PropTypes.func.isRequired,
  setEmailHtmlBody: PropTypes.func.isRequired,
  setEmailDetails: PropTypes.func.isRequired,
  setEmailAttachmentUrl: PropTypes.func.isRequired,
  updateCallControls: PropTypes.func.isRequired,
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
  emailCanSendReply: PropTypes.func.isRequired,
  emailAddAttachment: PropTypes.func.isRequired,
  setAvailableStats: PropTypes.func.isRequired,
  statsReceived: PropTypes.func.isRequired,
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
  setLoading: PropTypes.func,
  handleSDKError: PropTypes.func.isRequired,
  setCriticalError: PropTypes.func.isRequired,
  setNonCriticalError: PropTypes.func.isRequired,
  setSessionEndedBySupervisor: PropTypes.func,
  setCRMUnavailable: PropTypes.func.isRequired,
  addStatErrorId: PropTypes.func.isRequired,
  removeStatErrorId: PropTypes.func.isRequired,
  login: PropTypes.object,
  agentDesktop: PropTypes.object,
  availableStats: PropTypes.object,
  activatedStatIds: PropTypes.array,
  erroredStatIds: PropTypes.array,
  criticalError: PropTypes.any,
  sessionEnded: PropTypes.any,
  nonCriticalError: PropTypes.any,
  agentDirection: PropTypes.object,
  readyState: PropTypes.string,
  hasInteractions: PropTypes.bool,
  selectedPresenceReason: PropTypes.object,
  hasCrmPermissions: PropTypes.bool,
  dismissError: PropTypes.func,
  dismissAgentDirection: PropTypes.func,
  dismissAgentPresenceState: PropTypes.func,
  setCrmModule: PropTypes.func.isRequired,
  crmModule: PropTypes.string,
  setStandalonePopup: PropTypes.func.isRequired,
  setCrmActiveTab: PropTypes.func.isRequired,
  startOutboundInteraction: PropTypes.func.isRequired,
  startOutboundEmail: PropTypes.func.isRequired,
  loadCrmInteractionHistory: PropTypes.func.isRequired,
  openNewInteractionPanel: PropTypes.func.isRequired,
  loginPopup: PropTypes.object,
  expirationPromptReauth: PropTypes.object,
  audioNotificationsEnabled: PropTypes.bool,
  visualNotificationsEnabled: PropTypes.bool,
  isOutputSelectionSupported: PropTypes.bool,
  activeExtensionIsTwilio: PropTypes.bool,
  activeNotificationDeviceId: PropTypes.string,
  setResourceCapactiy: PropTypes.func.isRequired,
  setUsers: PropTypes.func.isRequired,
  setTransferListsFromFlow: PropTypes.func.isRequired,
  queues: PropTypes.array,
  setQueuesTime: PropTypes.func.isRequired,
  toggleIsOnline: PropTypes.func.isRequired,
  customerConnected: PropTypes.func.isRequired,
  setTranferringInConference: PropTypes.func.isRequired,
  selectedInteractionId: PropTypes.string,
  setContactMode: PropTypes.func.isRequired,
  removeContact: PropTypes.func.isRequired,
  toggleInteractionNotification: PropTypes.func.isRequired,
  updateActiveOutputRingtoneDevices: PropTypes.func.isRequired,
  updateActiveOutputSpeakerDevices: PropTypes.func.isRequired,
  setOutputSelectionSupported: PropTypes.func.isRequired,
  goUpdateAudioOutputUserPreferences: PropTypes.func.isRequired,
};

App.contextTypes = {
  toolbarMode: PropTypes.bool,
};

export default injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(hot(module)(Radium(App)))
);
