/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * ContactEdit
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Radium from 'radium';
import { injectIntl, intlShape } from 'react-intl';

import { removeSearchFilter } from 'containers/AgentDesktop/actions';
import { selectShowCancelDialog, selectFormIsDirty, selectFormValidity, selectContactForm, selectFormErrors, selectShowErrors } from 'containers/ContactsControl/selectors';
import { setShowCancelDialog, setFormIsDirty, setFormValidity, setShowError, setFormField, setFormError } from 'containers/ContactsControl/actions';
import { selectLoading, selectContactMode } from 'containers/InfoTab/selectors';
import { clearSearchResults, setLoading, setEditingContact } from 'containers/InfoTab/actions';

import BaseComponent from 'components/BaseComponent';
import { setCriticalError } from 'containers/Errors/actions';

import ContactSectionHeader from 'components/ContactSectionHeader';
import ContactInput from 'components/ContactInput';
import Button from 'components/Button';
import ConfirmDialog from 'components/ConfirmDialog';

import { selectPopulatedLayout } from 'containers/ContactView/selectors';
import messages from './messages';

const styles = {
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
};

export class ContactEdit extends BaseComponent {

  handleInputChange = (newValue, event) => {
    this.props.setFormIsDirty(true);
    this.setAttributeValue(event.target.name, newValue);
  }

  handleInputClear = (event) => {
    const targetInputElement = event.target.previousSibling ? event.target.previousSibling : event.target.parentElement.previousSibling;
    const inputName = targetInputElement.name;
    this.props.setFormIsDirty(true);
    this.setAttributeValue(inputName, '');
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

  handleSave = () => {
    this.props.setLoading(true);
    if (this.props.contactMode === 'edit') {
      CxEngage.contacts.update({ contactId: this.props.contactId, attributes: this.props.contactForm }, this.updateCallback);
      // TODO: handle errors
    } else {
      CxEngage.contacts.create({ attributes: this.props.contactForm }, this.createCallback);
      // TODO: handle errors
    }
  }

  createCallback = (error, topic, response) => {
    console.log('[Contact] CxEngage.subscribe()', topic, response);
    if (error) {
      this.props.addNotification('notCreated', true, 'serverError'); // TODO: when notifications are ready, get error from response?
      this.props.setLoading(false);
      console.error(error);
    } else {
      this.props.assignContact(response);
      this.props.setNotEditing();
    }
  }

  updateCallback = (error, topic, response) => {
    console.log('[Contact] CxEngage.subscribe()', topic, response);
    this.props.setLoading(false);
    if (error) {
      this.props.addNotification('notSaved', true, 'serverError'); // TODO: when notifications are ready, get error from response?
      console.error(error);
    } else {
      this.props.setNotEditing();
      this.props.clearSearchResults();
      this.props.addNotification('saved', false);
    }
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

  getSection = (section) =>
    <div style={styles.section} key={section.label[this.props.intl.locale]}>
      <ContactSectionHeader label={section.label[this.props.intl.locale]} />
      {section.attributes.map(this.getAttributeRow)}
    </div>

  getAttributeRow = (attribute) => {
    const attributeLabel = `${attribute.label[this.props.intl.locale]}${attribute.mandatory ? '*' : ''}`;
    return (
      <ContactInput
        key={attribute.id}
        handleInputChange={this.handleInputChange}
        handleOnBlur={this.handleOnBlur}
        handleInputClear={this.handleInputClear}
        formatValue={this.props.formatValue}
        attribute={attribute}
        attributeLabel={attributeLabel}
        intl={this.props.intl}
        showErrors={this.props.showErrors}
        errors={this.props.formErrors}
        formInput={this.props.contactForm[attribute.objectName]}
      />
    );
  }

  render() {
    return (
      <div style={[this.props.style, styles.base]}>
        { this.props.layoutSections.map(this.getSection) }
        <div style={{ marginBottom: '28px', position: 'relative' }}>
          <ConfirmDialog
            questionMessage={messages.abandonChanges}
            leftAction={() => this.props.setShowCancelDialog(false)}
            rightAction={this.props.setNotEditing}
            isVisible={this.props.showCancelDialog}
            hide={() => this.props.setShowCancelDialog(false)}
            style={{ position: 'absolute', left: (this.props.contactMode === 'edit') ? '112px' : '64px', bottom: '40px' }}
          />
          <Button
            id="contactSaveBtn"
            style={styles.button}
            disabled={this.props.loading || !this.props.formIsValid || !this.props.formIsDirty}
            type="secondary"
            onClick={this.handleSave}
            text={
              this.props.contactMode === 'edit'
                ? this.props.intl.formatMessage(messages.saveBtn)
                : this.props.intl.formatMessage(messages.createBtn)
            }
          />
          <Button
            id="contactCancelBtn"
            style={styles.button}
            type="secondary"
            text={this.props.intl.formatMessage(messages.cancelBtn)}
            onClick={this.props.handleCancel}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  contactMode: selectContactMode(state, props),
  layoutSections: selectPopulatedLayout(state, props),
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
    setCriticalError: () => dispatch(setCriticalError()),
    setShowCancelDialog: (showCancelDialog) => dispatch(setShowCancelDialog(showCancelDialog)),
    setLoading: (loading) => dispatch(setLoading(loading)),
    clearSearchResults: () => dispatch(clearSearchResults()),
    setFormIsDirty: (formIsDirty) => dispatch(setFormIsDirty(formIsDirty)),
    setFormValidity: (formIsValid) => dispatch(setFormValidity(formIsValid)),
    setShowError: (field, error) => dispatch(setShowError(field, error)),
    setFormField: (field, value) => dispatch(setFormField(field, value)),
    setFormError: (field, error) => dispatch(setFormError(field, error)),
    removeSearchFilter: () => dispatch(removeSearchFilter()),
    setEditingContact: (contact) => dispatch(setEditingContact(contact)),
    dispatch,
  };
}

ContactEdit.propTypes = {
  getError: PropTypes.func.isRequired,
  formatValue: PropTypes.func.isRequired,
  edit: PropTypes.func,
  layoutSections: PropTypes.array,
  contactId: PropTypes.string,
  loading: PropTypes.bool,
  intl: intlShape.isRequired,
  style: PropTypes.object,
  showCancelDialog: PropTypes.bool,
  handleCancel: PropTypes.func,
  setFormValidity: PropTypes.func,
  setFormIsDirty: PropTypes.func,
  showErrors: PropTypes.object,
  setShowError: PropTypes.func,
  formErrors: PropTypes.object,
  setLoading: PropTypes.func,
  contactForm: PropTypes.object,
  setNotEditing: PropTypes.func,
  addNotification: PropTypes.func,
  assignContact: PropTypes.func.isRequired,
  clearSearchResults: PropTypes.func,
  setFormField: PropTypes.func,
  setFormError: PropTypes.func,
  setShowCancelDialog: PropTypes.func,
  formIsValid: PropTypes.bool,
  formIsDirty: PropTypes.bool,
  removeSearchFilter: PropTypes.func,
  setEditingContact: PropTypes.func,
  contactMode: PropTypes.string,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Radium(ContactEdit)));
