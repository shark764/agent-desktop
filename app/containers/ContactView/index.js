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
  assignContact,
} from 'containers/AgentDesktop/actions';
import {
  selectIsAgentReady,
  selectHasVoiceInteraction,
  selectSmsInteractionNumbers,
  selectSelectedInteraction,
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
    flexShrink: '1',
  },
  buttonGroup: {
    display: 'flex',
  },
  controlButton: {
    marginLeft: '10px',
  },
  attributes: {
    overflowY: 'hidden',
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
        startCall={this.startCall}
        startSms={this.startSms}
        startEmail={this.startEmail}
      />
    );
  };

  getSection = (section) =>
    (<div style={styles.section} key={section.label[this.props.intl.locale]}>
      <ContactSectionHeader label={section.label[this.props.intl.locale]} />
      {section.attributes.map(this.getAttributeRow)}
    </div>);

  startCall = (number) => {
    this.props.startOutboundInteraction(
      'voice',
      number,
      this.props.contact,
      this.props.selectedInteractionIsCreatingNewInteraction
    );
    CxEngage.interactions.voice.dial({ phoneNumber: number });
  };

  startSms = (number) => {
    this.props.startOutboundInteraction(
      'sms',
      number,
      this.props.contact,
      this.props.selectedInteractionIsCreatingNewInteraction
    );
  };

  startEmail = (value) => {
    this.props.startOutboundEmail(
      value,
      this.props.contact,
      this.props.selectedInteractionIsCreatingNewInteraction
    );
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
      <div style={[this.props.style, styles.base]}>
        <div style={styles.header}>
          <div style={styles.title}>
            {this.props.contact.attributes &&
              this.props.contact.attributes.name}
          </div>
          {this.props.showControls &&
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
            </div>}
        </div>
        <div style={styles.attributes}>
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
  selectedInteraction: selectSelectedInteraction(state, props),
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
});

function mapDispatchToProps(dispatch) {
  return {
    editContact: (interactionId, contact) =>
      dispatch(editContact(interactionId, contact)),
    startOutboundInteraction: (
      channelType,
      customer,
      contact,
      addedByNewInteractionPanel
    ) =>
      dispatch(
        startOutboundInteraction(
          channelType,
          customer,
          contact,
          addedByNewInteractionPanel
        )
      ),
    startOutboundEmail: (customer, contact, addedByNewInteractionPanel) =>
      dispatch(
        startOutboundEmail(customer, contact, addedByNewInteractionPanel)
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
  startOutboundEmail: PropTypes.func.isRequired,
  currentInteraction: PropTypes.object,
};

export default ErrorBoundary(
  injectIntl(connect(mapStateToProps, mapDispatchToProps)(Radium(ContactView)))
);
