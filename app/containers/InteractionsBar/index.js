/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * InteractionsBar
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import Radium from 'radium';
import has from 'lodash/has';

import { lastMessageFromInteraction } from 'utils/interaction';

import ErrorBoundary from 'components/ErrorBoundary';

import {
  openNewInteractionPanel,
  setInteractionStatus,
  showSidePanel,
  selectSidePanelTab,
  selectInteraction,
  hideInteractionsBar,
} from 'containers/AgentDesktop/actions';
import {
  selectCrmModule,
  selectIsAgentReady,
  selectIsInteractionsBarCollapsed,
} from 'containers/AgentDesktop/selectors';

import { selectActiveExtension } from 'containers/AgentStatusMenu/selectors';

import Icon from 'components/Icon';
import CurrentCrmItemHistoryButton from 'containers/InteractionsBar/CurrentCrmItemHistoryButton';
import Interaction from 'containers/Interaction';

import {
  selectPendingInteractions,
  selectActiveVoiceInteraction,
  selectActiveNonVoiceInteractions,
  getSelectedInteractionId,
  selectNewInteractionPanel,
  selectHasOnlyOneInteraction,
  selectShowCurrentCrmItemHistoryButton,
} from './selectors';
import messages from './messages';

export class InteractionsBar extends React.Component {
  constructor(props, context) {
    super(props);
    this.state = {
      showTopScrollShadow: false,
      showBottomScrollShadow: false,
      showPendingInteractionOverflow: false,
      showUnrespondedMessageBelowOverflow: false,
    };
    this.interactionHeight = context.toolbarMode ? 89 : 108;
    this.unrespondedInteractionScrollNotificationThreshold = 40;
    this.pendingInteractionScrollNotificationThreshold = context.toolbarMode
      ? 20
      : 40;
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateScrollItems);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateScrollItems);
  }

  componentDidUpdate() {
    this.updateScrollItems();
  }

  styles = {
    base: {
      backgroundColor: '#072931',
      color: '#FFFFFF',
      width: '100%',
      fontSize: '14px',
      lineHeight: '14px',
      boxShadow: 'inset 0 0 6px 1px rgba(0,0,0,0.3)',
      display: 'flex',
      flexDirection: 'column',
    },
  };

  focusInteraction = (interaction) => {
    if (
      this.props.crmModule === 'zendesk' &&
      interaction.contact &&
      interaction.contact.id
    ) {
      CxEngage.zendesk.focusInteraction({
        interactionId: interaction.interactionId,
      });
    } else if (
      this.props.crmModule === 'salesforce-classic' &&
      interaction.contact &&
      interaction.contact.id
    ) {
      CxEngage.salesforceClassic.focusInteraction({
        interactionId: interaction.interactionId,
      });
    } else if (
      this.props.crmModule === 'salesforce-lightning' &&
      interaction.contact &&
      interaction.contact.id
    ) {
      CxEngage.salesforceLightning.focusInteraction({
        interactionId: interaction.interactionId,
      });
    }
  };

  acceptInteraction = (interactionId) => {
    if (this.context.toolbarMode && this.props.selectHasOnlyOneInteraction) {
      this.props.hideInteractionsBar();
    }
    const interaction = this.props.pendingInteractions.find(
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

  openNewInteractionPanel = () => {
    this.props.openNewInteractionPanel(this.context.toolbarMode);
  };

  updateScrollItems = () => {
    const scrollableHeight = this.interactionsScrollContainer.scrollHeight;
    const viewableHeight = this.interactionsScrollContainer.clientHeight;
    const scrollTopPosition = this.interactionsScrollContainer.scrollTop;

    let showTopScrollShadow = false;
    let showBottomScrollShadow = false;
    let showUnrespondedMessageAboveOverflow = false;
    let showPendingInteractionOverflow = false;
    let showUnrespondedMessageBelowOverflow = false;

    // If there are enough interactions to make it scrollable
    if (scrollableHeight > viewableHeight) {
      // If not at the top of the container
      if (scrollTopPosition > 0) {
        showTopScrollShadow = true;
        // If there is an unresponsed message above scroll view
        if (this.hasUnrespondedMessagesAboveScrollView()) {
          showUnrespondedMessageAboveOverflow = true;
        }
      }
      // If not at the bottom of the container
      if (scrollTopPosition + viewableHeight < scrollableHeight) {
        showBottomScrollShadow = true;
        // If there is a pending interaction below scroll view
        if (
          this.props.pendingInteractions.length > 0 &&
          scrollableHeight - (scrollTopPosition + viewableHeight) >
            this.interactionHeight -
              this.pendingInteractionScrollNotificationThreshold
        ) {
          showPendingInteractionOverflow = true;
          // If there is an unresponded message below scroll view
        } else if (this.hasUnrespondedMessagesBelowScrollView()) {
          showUnrespondedMessageBelowOverflow = true;
        }
      }
    }

    // Update if there have been changes
    if (
      showTopScrollShadow !== this.state.showTopScrollShadow ||
      showBottomScrollShadow !== this.state.showBottomScrollShadow ||
      showUnrespondedMessageAboveOverflow !==
        this.state.showUnrespondedMessageAboveOverflow ||
      showPendingInteractionOverflow !==
        this.state.showPendingInteractionOverflow ||
      showUnrespondedMessageBelowOverflow !==
        this.state.showUnrespondedMessageBelowOverflow
    ) {
      this.setState({
        showTopScrollShadow,
        showBottomScrollShadow,
        showUnrespondedMessageAboveOverflow,
        showPendingInteractionOverflow,
        showUnrespondedMessageBelowOverflow,
      });
    }
  };

  hasUnrespondedMessagesAboveScrollView = () => {
    let firstUnrespondedMessagePosition;
    for (let i = 0; i < this.props.activeNonVoiceInteractions.length; i += 1) {
      const lastMessageFromThisInteraction = lastMessageFromInteraction(
        this.props.activeNonVoiceInteractions[i]
      );
      if (
        lastMessageFromThisInteraction &&
        (lastMessageFromThisInteraction.type === 'customer' ||
          lastMessageFromThisInteraction.type === 'message')
      ) {
        firstUnrespondedMessagePosition = i;
        break;
      }
    }
    return (
      firstUnrespondedMessagePosition !== undefined &&
      firstUnrespondedMessagePosition * this.interactionHeight +
        this.unrespondedInteractionScrollNotificationThreshold <
        this.interactionsScrollContainer.scrollTop
    );
  };

  hasUnrespondedMessagesBelowScrollView = () => {
    let lastUnrespondedMessagePosition;
    for (
      let i = this.props.activeNonVoiceInteractions.length - 1;
      i >= 0;
      i -= 1
    ) {
      const lastMessageFromThisInteraction = lastMessageFromInteraction(
        this.props.activeNonVoiceInteractions[i]
      );
      if (
        lastMessageFromThisInteraction &&
        (lastMessageFromThisInteraction.type === 'customer' ||
          lastMessageFromThisInteraction.type === 'message')
      ) {
        lastUnrespondedMessagePosition = i;
        break;
      }
    }
    return (
      lastUnrespondedMessagePosition !== undefined &&
      lastUnrespondedMessagePosition * this.interactionHeight +
        this.unrespondedInteractionScrollNotificationThreshold >
        this.interactionsScrollContainer.clientHeight +
          this.interactionsScrollContainer.scrollTop
    );
  };

  scrollToTop = () => {
    this.interactionsScrollContainer.scrollTop = 0;
  };

  scrollToBottom = () => {
    this.interactionsScrollContainer.scrollTop = this.interactionsScrollContainer.scrollHeight;
  };

  render() {
    let activeVoiceInteractionStatus;
    if (this.props.activeVoiceInteraction) {
      if (this.props.activeVoiceInteraction.status === 'wrapup') {
        activeVoiceInteractionStatus = 'wrapup';
      } else if (
        this.props.activeVoiceInteraction.status === 'work-ended-pending-script'
      ) {
        activeVoiceInteractionStatus = 'work-ended-pending-script';
      } else {
        activeVoiceInteractionStatus = 'active';
      }
    }

    const activeVoiceInteraction = this.props.activeVoiceInteraction ? (
      <Interaction
        interaction={this.props.activeVoiceInteraction}
        from={
          has(this.props.activeVoiceInteraction, 'contact.attributes.name')
            ? this.props.activeVoiceInteraction.contact.attributes.name
            : this.props.activeVoiceInteraction.number
        }
        previewText={
          has(this.props.activeVoiceInteraction, 'contact.id')
            ? this.props.activeVoiceInteraction.number
            : undefined
        }
        status={activeVoiceInteractionStatus}
        targetWrapupTime={Number(
          this.props.activeVoiceInteraction.wrapupDetails.targetWrapupTime
        )}
        wrapupTime={Number(
          this.props.activeVoiceInteraction.wrapupDetails.wrapupTime
        )}
        selected={
          this.props.selectedInteractionId ===
          this.props.activeVoiceInteraction.interactionId
        }
        onClick={() => {
          if (
            this.props.selectedInteractionId !==
            this.props.activeVoiceInteraction.interactionId
          ) {
            this.props.selectInteraction(
              this.props.activeVoiceInteraction.interactionId
            );
          }
          this.focusInteraction(this.props.activeVoiceInteraction);
        }}
      />
    ) : (
      ''
    );

    const activeNonVoiceInteractions = this.props.activeNonVoiceInteractions.map(
      (activeInteraction) => {
        let from;
        let text;
        if (
          activeInteraction.channelType === 'messaging' ||
          activeInteraction.channelType === 'sms'
        ) {
          from = activeInteraction.customer
            ? activeInteraction.customer
            : activeInteraction.messageHistory &&
              activeInteraction.messageHistory[0] &&
              activeInteraction.messageHistory[0].from;

          const lastMessageFromThisInteraction = lastMessageFromInteraction(
            activeInteraction
          );
          if (lastMessageFromThisInteraction) {
            ({ text } = lastMessageFromThisInteraction);
          } else {
            text = this.props.intl.formatMessage(messages.retrievingMessages);
          }
        } else if (activeInteraction.channelType === 'email') {
          from = activeInteraction.emailDetails
            ? activeInteraction.emailDetails.from[0].name
            : activeInteraction.customer;
          text = activeInteraction.emailDetails
            ? activeInteraction.emailDetails.subject
            : '';
        } else if (activeInteraction.channelType === 'work-item') {
          from = activeInteraction.subject;
        }

        // Set from to the contact name if available
        if (
          activeInteraction.contact !== undefined &&
          activeInteraction.contact.attributes !== undefined
        ) {
          from = activeInteraction.contact.attributes.name;
        }

        let status;
        if (activeInteraction.isScriptOnly) {
          status = 'script-only';
        } else if (
          activeInteraction.status === 'wrapup' ||
          activeInteraction.status === 'work-ended-pending-script'
        ) {
          ({ status } = activeInteraction);
        } else {
          status = 'active';
        }

        return (
          <Interaction
            from={from}
            interaction={activeInteraction}
            key={
              activeInteraction.interactionId
                ? activeInteraction.interactionId
                : activeInteraction.customer
            }
            previewText={text}
            status={status}
            targetWrapupTime={
              activeInteraction.wrapupDetails
                ? Number(activeInteraction.wrapupDetails.targetWrapupTime)
                : undefined
            }
            wrapupTime={
              activeInteraction.wrapupDetails
                ? Number(activeInteraction.wrapupDetails.wrapupTime)
                : undefined
            }
            selected={
              this.props.selectedInteractionId ===
              activeInteraction.interactionId
            }
            onClick={() => {
              if (
                this.props.selectedInteractionId !==
                activeInteraction.interactionId
              ) {
                this.props.selectInteraction(activeInteraction.interactionId);
              }
              this.focusInteraction(activeInteraction);
            }}
          />
        );
      }
    );

    const newInteraction = this.props.newInteractionPanel.visible && (
      <Interaction
        interaction={{ id: this.props.newInteractionPanel.interactionId }}
        status={this.props.newInteractionPanel.status}
        selected={
          this.props.selectedInteractionId ===
          this.props.newInteractionPanel.interactionId
        }
        onClick={
          this.props.selectedInteractionId !==
          this.props.newInteractionPanel.interactionId
            ? () =>
              this.props.selectInteraction(
                this.props.newInteractionPanel.interactionId
              )
            : undefined
        }
      />
    );

    const pendingInteractions = this.props.pendingInteractions.map(
      (pendingInteraction) => {
        let from;
        let text;
        let contactPoint;
        if (pendingInteraction.channelType === 'email' || pendingInteraction.source === 'smooch') {
          from = pendingInteraction.customer;
        } else if (
          pendingInteraction.channelType === 'messaging' ||
          pendingInteraction.channelType === 'sms'
        ) {
          from =
            pendingInteraction.messageHistory &&
            pendingInteraction.messageHistory.length > 0
              ? pendingInteraction.messageHistory[0].from
              : '';
          text =
            pendingInteraction.messageHistory &&
            pendingInteraction.messageHistory.length > 0
              ? pendingInteraction.messageHistory[0].text
              : this.props.intl.formatMessage(messages.retrievingMessages);
        } else if (pendingInteraction.channelType === 'voice') {
          from = pendingInteraction.number;
        } else if (pendingInteraction.channelType === 'work-item') {
          from = pendingInteraction.subject;
        }
        // Set from to the contact name if available
        if (
          pendingInteraction.contact !== undefined &&
          pendingInteraction.contact.attributes !== undefined
        ) {
          // we still want to hold on to the phone number or email address
          // to show in the hover state for toolbar, so we'll pass it as contactPoint
          contactPoint = from;
          from = pendingInteraction.contact.attributes.name;
        }

        return (
          <Interaction
            from={from}
            interaction={pendingInteraction}
            contactPoint={contactPoint || from}
            key={pendingInteraction.interactionId}
            previewText={text}
            status="pending"
            onClick={() =>
              this.acceptInteraction(pendingInteraction.interactionId)
            }
            interactionDirection={pendingInteraction.direction}
          />
        );
      }
    );

    return (
      <div style={[this.styles.base, this.props.style]}>
        <div style={{ flexShrink: 0 }}>
          {activeVoiceInteraction}
        </div>
        {this.state.showTopScrollShadow && (
          <div
            id="topScrollShadow"
            style={{
              paddingBottom: '20px',
              marginBottom: '-20px',
              background:
                'linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)',
            }}
          />
        )}
        {this.state.showUnrespondedMessageAboveOverflow && (
          <div
            id="unrespondedMessageAboveOverflow"
            style={{
              padding: '5px 0 8px',
              margin: '0 10px -23px 8px',
              borderRadius: '0 0 5px 5px',
              backgroundColor: '#14778D',
              zIndex: 2,
              cursor: 'pointer',
            }}
            title={this.props.intl.formatMessage(messages.unrespondedMessage)}
            onClick={this.scrollToTop}
          >
            <Icon
              name="caret_white"
              style={{
                display: 'block',
                margin: '0 auto',
                transform: 'rotate(180deg)',
              }}
            />
          </div>
        )}
        <div
          ref={(interactionsScrollContainer) => {
            this.interactionsScrollContainer = interactionsScrollContainer;
          }}
          style={{
            overflowY: 'auto',
            flexGrow: '1',
            paddingRight: '320px',
            marginRight: '-320px',
            display: 'flex',
            flexDirection: 'column',
          }}
          onScroll={this.updateScrollItems}
        >
          {activeNonVoiceInteractions}
          {newInteraction}
          <div style={{ flexGrow: 1 }} />
          {pendingInteractions}
        </div>
        {this.state.showPendingInteractionOverflow && (
          <div
            id="pendingInteractionOverflow"
            style={{
              padding: '8px 0 5px',
              margin: '-23px 10px 0 8px',
              borderRadius: '5px 5px 0 0',
              backgroundColor: '#23CEF5',
              zIndex: 2,
              cursor: 'pointer',
            }}
            title={this.props.intl.formatMessage(messages.pendingInteraction)}
            onClick={this.scrollToBottom}
          >
            <Icon
              name="caret_white"
              style={{ display: 'block', margin: '0 auto' }}
            />
          </div>
        )}
        {this.state.showUnrespondedMessageBelowOverflow && (
          <div
            id="unrespondedMessageBelowOverflow"
            style={{
              padding: '8px 0 5px',
              margin: '-23px 10px 0 8px',
              borderRadius: '5px 5px 0 0',
              backgroundColor: '#14778D',
              zIndex: 2,
              cursor: 'pointer',
            }}
            title={this.props.intl.formatMessage(messages.unrespondedMessage)}
            onClick={this.scrollToBottom}
          >
            <Icon
              name="caret_white"
              style={{ display: 'block', margin: '0 auto' }}
            />
          </div>
        )}
        {this.state.showBottomScrollShadow && (
          <div
            id="bottomScrollShadow"
            style={{
              paddingTop: '20px',
              marginTop: '-20px',
              background:
                'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)',
              zIndex: 1,
            }}
          />
        )}
        {this.props.isAgentReady &&
          !this.props.newInteractionPanel.visible &&
          (!this.context.toolbarMode ||
            !this.props.isInteractionsBarCollapsed) && (
          <div
            style={{
              padding: '11px',
              flexShrink: 0,
            }}
          >
            <Icon
              id="newInteraction"
              name="add_interaction"
              alt={this.props.intl.formatMessage(messages.newInteraction)}
              onclick={this.openNewInteractionPanel}
              style={{
                display: 'block',
                margin: '0 auto',
                position: 'relative',
                zIndex: '0',
              }}
            />
          </div>
        )}
        {this.props.showCurrentCrmItemHistoryButton && (
          <CurrentCrmItemHistoryButton />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  crmModule: selectCrmModule(state, props),
  isAgentReady: selectIsAgentReady(state, props),
  pendingInteractions: selectPendingInteractions(state, props),
  activeVoiceInteraction: selectActiveVoiceInteraction(state, props),
  activeNonVoiceInteractions: selectActiveNonVoiceInteractions(state, props),
  selectedInteractionId: getSelectedInteractionId(state, props),
  newInteractionPanel: selectNewInteractionPanel(state, props),
  activeExtension: selectActiveExtension(state, props),
  isInteractionsBarCollapsed: selectIsInteractionsBarCollapsed(state, props),
  selectHasOnlyOneInteraction: selectHasOnlyOneInteraction(state, props),
  showCurrentCrmItemHistoryButton: selectShowCurrentCrmItemHistoryButton(
    state,
    props
  ),
});

function mapDispatchToProps(dispatch) {
  return {
    openNewInteractionPanel: (isSidePanelCollapsed) =>
      dispatch(openNewInteractionPanel(isSidePanelCollapsed)),
    setInteractionStatus: (interactionId, newStatus, response) =>
      dispatch(setInteractionStatus(interactionId, newStatus, response)),
    selectSidePanelTab: (interactionId, tabName) =>
      dispatch(selectSidePanelTab(interactionId, tabName)),
    selectInteraction: (interactionId) =>
      dispatch(selectInteraction(interactionId)),
    showSidePanel: (interactionId) => dispatch(showSidePanel(interactionId)),
    hideInteractionsBar: () => dispatch(hideInteractionsBar()),
    dispatch,
  };
}

InteractionsBar.propTypes = {
  intl: intlShape.isRequired,
  style: PropTypes.object,
  crmModule: PropTypes.string,
  isAgentReady: PropTypes.bool.isRequired,
  pendingInteractions: PropTypes.array.isRequired,
  activeNonVoiceInteractions: PropTypes.array.isRequired,
  activeVoiceInteraction: PropTypes.object,
  selectInteraction: PropTypes.func.isRequired,
  selectSidePanelTab: PropTypes.func.isRequired,
  selectedInteractionId: PropTypes.string,
  setInteractionStatus: PropTypes.func.isRequired,
  showSidePanel: PropTypes.func.isRequired,
  newInteractionPanel: PropTypes.object.isRequired,
  openNewInteractionPanel: PropTypes.func.isRequired,
  isInteractionsBarCollapsed: PropTypes.bool.isRequired,
  hideInteractionsBar: PropTypes.func.isRequired,
  selectHasOnlyOneInteraction: PropTypes.bool.isRequired,
  showCurrentCrmItemHistoryButton: PropTypes.bool.isRequired,
};

InteractionsBar.contextTypes = {
  toolbarMode: PropTypes.bool,
};

export default ErrorBoundary(
  injectIntl(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(Radium(InteractionsBar))
  )
);
