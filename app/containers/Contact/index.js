/*
 *
 * Contact
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Radium from 'radium';
import { injectIntl, intlShape } from 'react-intl';

import { startOutboundInteraction } from 'containers/AgentDesktop/actions';
import { selectShowCancelDialog, selectFormIsDirty, selectFormValidity, selectContactForm, selectFormErrors, selectShowErrors } from 'containers/ContactsControl/selectors';
import { setShowCancelDialog, setFormIsDirty, setFormValidity, resetForm, setShowError, setFormField, setFormError } from 'containers/ContactsControl/actions';
import { selectLoading } from 'containers/InfoTab/selectors';
import { clearSearchResults, setLoading } from 'containers/InfoTab/actions';

import ContactSectionHeader from 'components/ContactSectionHeader';
import ContactInput from 'components/ContactInput';
import Button from 'components/Button';
import ConfirmDialog from 'components/ConfirmDialog';

import messages from './messages';
import {
  selectIsReady,
  selectPopulatedLayout,
  selectPopulatedCompactAttributes,
  selectAttributes,
  selectHasVoiceInteraction,
  selectSmsInteractionNumbers,
  selectInInteractionContext,
} from './selectors';

export class Contact extends React.Component {
  constructor(props) {
    super(props);

    this.getSection = this.getSection.bind(this);
    this.getAttributeRow = this.getAttributeRow.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.setAttributeValue = this.setAttributeValue.bind(this);
    this.handleInputClear = this.handleInputClear.bind(this);
    this.showError = this.showError.bind(this);
    this.handleOnBlur = this.handleOnBlur.bind(this);
    this.startCall = this.startCall.bind(this);
    this.startSms = this.startSms.bind(this);
    this.createCallback = this.createCallback.bind(this);
    this.updateCallback = this.updateCallback.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.isEditing && this.props.isEditing) {
      this.props.resetForm();
      this.props.setFormValidity(false);
    }
  }

  styles = {
    base: {
      display: 'flex',
      flexDirection: 'column',
      color: '#4B4B4B',
      fontSize: '14px',
      lineHeight: '20px',
    },
    section: {
      marginBottom: '28px',
    },
    button: {
      float: 'left',
      marginRight: '10px',
    },
    header: {
      borderBottom: '1px solid #E4E4E4',
      paddingBottom: '12px',
      marginBottom: '12px',
      flexGrow: '1',
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

  handleInputChange(newValue, event) {
    this.props.setFormIsDirty(true);
    this.setAttributeValue(event.target.name, newValue);
  }

  handleInputClear(event) {
    const targetInputElement = event.target.previousSibling ? event.target.previousSibling : event.target.parentElement.previousSibling;
    const inputName = targetInputElement.name;
    this.props.setFormIsDirty(true);
    this.setAttributeValue(inputName, '');
  }

  showError(name) {
    if (!this.props.showErrors[name]) {
      this.props.setShowError(name, true);
    }
  }

  handleOnBlur(event) {
    this.props.setFormValidity(Object.keys(this.props.formErrors).every((key) => !this.props.formErrors[key]));
    this.showError(event.target.name);
  }

  handleSave() {
    this.props.setLoading(true);
    if (this.props.contact.id) {
      CxEngage.contacts.update({ contactId: this.props.contact.id, attributes: this.props.contactForm }, this.updateCallback);
      this.props.setNotEditing();
    } else {
      CxEngage.contacts.create({ attributes: this.props.contactForm }, this.createCallback);
      this.props.setNotEditing();
    }
  }

  createCallback(error, topic, response) {
    console.log('[Contact] CxEngage.subscribe()', topic, response);
    if (error) {
      this.props.addNotification('notCreated', true, 'serverError'); // TODO: when notifications are ready, get error from response?
      console.error(error);
    } else {
      this.props.assignContact(response, () => {
        this.props.clearSearchResults();
        this.props.addNotification('created', false);
        this.props.setLoading(false);
      });
    }
  }

  updateCallback(error, topic, response) {
    console.log('[Contact] CxEngage.subscribe()', topic, response);
    this.props.setLoading(false);
    if (error) {
      this.props.addNotification('notSaved', true, 'serverError'); // TODO: when notifications are ready, get error from response?
      console.error(error);
    } else {
      this.props.clearSearchResults();
      this.props.addNotification('saved', false);
    }
  }

  startCall(number) {
    this.props.startOutboundInteraction('voice');
    CxEngage.interactions.voice.dial({ phoneNumber: number });
  }

  startSms(value) {
    this.props.startOutboundInteraction('sms', value, this.props.contact);
  }

  getAttributeRow(attribute) {
    const attributeLabel = `${attribute.label[this.props.intl.locale]}${(attribute.mandatory && this.props.isEditing) ? '*' : ''}`;
    return (
      <ContactInput
        key={attribute.id}
        handleInputChange={this.handleInputChange}
        handleOnBlur={this.handleOnBlur}
        handleInputClear={this.handleInputClear}
        formatValue={this.props.formatValue}
        attemptCall={this.attemptCall}
        attribute={attribute}
        attributeLabel={attributeLabel}
        isEditing={this.props.isEditing}
        intl={this.props.intl}
        contact={this.props.contact}
        isReady={this.props.isReady}
        hasVoiceInteraction={this.props.hasVoiceInteraction}
        showErrors={this.props.showErrors}
        errors={this.props.formErrors}
        formInput={this.props.contactForm[attribute.objectName]}
        startCall={this.startCall}
        startSms={this.startSms}
        smsInteractionNumbers={this.props.smsInteractionNumbers}
      />
    );
  }

  getSection(section) {
    return (
      <div style={this.styles.section} key={section.label[this.props.intl.locale]}>
        <ContactSectionHeader label={section.label[this.props.intl.locale]} />
        {section.attributes.map(this.getAttributeRow)}
      </div>
    );
  }

  setAttributeValue(name, newValue) {
    const stateUpdate = { ...this.props.formErrors };
    const cleanedInput = this.props.formatValue(name, newValue);
    const newError = this.props.getError(name, cleanedInput);
    stateUpdate[name] = newError;
    this.props.setFormField(name, cleanedInput);
    this.props.setFormError(name, this.props.getError(name, cleanedInput));
    this.props.setFormValidity(Object.keys(stateUpdate).every((key) => !stateUpdate[key]));
  }

  getDisplayView() {
    return (
      <div>
        <div style={this.styles.header}>
          <div style={this.styles.title}>
            { this.props.contact.attributes.name }
          </div>
          {
            this.props.showControls ?
              <div>
                <Button
                  id={`assignBtn${this.props.contact.id}`}
                  disabled={this.props.loading || this.props.isAssigned}
                  type="secondary"
                  onClick={this.props.assign}
                  text={this.props.intl.formatMessage(this.props.inInteractionContext ? messages.assignButton : messages.selectButton)}
                />
                <Button
                  id={`editBtn${this.props.contact.id}`}
                  disabled={this.props.loading}
                  type="secondary"
                  onClick={this.props.edit}
                  text={this.props.intl.formatMessage(messages.editButton)}
                  style={this.styles.controlButton}
                />
              </div>
            : <div></div>
          }
        </div>
        { this.props.showCompactView
          ? this.props.compactLayoutAttributes.attributes.map(this.getAttributeRow)
          : this.props.layoutSections.map(this.getSection)
        }
      </div>
    );
  }

  render() {
    return (
      <div style={[this.props.style, this.styles.base]}>
        {
          this.props.isEditing
            ? this.props.layoutSections.map(this.getSection)
            : this.getDisplayView()
        }
        {
          this.props.isEditing
            ? <div style={{ marginBottom: '28px', position: 'relative' }}>
              <ConfirmDialog
                questionMessage={messages.abandonChanges}
                leftAction={() => this.props.setShowCancelDialog(false)}
                rightAction={this.props.setNotEditing}
                isVisible={this.props.showCancelDialog}
                hide={() => this.props.setShowCancelDialog(false)}
                style={{ position: 'absolute', left: this.props.contact.id ? '112px' : '64px', bottom: '40px' }}
              />
              <Button
                id="contactSaveBtn"
                style={this.styles.button}
                disabled={this.props.loading || !this.props.formIsValid || !this.props.formIsDirty}
                type="secondary"
                onClick={this.handleSave}
                text={
                  this.props.contact.id
                    ? this.props.intl.formatMessage(messages.saveBtn)
                    : this.props.intl.formatMessage(messages.createBtn)
                }
              />
              <Button
                id="contactCancelBtn"
                style={this.styles.button}
                type="secondary"
                text={this.props.intl.formatMessage(messages.cancelBtn)}
                onClick={this.props.handleCancel}
              />
            </div>
            : ''
        }
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  attributes: selectAttributes(state, props),
  layoutSections: selectPopulatedLayout(state, props),
  compactLayoutAttributes: selectPopulatedCompactAttributes(state, props),
  isReady: selectIsReady(state, props),
  hasVoiceInteraction: selectHasVoiceInteraction(state, props),
  smsInteractionNumbers: selectSmsInteractionNumbers(state, props),
  inInteractionContext: selectInInteractionContext(state, props),
  showCancelDialog: selectShowCancelDialog(state, props),
  formIsDirty: selectFormIsDirty(state, props),
  formIsValid: selectFormValidity(state, props),
  contactForm: selectContactForm(state, props),
  formErrors: selectFormErrors(state, props),
  showErrors: selectShowErrors(state, props),
  loading: selectLoading(state, props),
});

function mapDispatchToProps(dispatch) {
  return {
    startOutboundInteraction: (channelType, customer, contact) => dispatch(startOutboundInteraction(channelType, customer, contact)),
    setShowCancelDialog: (showCancelDialog) => dispatch(setShowCancelDialog(showCancelDialog)),
    setLoading: (loading) => dispatch(setLoading(loading)),
    clearSearchResults: () => dispatch(clearSearchResults()),
    setFormIsDirty: (formIsDirty) => dispatch(setFormIsDirty(formIsDirty)),
    setFormValidity: (formIsValid) => dispatch(setFormValidity(formIsValid)),
    resetForm: () => dispatch(resetForm()),
    setShowError: (field, error) => dispatch(setShowError(field, error)),
    setFormField: (field, value) => dispatch(setFormField(field, value)),
    setFormError: (field, error) => dispatch(setFormError(field, error)),
    dispatch,
  };
}

Contact.propTypes = {
  getError: PropTypes.func.isRequired,
  formatValue: PropTypes.func.isRequired,
  showControls: PropTypes.bool,
  assign: PropTypes.func,
  edit: PropTypes.func,
  isAssigned: PropTypes.bool,
  showCompactView: PropTypes.bool,
  compactLayoutAttributes: PropTypes.object,
  layoutSections: PropTypes.array,
  attributes: PropTypes.array,
  contact: PropTypes.object,
  isEditing: PropTypes.bool,
  loading: PropTypes.bool,
  intl: intlShape.isRequired,
  style: PropTypes.object,
  isReady: PropTypes.bool.isRequired,
  inInteractionContext: PropTypes.bool.isRequired,
  hasVoiceInteraction: PropTypes.bool.isRequired,
  smsInteractionNumbers: PropTypes.array.isRequired,
  startOutboundInteraction: PropTypes.func.isRequired,
  showCancelDialog: PropTypes.bool,
  handleCancel: PropTypes.func,
  resetForm: PropTypes.func,
  setFormValidity: PropTypes.func,
  setFormIsDirty: PropTypes.func,
  showErrors: PropTypes.object,
  setShowError: PropTypes.func,
  formErrors: PropTypes.object,
  setLoading: PropTypes.func,
  contactForm: PropTypes.object,
  setNotEditing: PropTypes.func,
  addNotification: PropTypes.func,
  assignContact: PropTypes.func,
  clearSearchResults: PropTypes.func,
  setFormField: PropTypes.func,
  setFormError: PropTypes.func,
  setShowCancelDialog: PropTypes.func,
  formIsValid: PropTypes.bool,
  formIsDirty: PropTypes.bool,
};

Contact.defaultProps = {
  contact: {},
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Radium(Contact)));
