/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * ContactView
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Radium from 'radium';
import { injectIntl, intlShape } from 'react-intl';

import ErrorBoundary from 'components/ErrorBoundary';

import {
  startOutboundInteraction,
  loadContactInteractionHistory,
  assignContact,
} from 'containers/AgentDesktop/actions';
import {
  selectIsAgentReady,
  selectHasVoiceInteraction,
  selectSmsInteractionNumbers,
  getSelectedInteraction,
} from 'containers/AgentDesktop/selectors';
import {
  selectLoading,
  selectCurrentInteractionContactId,
  selectCurrentInteraction,
} from 'containers/InfoTab/selectors';
import { getSelectedInteractionIsCreatingNewInteraction } from 'containers/ContactsControl/selectors';
import { editContact } from 'containers/ContactsControl/actions';
import { startOutboundEmail } from 'containers/EmailContentArea/actions';

import Button from 'components/Button';
import ContactAttribute from 'components/ContactAttribute';
import ContactSectionHeader from 'components/ContactSectionHeader';

import {
  getSelectedOutboundEmailIdentifier,
  getSelectedOutboundPhoneIdentifier,
} from 'containers/OutboundAniSelect/selectors';
import {
  selectPopulatedLayout,
  selectPopulatedCompactAttributes,
} from './selectors';

import messages from './messages';

const styles = {
  base: {
    display: 'flex',
    flexDirection: 'column',
    color: '#4B4B4B',
    fontSize: '14px',
    lineHeight: '20px',
    paddingLeft: '52px',
  },
  header: {
    borderBottom: '1px solid #E4E4E4',
    paddingBottom: '12px',
    marginBottom: '12px',
    flexShrink: '1',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: '16px',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  buttonGroup: {
    display: 'flex',
    flexShrink: 0,
  },
  controlButton: {
    marginLeft: '10px',
  },
};

export class ContactView extends React.Component {
  editContact = () => {
    if (
      this.props.currentInteractionContactId &&
      this.props.currentInteractionContactId === this.props.contact.id
    ) {
      this.props.editContact(
        this.props.currentInteraction.interactionId,
        this.props.currentInteraction.contact
      );
    } else {
      this.props.editContact(
        this.props.currentInteraction.interactionId,
        this.props.contact
      );
    }
  };

  getAttributeRow = (attribute) => {
    const attributeLabel = `${attribute.label[this.props.intl.locale]}`;
    const attributeValue =
      this.props.contact.attributes &&
      this.props.contact.attributes[attribute.objectName]
        ? this.props.contact.attributes[attribute.objectName]
        : '';
    return (
      <ContactAttribute
        key={attribute.id}
        attribute={attribute}
        attributeLabel={attributeLabel}
        attributeValue={attributeValue}
        isReady={this.props.isReady}
        hasVoiceInteraction={this.props.hasVoiceInteraction}
        smsInteractionNumbers={this.props.smsInteractionNumbers}
        startInteraction={this.startInteraction}
        selectedOutboundIdentifier={
          this.props.getSelectedOutboundEmailIdentifier
        }
      />
    );
  };

  getSection = (section) => (
    <div style={styles.section} key={section.label[this.props.intl.locale]}>
      <ContactSectionHeader label={section.label[this.props.intl.locale]} />
      {section.attributes.map(this.getAttributeRow)}
    </div>
  );

  startInteraction = (channelType, contactPoint) => {
    if (channelType === 'email') {
      this.props.startOutboundEmail(
        contactPoint,
        this.props.contact,
        this.props.selectedInteractionIsCreatingNewInteraction,
        this.props.getSelectedOutboundEmailIdentifier
      );
    } else {
      this.props.startOutboundInteraction({
        channelType,
        customer: contactPoint,
        contact: this.props.contact,
        addedByNewInteractionPanel: this.props
          .selectedInteractionIsCreatingNewInteraction,
        openSidePanel: true,
        selectedOutboundAni: this.props.getSelectedOutboundPhoneIdentifier,
      });
      if (channelType === 'voice') {
        const outboundVoiceObject = { phoneNumber: contactPoint };
        if (this.props.getSelectedOutboundPhoneIdentifier) {
          const {
            outboundIdentifier,
            flowId,
          } = this.props.getSelectedOutboundPhoneIdentifier;
          outboundVoiceObject.outboundAni = outboundIdentifier;
          outboundVoiceObject.flowId = flowId;
        }
        CxEngage.interactions.voice.dial(outboundVoiceObject);
      }
      if (!this.props.contact.history) {
        this.props.loadContactInteractionHistory(this.props.contact.id);
      }
    }
  };

  assignContact = () => {
    this.props.assignContact(
      this.props.currentInteraction.interactionId,
      this.props.contact
    );
  };

  render() {
    const inInteractionContext =
      this.props.selectedInteraction &&
      this.props.selectedInteraction.interactionId &&
      !this.props.selectedInteractionIsCreatingNewInteraction &&
      this.props.selectedInteraction.status !== 'script-only';
    return (
      <div style={[styles.base, this.props.style]}>
        <div style={styles.header}>
          <div style={styles.title}>
            {this.props.contact.attributes &&
              this.props.contact.attributes.name}
          </div>
          {this.props.showControls && (
            <div style={styles.buttonGroup}>
              <Button
                id={`assignBtn${this.props.contact.id}`}
                disabled={
                  this.props.loading ||
                  (this.props.currentInteractionContactId &&
                    this.props.currentInteractionContactId ===
                      this.props.contact.id) ||
                  this.props.contactMode !== undefined
                }
                type="secondary"
                onClick={this.assignContact}
                text={this.props.intl.formatMessage(
                  inInteractionContext
                    ? messages.assignButton
                    : messages.selectButton
                )}
              />
              <Button
                id={`editBtn${this.props.contact.id}`}
                disabled={
                  this.props.loading || this.props.contactMode !== undefined
                }
                type="secondary"
                onClick={this.editContact}
                text={this.props.intl.formatMessage(messages.editButton)}
                style={styles.controlButton}
              />
            </div>
          )}
        </div>
        <div>
          {this.props.showCompactView
            ? this.props.compactLayoutAttributes.attributes.map(
              this.getAttributeRow
            )
            : this.props.layoutSections.map(this.getSection)}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  loading: selectLoading(state, props),
  selectedInteraction: getSelectedInteraction(state, props),
  currentInteractionContactId: selectCurrentInteractionContactId(state, props),
  layoutSections: selectPopulatedLayout(state, props),
  compactLayoutAttributes: selectPopulatedCompactAttributes(state, props),
  isReady: selectIsAgentReady(state, props),
  hasVoiceInteraction: selectHasVoiceInteraction(state, props),
  smsInteractionNumbers: selectSmsInteractionNumbers(state, props),
  selectedInteractionIsCreatingNewInteraction: getSelectedInteractionIsCreatingNewInteraction(
    state,
    props
  ),
  currentInteraction: selectCurrentInteraction(state, props),
  getSelectedOutboundEmailIdentifier: getSelectedOutboundEmailIdentifier(
    state,
    props
  ),
  getSelectedOutboundPhoneIdentifier: getSelectedOutboundPhoneIdentifier(
    state,
    props
  ),
});

function mapDispatchToProps(dispatch) {
  return {
    editContact: (interactionId, contact) =>
      dispatch(editContact(interactionId, contact)),
    startOutboundInteraction: (outboundInteractionData) =>
      dispatch(startOutboundInteraction(outboundInteractionData)),
    loadContactInteractionHistory: (contactId) =>
      dispatch(loadContactInteractionHistory(contactId)),
    startOutboundEmail: (
      customer,
      contact,
      addedByNewInteractionPanel,
      outboundAni
    ) =>
      dispatch(
        startOutboundEmail(
          customer,
          contact,
          addedByNewInteractionPanel,
          outboundAni
        )
      ),
    assignContact: (interactionId, contact) =>
      dispatch(assignContact(interactionId, contact)),
    dispatch,
  };
}

ContactView.propTypes = {
  intl: intlShape.isRequired,
  style: PropTypes.object,
  selectedInteraction: PropTypes.object,
  contact: PropTypes.object.isRequired,
  showCompactView: PropTypes.bool,
  showControls: PropTypes.bool,
  assignContact: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  currentInteractionContactId: PropTypes.string,
  layoutSections: PropTypes.array,
  compactLayoutAttributes: PropTypes.object,
  isReady: PropTypes.bool.isRequired,
  contactMode: PropTypes.string,
  hasVoiceInteraction: PropTypes.bool.isRequired,
  smsInteractionNumbers: PropTypes.array.isRequired,
  selectedInteractionIsCreatingNewInteraction: PropTypes.bool.isRequired,
  editContact: PropTypes.func.isRequired,
  startOutboundInteraction: PropTypes.func.isRequired,
  loadContactInteractionHistory: PropTypes.func.isRequired,
  startOutboundEmail: PropTypes.func.isRequired,
  currentInteraction: PropTypes.object,
  getSelectedOutboundEmailIdentifier: PropTypes.object,
  getSelectedOutboundPhoneIdentifier: PropTypes.object,
};

export default ErrorBoundary(
  injectIntl(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(Radium(ContactView))
  )
);
