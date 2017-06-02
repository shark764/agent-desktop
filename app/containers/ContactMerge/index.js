/*
 *
 * ContactMerge
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Radium from 'radium';
import { injectIntl, intlShape } from 'react-intl';

import BaseComponent from 'components/BaseComponent';
import { setCriticalError } from 'containers/Errors/actions';

import ContactSectionHeader from 'components/ContactSectionHeader';
import ContactInput from 'components/ContactInput';
import ConfirmDialog from 'components/ConfirmDialog';
import Button from 'components/Button';

import { setContactAction, removeContact, removeSearchFilter } from 'containers/AgentDesktop/actions';
import { selectSmsInteractionNumbers } from 'containers/AgentDesktop/selectors';
import { selectShowCancelDialog, selectShowConfirmDialog, selectFormValidity, selectContactForm, selectFormErrors, selectShowErrors } from 'containers/ContactsControl/selectors';
import { setShowCancelDialog, setShowConfirmDialog, setFormValidity, setShowError, setFormField, setFormError, setUnusedField, setSelectedIndex } from 'containers/ContactsControl/actions';
import { selectCheckedContacts, selectCurrentInteraction } from 'containers/InfoTab/selectors';
import { clearSearchResults, setLoading, setUnassignedContact } from 'containers/InfoTab/actions';

import { selectLayout, selectAttributes, selectSelectedIndexes, selectUnusedFields } from './selectors';
import messages from './messages';

export class ContactMerge extends BaseComponent {

  componentDidMount() {
    this.props.setFormValidity(true);
  }

  styles = {
    base: {
      display: 'flex',
      flexDirection: 'column',
      color: '#4B4B4B',
      fontSize: '14px',
      lineHeight: '20px',
      marginTop: '8px',
      paddingRight: '5px',
      alignSelf: 'stretch',
      flexGrow: '1',
      flexShrink: '0',
    },
    button: {
      float: 'left',
      marginRight: '10px',
    },
    section: {
      marginBottom: '28px',
    },
  }

  handleSubmit = () => {
    const contactIds = this.props.checkedContacts.map((contact) => contact.id);
    const attributes = this.props.contactForm;
    CxEngage.contacts.merge({ contactIds, attributes }, this.mergeCallback);
    this.props.setLoading(true);
    this.props.setNotEditing();
    this.props.setContactAction(this.props.selectedInteraction.interactionId, 'view');
  }

  mergeCallback = (error, topic, response) => {
    console.log('[ContactMerge] CxEngage.subscribe()', topic, response);
    this.props.setUnassignedContact(response);
    this.props.setLoading(false);
    if (error) {
      this.props.addNotification('notMerged', true, 'serverError'); // TODO: when notifications are ready, get error from response?
      console.error(error);
    } else {
      if (this.props.selectedInteraction.contact && this.props.checkedContacts.find((contact) => this.props.selectedInteraction.contact.id === contact.id)) {
        this.props.assignContact(response);
      }
      this.props.checkedContacts.forEach((contact) => {
        this.props.removeContact(contact.id);
      });
      this.props.clearSearchResults();
      this.props.removeSearchFilter();
      this.props.addNotification('saved', false);
    }
  }

  selectAttribute = (event) => {
    const name = event.currentTarget.name;
    const clickedIndex = parseInt(event.target.id.slice(-1), 10);
    const previousIndex = this.props.selectedIndexes[name];
    const errors = { ...this.props.formErrors };
    if (previousIndex === clickedIndex) {
      return;
    }
    if (previousIndex === 0) {
      this.props.setSelectedIndex(name, 1);
    } else {
      this.props.setSelectedIndex(name, 0);
    }
    errors[name] = this.props.getError(name, event.currentTarget.value);
    this.props.setFormError(name, errors[name]);
    this.props.setUnusedField(name, this.props.contactForm[name]);
    this.props.setFormField(name, event.currentTarget.value);
    this.props.setFormValidity(Object.keys(errors).every((key) => errors[key] === false));
  }

  showError = (name) => {
    if (!this.props.showErrors[name]) {
      this.props.setShowError(name, true);
    }
  }

  handleOnBlur = (event) => {
    this.props.setFormValidity(Object.keys(this.props.formErrors).every((key) => !this.props.formErrors[key]));
    this.showError(event.target.name);
  }

  setAttributeValue = (name, newValue) => {
    const stateUpdate = { ...this.props.formErrors };
    const cleanedInput = this.props.formatValue(name, newValue);
    const newError = this.props.getError(name, cleanedInput);
    stateUpdate[name] = newError;
    this.props.setFormField(name, cleanedInput);
    this.props.setFormError(name, this.props.getError(name, cleanedInput));
    this.props.setFormValidity(Object.keys(stateUpdate).every((key) => !stateUpdate[key]));
  }

  setUnusedValue = (name, newValue) => {
    this.props.setUnusedField(name, this.props.formatValue(name, newValue));
  }

  handleInputClear = (event, index) => {
    const targetInputElement = event.target.previousSibling ? event.target.previousSibling : event.target.parentElement.previousSibling;
    const inputName = targetInputElement.name;
    if (index === undefined || this.props.selectedIndexes[inputName] === index) {
      this.setAttributeValue(inputName, '');
    } else {
      this.setUnusedValue(inputName, '');
    }
  }

  handleTopInputClear = (event) => {
    this.handleInputClear(event, 0);
  }

  handleBottomInputClear = (event) => {
    this.handleInputClear(event, 1);
  }

  handleInputChange = (newValue, event, index) => {
    if (index === undefined || this.props.selectedIndexes[event.target.name] === index) {
      this.setAttributeValue(event.target.name, newValue);
    } else {
      this.setUnusedValue(event.target.name, newValue);
    }
  }

  handleTopInputChange = (newValue, event) => {
    this.handleInputChange(newValue, event, 0);
  }

  handleBottomInputChange = (newValue, event) => {
    this.handleInputChange(newValue, event, 1);
  }

  generateAttributeRow = (attributeId) => {
    const attribute = this.props.attributes.find((attr) => attr.id === attributeId);
    const attributeLabel = `${attribute.label[this.props.intl.locale]}${(attribute.mandatory) ? '*' : ''}`;
    const firstValue = this.props.checkedContacts[0].attributes[attribute.objectName] || '';
    const secondValue = this.props.checkedContacts[1].attributes[attribute.objectName] || '';
    if (firstValue === secondValue || secondValue === '' || attribute.type === 'boolean') {
      return (
        <ContactInput
          key={attribute.id}
          handleInputChange={this.handleInputChange}
          handleOnBlur={this.handleOnBlur}
          handleInputClear={this.handleInputClear}
          attribute={attribute}
          attributeLabel={attributeLabel}
          isEditing
          intl={this.props.intl}
          contact={this.props.checkedContacts[0]}
          showErrors={this.props.showErrors}
          errors={this.props.formErrors}
          formInput={this.props.contactForm[attribute.objectName]}
          smsInteractionNumbers={this.props.smsInteractionNumbers}
        />
      );
    }
    if (firstValue === '' && secondValue !== '') {
      return (
        <ContactInput
          key={attribute.id}
          handleInputChange={this.handleInputChange}
          handleOnBlur={this.handleOnBlur}
          handleInputClear={this.handleInputClear}
          attribute={attribute}
          attributeLabel={attributeLabel}
          isEditing
          intl={this.props.intl}
          contact={this.props.checkedContacts[1]}
          showErrors={this.props.showErrors}
          errors={this.props.formErrors}
          formInput={this.props.contactForm[attribute.objectName]}
          smsInteractionNumbers={this.props.smsInteractionNumbers}
        />
      );
    }
    return (
      <div key={attribute.id} >
        <div style={{ display: 'flex' }}>
          <input
            type="radio"
            id={`${attribute.objectName}0`}
            name={attribute.objectName}
            style={{ marginRight: '5px', marginTop: '7px' }}
            value={this.props.selectedIndexes[attribute.objectName] === 0 ? this.props.contactForm[attribute.objectName] : this.props.unusedFields[attribute.objectName]}
            checked={this.props.selectedIndexes[attribute.objectName] === 0}
            onChange={this.selectAttribute}
          />
          <ContactInput
            key={`${attribute.id}-0`}
            handleInputChange={this.handleTopInputChange}
            handleOnBlur={this.handleOnBlur}
            handleInputClear={this.handleTopInputClear}
            attribute={attribute}
            attributeLabel={attributeLabel}
            isEditing
            notSelected={this.props.selectedIndexes[attribute.objectName] !== 0}
            hasRadio
            intl={this.props.intl}
            contact={this.props.checkedContacts[0]}
            showErrors={this.props.selectedIndexes[attribute.objectName] === 0 ? this.props.showErrors : {}}
            errors={this.props.formErrors}
            formInput={this.props.selectedIndexes[attribute.objectName] === 0 ? this.props.contactForm[attribute.objectName] : this.props.unusedFields[attribute.objectName]}
            smsInteractionNumbers={this.props.smsInteractionNumbers}
          />
        </div>
        <div style={{ display: 'flex' }}>
          <input
            type="radio"
            id={`${attribute.objectName}1`}
            name={attribute.objectName}
            style={{ marginRight: '5px', marginTop: '7px' }}
            value={this.props.selectedIndexes[attribute.objectName] === 1 ? this.props.contactForm[attribute.objectName] : this.props.unusedFields[attribute.objectName]}
            checked={this.props.selectedIndexes[attribute.objectName] === 1}
            onChange={this.selectAttribute}
          />
          <ContactInput
            key={`${attribute.id}-1`}
            handleInputChange={this.handleBottomInputChange}
            handleOnBlur={this.handleOnBlur}
            handleInputClear={this.handleBottomInputClear}
            attribute={attribute}
            attributeLabel={attributeLabel}
            isEditing
            notSelected={this.props.selectedIndexes[attribute.objectName] !== 1}
            hasRadio
            intl={this.props.intl}
            contact={this.props.checkedContacts[1]}
            showErrors={this.props.selectedIndexes[attribute.objectName] === 1 ? this.props.showErrors : {}}
            errors={this.props.formErrors}
            formInput={this.props.selectedIndexes[attribute.objectName] === 1 ? this.props.contactForm[attribute.objectName] : this.props.unusedFields[attribute.objectName]}
            smsInteractionNumbers={this.props.smsInteractionNumbers}
          />
        </div>
      </div>
    );
  }

  generateSection = (section) =>
    <div style={this.styles.section} key={section.label[this.props.intl.locale]}>
      <ContactSectionHeader label={section.label[this.props.intl.locale]} />
      {section.attributes.map(this.generateAttributeRow)}
    </div>

  showConfirmDialog = () => {
    this.props.setShowConfirmDialog(true);
  }

  hideConfirmDialog = () => {
    this.props.setShowConfirmDialog(false);
  }

  hideCancelDialog = () => {
    this.props.setShowCancelDialog(false);
  }

  render() {
    return (
      <div style={this.styles.base}>
        { this.props.layout.map(this.generateSection) }
        <div style={{ marginBottom: '28px', position: 'relative' }}>
          <ConfirmDialog
            questionMessage={messages.confirmChanges}
            leftAction={this.hideConfirmDialog}
            rightAction={this.handleSubmit}
            isVisible={this.props.showConfirmDialog}
            hide={this.hideConfirmDialog}
            style={{ position: 'absolute', bottom: '40px' }}
          />
          <ConfirmDialog
            questionMessage={messages.abandonChanges}
            leftAction={this.hideCancelDialog}
            rightAction={this.props.setNotEditing}
            isVisible={this.props.showCancelDialog}
            hide={this.hideCancelDialog}
            style={{ position: 'absolute', left: '112px', bottom: '40px' }}
          />
          <Button
            id="contactSaveBtn"
            style={this.styles.button}
            disabled={!this.props.formIsValid}
            type="secondary"
            onClick={this.showConfirmDialog}
            text={this.props.intl.formatMessage(messages.saveBtn)}
          />
          <Button
            id="contactCancelBtn"
            style={this.styles.button}
            type="secondary"
            text={this.props.intl.formatMessage(messages.cancelBtn)}
            onClick={this.props.handleCancel}
          />
        </div>
      </div>
    );
  }
}

ContactMerge.propTypes = {
  getError: PropTypes.func.isRequired,
  formatValue: PropTypes.func.isRequired,
  attributes: PropTypes.array,
  intl: intlShape.isRequired,
  layout: PropTypes.array,
  handleCancel: PropTypes.func.isRequired,
  showCancelDialog: PropTypes.bool.isRequired,
  checkedContacts: PropTypes.array.isRequired,
  setFormValidity: PropTypes.func,
  contactForm: PropTypes.object,
  setLoading: PropTypes.func,
  setNotEditing: PropTypes.func,
  setContactAction: PropTypes.func,
  selectedInteraction: PropTypes.object,
  setUnassignedContact: PropTypes.func,
  addNotification: PropTypes.func,
  clearSearchResults: PropTypes.func,
  selectedIndexes: PropTypes.object,
  formErrors: PropTypes.object,
  setSelectedIndex: PropTypes.func,
  setFormError: PropTypes.func,
  setUnusedField: PropTypes.func,
  setFormField: PropTypes.func,
  showErrors: PropTypes.object,
  setShowError: PropTypes.func,
  smsInteractionNumbers: PropTypes.array,
  unusedFields: PropTypes.object,
  setShowCancelDialog: PropTypes.func,
  formIsValid: PropTypes.bool,
  removeContact: PropTypes.func,
  assignContact: PropTypes.func,
  removeSearchFilter: PropTypes.func,
};

function mapStateToProps(state, props) {
  return {
    layout: selectLayout(state, props),
    attributes: selectAttributes(state, props),
    checkedContacts: selectCheckedContacts(state, props),
    showCancelDialog: selectShowCancelDialog(state, props),
    showConfirmDialog: selectShowConfirmDialog(state, props),
    smsInteractionNumbers: selectSmsInteractionNumbers(state, props),
    selectedInteraction: selectCurrentInteraction(state, props),
    formIsValid: selectFormValidity(state, props),
    contactForm: selectContactForm(state, props),
    formErrors: selectFormErrors(state, props),
    showErrors: selectShowErrors(state, props),
    selectedIndexes: selectSelectedIndexes(state, props),
    unusedFields: selectUnusedFields(state, props),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setCriticalError: () => dispatch(setCriticalError()),
    setShowCancelDialog: (showCancelDialog) => dispatch(setShowCancelDialog(showCancelDialog)),
    setShowConfirmDialog: (showConfirmDialog) => dispatch(setShowConfirmDialog(showConfirmDialog)),
    setLoading: (loading) => dispatch(setLoading(loading)),
    clearSearchResults: () => dispatch(clearSearchResults()),
    setContactAction: (interactionId, newAction) => dispatch(setContactAction(interactionId, newAction)),
    setFormValidity: (formIsValid) => dispatch(setFormValidity(formIsValid)),
    setShowError: (field, error) => dispatch(setShowError(field, error)),
    setFormField: (field, value) => dispatch(setFormField(field, value)),
    setFormError: (field, error) => dispatch(setFormError(field, error)),
    setUnusedField: (field, value) => dispatch(setUnusedField(field, value)),
    setSelectedIndex: (field, index) => dispatch(setSelectedIndex(field, index)),
    setUnassignedContact: (contact) => dispatch(setUnassignedContact(contact)),
    removeContact: (contact) => dispatch(removeContact(contact)),
    removeSearchFilter: () => dispatch(removeSearchFilter()),
    dispatch,
  };
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Radium(ContactMerge)));
