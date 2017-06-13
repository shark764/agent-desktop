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

import BaseComponent from 'components/BaseComponent';
import { setCriticalError } from 'containers/Errors/actions';

import { startOutboundInteraction } from 'containers/AgentDesktop/actions';
import { selectIsAgentReady, selectHasVoiceInteraction, selectSmsInteractionNumbers } from 'containers/AgentDesktop/selectors';
import { setContactMode, setEditingContact } from 'containers/InfoTab/actions';
import { selectLoading, selectCurrentInteractionContactId } from 'containers/InfoTab/selectors';
import { getSelectedInteractionIsCreatingNewInteraction } from 'containers/ContactsControl/selectors';
import { startOutboundEmail } from 'containers/EmailContentArea/actions';

import Button from 'components/Button';
import ContactAttribute from 'components/ContactAttribute';
import ContactSectionHeader from 'components/ContactSectionHeader';

import { selectPopulatedLayout, selectPopulatedCompactAttributes } from './selectors';

import messages from './messages';

const styles = {
  base: {
    display: 'flex',
    flexDirection: 'column',
    color: '#4B4B4B',
    fontSize: '14px',
    lineHeight: '20px',
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
  controlButton: {
    marginLeft: '10px',
  },
};

export class ContactView extends BaseComponent {

  editContact = () => {
    this.props.setContactMode('editing');
    this.props.setEditingContact(this.props.contact);
  }

  getAttributeRow = (attribute) => {
    const attributeLabel = `${attribute.label[this.props.intl.locale]}`;
    const attributeValue = (this.props.contact.attributes && this.props.contact.attributes[attribute.objectName]) ? this.props.contact.attributes[attribute.objectName] : '';
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
  }

  getSection = (section) =>
    <div style={styles.section} key={section.label[this.props.intl.locale]}>
      <ContactSectionHeader label={section.label[this.props.intl.locale]} />
      {section.attributes.map(this.getAttributeRow)}
    </div>

  startCall = (number) => {
    this.props.startOutboundInteraction('voice', number, this.props.contact, this.props.selectedInteractionIsCreatingNewInteraction);
    CxEngage.interactions.voice.dial({ phoneNumber: number });
  }

  startSms = (number) => {
    this.props.startOutboundInteraction('sms', number, this.props.contact, this.props.selectedInteractionIsCreatingNewInteraction);
  }

  startEmail = (value) => {
    this.props.startOutboundEmail(value, this.props.contact);
  }

  render() {
    return (
      <div style={[this.props.style, styles.base]}>
        <div style={styles.header}>
          <div style={styles.title}>
            { this.props.contact.attributes.name }
          </div>
          {
            this.props.showControls &&
              <div>
                <Button
                  id={`assignBtn${this.props.contact.id}`}
                  disabled={this.props.loading || (this.props.currentInteractionContactId && this.props.currentInteractionContactId === this.props.contact.id)}
                  type="secondary"
                  onClick={() => this.props.assignContact(this.props.contact)}
                  text={this.props.intl.formatMessage(this.props.inInteractionContext ? messages.assignButton : messages.selectButton)}
                />
                <Button
                  id={`editBtn${this.props.contact.id}`}
                  disabled={this.props.loading}
                  type="secondary"
                  onClick={this.editContact}
                  text={this.props.intl.formatMessage(messages.editButton)}
                  style={styles.controlButton}
                />
              </div>
          }
        </div>
        { this.props.showCompactView
          ? this.props.compactLayoutAttributes.attributes.map(this.getAttributeRow)
          : this.props.layoutSections.map(this.getSection)
        }
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  loading: selectLoading(state, props),
  currentInteractionContactId: selectCurrentInteractionContactId(state, props),
  layoutSections: selectPopulatedLayout(state, props),
  compactLayoutAttributes: selectPopulatedCompactAttributes(state, props),
  isReady: selectIsAgentReady(state, props),
  selectedInteractionIsCreatingNewInteraction: getSelectedInteractionIsCreatingNewInteraction(state, props),
  hasVoiceInteraction: selectHasVoiceInteraction(state, props),
  smsInteractionNumbers: selectSmsInteractionNumbers(state, props),
});

function mapDispatchToProps(dispatch) {
  return {
    setCriticalError: () => dispatch(setCriticalError()),
    setContactMode: (contactMode) => dispatch(setContactMode(contactMode)),
    setEditingContact: (editingContact) => dispatch(setEditingContact(editingContact)),
    startOutboundInteraction: (channelType, customer, contact, addedByNewInteractionPanel) => dispatch(startOutboundInteraction(channelType, customer, contact, addedByNewInteractionPanel)),
    startOutboundEmail: (customer, contact) => dispatch(startOutboundEmail(customer, contact)),
    dispatch,
  };
}

ContactView.propTypes = {
  intl: intlShape.isRequired,
  style: PropTypes.object,
  contact: PropTypes.object.isRequired,
  showCompactView: PropTypes.bool,
  showControls: PropTypes.bool,
  assignContact: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  currentInteractionContactId: PropTypes.string,
  layoutSections: PropTypes.array,
  compactLayoutAttributes: PropTypes.object,
  isReady: PropTypes.bool.isRequired,
  hasVoiceInteraction: PropTypes.bool.isRequired,
  smsInteractionNumbers: PropTypes.array.isRequired,
  selectedInteractionIsCreatingNewInteraction: PropTypes.bool.isRequired,
  setContactMode: PropTypes.func.isRequired,
  setEditingContact: PropTypes.func.isRequired,
  startOutboundInteraction: PropTypes.func.isRequired,
  startOutboundEmail: PropTypes.func.isRequired,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Radium(ContactView)));
