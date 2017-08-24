/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * ContactMerge
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Radium from 'radium';
import { injectIntl, intlShape } from 'react-intl';

import ErrorBoundary from 'components/ErrorBoundary';

import ContactSectionHeader from 'components/ContactSectionHeader';
import ContactInput from 'components/ContactInput';
import ConfirmDialog from 'components/ConfirmDialog';
import Button from 'components/Button';

import {
  setFormValidity,
  setShowError,
  setFormField,
  setFormError,
  setUnusedField,
  setSelectedIndex,
} from 'containers/AgentDesktop/actions';
import {
  selectShowCancelDialog,
  selectShowConfirmDialog,
  selectFormValidity,
  selectContactForm,
  selectFormErrors,
  selectShowErrors,
  selectSelectedIndexes,
  selectUnusedFields,
  selectEditingContacts,
  selectContactSaveLoading,
} from 'containers/ContactsControl/selectors';
import {
  setShowCancelDialog,
  setShowConfirmDialog,
  submitContactMerge,
} from 'containers/ContactsControl/actions';
import { selectCurrentInteraction } from 'containers/InfoTab/selectors';
import {
  selectLayout,
  selectAttributes,
} from 'containers/ContactSearchBar/selectors';

import { formatValue, getError } from 'utils/contact';

import messages from './messages';

const styles = {
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
    paddingLeft: '52px',
  },
  button: {
    float: 'left',
    marginRight: '10px',
  },
  section: {
    marginBottom: '28px',
  },
  radio: {
    marginTop: '7px',
    marginRight: '5px',
    marginLeft: '2px',
  },
  radioInputLabel: {
    width: '159px',
  },
};

export class ContactMerge extends React.Component {
  handleSubmit = () => {
    this.props.submitContactMerge(this.props.selectedInteraction.interactionId);
    this.hideConfirmDialog();
  };

  selectAttribute = (event) => {
    const name = event.currentTarget.name;
    const attribute = this.props.attributes.find(
      (attr) => attr.objectName === name
    );
    const clickedIndex = parseInt(event.target.id.slice(-1), 10);
    const previousIndex = this.props.selectedIndexes[name];
    const errors = { ...this.props.formErrors };
    if (previousIndex === clickedIndex) {
      return;
    }
    if (previousIndex === 0) {
      this.props.setSelectedIndex(
        this.props.selectedInteraction.interactionId,
        name,
        1
      );
    } else {
      this.props.setSelectedIndex(
        this.props.selectedInteraction.interactionId,
        name,
        0
      );
    }
    errors[name] = getError(attribute, event.currentTarget.value);
    this.props.setFormError(
      this.props.selectedInteraction.interactionId,
      name,
      errors[name]
    );
    this.props.setUnusedField(
      this.props.selectedInteraction.interactionId,
      name,
      this.props.contactForm[name]
    );
    this.props.setFormField(
      this.props.selectedInteraction.interactionId,
      name,
      event.currentTarget.value
    );
    this.props.setFormValidity(
      this.props.selectedInteraction.interactionId,
      Object.keys(errors).every((key) => errors[key] === false)
    );
  };

  showError = (name) => {
    if (!this.props.showErrors[name]) {
      this.props.setShowError(
        this.props.selectedInteraction.interactionId,
        name,
        true
      );
    }
  };

  handleOnBlur = (event) => {
    this.props.setFormValidity(
      this.props.selectedInteraction.interactionId,
      Object.keys(this.props.formErrors).every(
        (key) => !this.props.formErrors[key]
      )
    );
    this.showError(event.target.name);
  };

  setAttributeValue = (name, newValue) => {
    const attribute = this.props.attributes.find(
      (attr) => attr.objectName === name
    );
    const stateUpdate = { ...this.props.formErrors };
    const cleanedInput = formatValue(attribute, newValue);
    const newError = getError(attribute, cleanedInput);
    stateUpdate[name] = newError;
    this.props.setFormField(
      this.props.selectedInteraction.interactionId,
      name,
      cleanedInput
    );
    this.props.setFormError(
      this.props.selectedInteraction.interactionId,
      name,
      getError(attribute, cleanedInput)
    );
    this.props.setFormValidity(
      this.props.selectedInteraction.interactionId,
      Object.keys(stateUpdate).every((key) => !stateUpdate[key])
    );
  };

  setUnusedValue = (name, newValue) => {
    const attribute = this.props.attributes.find(
      (attr) => attr.objectName === name
    );
    this.props.setUnusedField(
      this.props.selectedInteraction.interactionId,
      name,
      formatValue(attribute, newValue)
    );
  };

  handleInputClear = (event, index) => {
    const targetInputElement = event.target.previousSibling
      ? event.target.previousSibling
      : event.target.parentElement.previousSibling;
    const inputName = targetInputElement.name;
    if (
      index === undefined ||
      this.props.selectedIndexes[inputName] === index
    ) {
      this.setAttributeValue(inputName, '');
    } else {
      this.setUnusedValue(inputName, '');
    }
  };

  handleTopInputClear = (event) => {
    this.handleInputClear(event, 0);
  };

  handleBottomInputClear = (event) => {
    this.handleInputClear(event, 1);
  };

  handleInputChange = (newValue, event, index) => {
    if (
      index === undefined ||
      this.props.selectedIndexes[event.target.name] === index
    ) {
      this.setAttributeValue(event.target.name, newValue);
    } else {
      this.setUnusedValue(event.target.name, newValue);
    }
  };

  handleTopInputChange = (newValue, event) => {
    this.handleInputChange(newValue, event, 0);
  };

  handleBottomInputChange = (newValue, event) => {
    this.handleInputChange(newValue, event, 1);
  };

  generateAttributeRow = (attributeId) => {
    const attribute = this.props.attributes.find(
      (attr) => attr.id === attributeId
    );
    const attributeLabel = `${attribute.label[
      this.props.intl.locale
    ]}${attribute.mandatory ? '*' : ''}`;
    const firstValue =
      this.props.editingContacts[0].attributes[attribute.objectName] || '';
    const secondValue =
      this.props.editingContacts[1].attributes[attribute.objectName] || '';
    if (
      firstValue === secondValue ||
      (firstValue === '' && secondValue !== '') ||
      secondValue === '' ||
      attribute.type === 'boolean'
    ) {
      return (
        <ContactInput
          key={attribute.id}
          attribute={attribute}
          attributeLabel={attributeLabel}
          formInput={this.props.contactForm[attribute.objectName]}
          handleInputChange={this.handleInputChange}
          handleOnBlur={this.handleOnBlur}
          handleInputClear={this.handleInputClear}
          showErrors={this.props.showErrors}
          errors={this.props.formErrors}
          intl={this.props.intl}
        />
      );
    }
    return (
      <div key={attribute.id}>
        <div style={{ display: 'flex' }}>
          <input
            type="radio"
            id={`${attribute.objectName}0`}
            name={attribute.objectName}
            style={styles.radio}
            value={
              this.props.selectedIndexes[attribute.objectName] === 0
                ? this.props.contactForm[attribute.objectName]
                : this.props.unusedFields[attribute.objectName]
            }
            checked={this.props.selectedIndexes[attribute.objectName] === 0}
            onChange={this.selectAttribute}
          />
          <ContactInput
            attribute={attribute}
            attributeLabel={attributeLabel}
            formInput={
              this.props.selectedIndexes[attribute.objectName] === 0
                ? this.props.contactForm[attribute.objectName]
                : this.props.unusedFields[attribute.objectName]
            }
            handleInputChange={this.handleTopInputChange}
            handleOnBlur={this.handleOnBlur}
            handleInputClear={this.handleTopInputClear}
            notSelected={this.props.selectedIndexes[attribute.objectName] !== 0}
            hasRadio
            showErrors={
              this.props.selectedIndexes[attribute.objectName] === 0
                ? this.props.showErrors
                : {}
            }
            errors={this.props.formErrors}
            intl={this.props.intl}
            inputLabelStyle={styles.radioInputLabel}
          />
        </div>
        <div style={{ display: 'flex' }}>
          <input
            type="radio"
            id={`${attribute.objectName}1`}
            name={attribute.objectName}
            style={styles.radio}
            value={
              this.props.selectedIndexes[attribute.objectName] === 1
                ? this.props.contactForm[attribute.objectName]
                : this.props.unusedFields[attribute.objectName]
            }
            checked={this.props.selectedIndexes[attribute.objectName] === 1}
            onChange={this.selectAttribute}
          />
          <ContactInput
            attribute={attribute}
            attributeLabel={attributeLabel}
            formInput={
              this.props.selectedIndexes[attribute.objectName] === 1
                ? this.props.contactForm[attribute.objectName]
                : this.props.unusedFields[attribute.objectName]
            }
            handleInputChange={this.handleBottomInputChange}
            handleOnBlur={this.handleOnBlur}
            handleInputClear={this.handleBottomInputClear}
            notSelected={this.props.selectedIndexes[attribute.objectName] !== 1}
            hasRadio
            showErrors={
              this.props.selectedIndexes[attribute.objectName] === 1
                ? this.props.showErrors
                : {}
            }
            errors={this.props.formErrors}
            intl={this.props.intl}
            inputLabelStyle={styles.radioInputLabel}
          />
        </div>
      </div>
    );
  };

  generateSection = (section) =>
    (<div style={styles.section} key={section.label[this.props.intl.locale]}>
      <ContactSectionHeader label={section.label[this.props.intl.locale]} />
      {section.attributes.map(this.generateAttributeRow)}
    </div>);

  showConfirmDialog = () => {
    this.props.setShowConfirmDialog(true);
  };

  hideConfirmDialog = () => {
    this.props.setShowConfirmDialog(false);
  };

  hideCancelDialog = () => {
    this.props.setShowCancelDialog(false);
  };

  handleCancel = () => {
    this.hideCancelDialog();
    this.props.setNotEditing();
  };

  render() {
    return (
      <div style={styles.base}>
        {this.props.layout.map(this.generateSection)}
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
            rightAction={this.handleCancel}
            isVisible={this.props.showCancelDialog}
            hide={this.hideCancelDialog}
            style={{ position: 'absolute', left: '112px', bottom: '40px' }}
          />
          <Button
            id="contactSaveBtn"
            style={styles.button}
            disabled={!this.props.formIsValid || this.props.loading}
            type="secondary"
            onClick={this.showConfirmDialog}
            text={this.props.intl.formatMessage(messages.saveBtn)}
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

ContactMerge.propTypes = {
  attributes: PropTypes.array,
  intl: intlShape.isRequired,
  layout: PropTypes.array,
  handleCancel: PropTypes.func.isRequired,
  showCancelDialog: PropTypes.bool.isRequired,
  editingContacts: PropTypes.array.isRequired,
  setFormValidity: PropTypes.func,
  contactForm: PropTypes.object,
  setNotEditing: PropTypes.func,
  selectedInteraction: PropTypes.object,
  selectedIndexes: PropTypes.object,
  formErrors: PropTypes.object,
  setSelectedIndex: PropTypes.func,
  setFormError: PropTypes.func,
  setUnusedField: PropTypes.func,
  setFormField: PropTypes.func,
  showErrors: PropTypes.object,
  showConfirmDialog: PropTypes.bool,
  setShowError: PropTypes.func,
  unusedFields: PropTypes.object,
  loading: PropTypes.bool,
  formIsValid: PropTypes.bool,
  setShowCancelDialog: PropTypes.func,
  setShowConfirmDialog: PropTypes.func,
  submitContactMerge: PropTypes.func,
};

function mapStateToProps(state, props) {
  return {
    layout: selectLayout(state, props).toJS().layout,
    attributes: selectAttributes(state, props).toJS(),
    editingContacts: selectEditingContacts(state, props),
    showCancelDialog: selectShowCancelDialog(state, props),
    showConfirmDialog: selectShowConfirmDialog(state, props),
    selectedInteraction: selectCurrentInteraction(state, props),
    formIsValid: selectFormValidity(state, props),
    contactForm: selectContactForm(state, props),
    formErrors: selectFormErrors(state, props),
    showErrors: selectShowErrors(state, props),
    selectedIndexes: selectSelectedIndexes(state, props),
    unusedFields: selectUnusedFields(state, props),
    loading: selectContactSaveLoading(state, props),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setShowCancelDialog: (showCancelDialog) =>
      dispatch(setShowCancelDialog(showCancelDialog)),
    setShowConfirmDialog: (showConfirmDialog) =>
      dispatch(setShowConfirmDialog(showConfirmDialog)),
    setFormValidity: (interactionId, formIsValid) =>
      dispatch(setFormValidity(interactionId, formIsValid)),
    setShowError: (interactionId, field, error) =>
      dispatch(setShowError(interactionId, field, error)),
    setFormField: (interactionId, field, value) =>
      dispatch(setFormField(interactionId, field, value)),
    setFormError: (interactionId, field, error) =>
      dispatch(setFormError(interactionId, field, error)),
    setUnusedField: (interactionId, field, value) =>
      dispatch(setUnusedField(interactionId, field, value)),
    setSelectedIndex: (interactionId, field, index) =>
      dispatch(setSelectedIndex(interactionId, field, index)),
    submitContactMerge: (interactionId) =>
      dispatch(submitContactMerge(interactionId)),
    dispatch,
  };
}

export default ErrorBoundary(
  injectIntl(connect(mapStateToProps, mapDispatchToProps)(Radium(ContactMerge)))
);
