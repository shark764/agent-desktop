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

import ErrorBoundary from 'components/ErrorBoundary';

import {
  setFormIsDirty,
  setFormValidity,
  setShowError,
  setFormField,
  setFormError,
} from 'containers/AgentDesktop/actions';
import { getSelectedInteractionId } from 'containers/AgentDesktop/selectors';
import {
  selectShowCancelDialog,
  selectFormIsDirty,
  selectFormValidity,
  selectContactForm,
  selectFormErrors,
  selectShowErrors,
  selectContactSaveLoading,
} from 'containers/ContactsControl/selectors';
import {
  setShowCancelDialog,
  submitContactCreate,
  submitContactEdit,
} from 'containers/ContactsControl/actions';

import ContactSectionHeader from 'components/ContactSectionHeader';
import ContactInput from 'components/ContactInput';
import Button from 'components/Button';
import ConfirmDialog from 'components/ConfirmDialog';
import { formatValue, getError, getLocaleLabel } from 'utils/contact';

import { selectPopulatedLayout } from 'containers/ContactView/selectors';
import { selectAttributes } from 'containers/ContactSearchBar/selectors';
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
  section: {
    marginBottom: '28px',
  },
  button: {
    float: 'left',
    marginRight: '10px',
  },
};

export class ContactEdit extends React.Component {
  handleInputChange = (newValue, event) => {
    this.props.setFormIsDirty(this.props.selectedInteractionId, true);
    this.setAttributeValue(event.target.name, newValue);
  };

  handleInputClear = (event) => {
    const targetInputElement = event.target.previousSibling
      ? event.target.previousSibling
      : event.target.parentElement.previousSibling;
    const inputName = targetInputElement.name;
    this.props.setFormIsDirty(this.props.selectedInteractionId, true);
    this.setAttributeValue(inputName, '');
  };

  showError = (name) => {
    if (!this.props.showErrors[name]) {
      this.props.setShowError(this.props.selectedInteractionId, name, true);
    }
  };

  handleOnBlur = (event) => {
    this.props.setFormValidity(
      this.props.selectedInteractionId,
      Object.keys(this.props.formErrors).every(
        (key) => !this.props.formErrors[key]
      )
    );
    this.showError(event.target.name);
  };

  handleSave = () => {
    switch (this.props.contactMode) {
      case 'create':
        this.props.submitContactCreate(this.props.selectedInteractionId);
        break;
      case 'edit':
      default:
        this.props.submitContactEdit(this.props.selectedInteractionId);
        break;
    }
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
      this.props.selectedInteractionId,
      name,
      cleanedInput
    );
    this.props.setFormError(this.props.selectedInteractionId, name, newError);
    this.props.setFormValidity(
      this.props.selectedInteractionId,
      Object.keys(stateUpdate).every((key) => !stateUpdate[key])
    );
  };

  getSection = (section, index) =>
    (<div
      style={styles.section}
      key={section.label[this.props.intl.locale] || index}
    >
      <ContactSectionHeader
        label={getLocaleLabel(section, this.props.intl.locale)}
      />
      {section.attributes.map(this.getAttributeRow)}
    </div>);

  getAttributeRow = (attribute) => {
    const attributeLabel = `${getLocaleLabel(
      attribute,
      this.props.intl.locale
    )}${attribute.mandatory ? '*' : ''}`;
    return (
      <ContactInput
        key={attribute.id}
        handleInputChange={this.handleInputChange}
        handleOnBlur={this.handleOnBlur}
        handleInputClear={this.handleInputClear}
        attribute={attribute}
        attributeLabel={attributeLabel}
        intl={this.props.intl}
        showErrors={this.props.showErrors}
        errors={this.props.formErrors}
        formInput={this.props.contactForm[attribute.objectName]}
      />
    );
  };

  render() {
    return (
      <div style={[this.props.style, styles.base]}>
        {this.props.layoutSections.map(this.getSection)}
        <div style={{ marginBottom: '28px', position: 'relative' }}>
          <ConfirmDialog
            questionMessage={messages.abandonChanges}
            leftAction={() => this.props.setShowCancelDialog(false)}
            rightAction={this.props.setNotEditing}
            isVisible={this.props.showCancelDialog}
            hide={() => this.props.setShowCancelDialog(false)}
            style={{
              position: 'absolute',
              left: this.props.contactMode === 'edit' ? '112px' : '64px',
              bottom: '40px',
            }}
          />
          <Button
            id="contactSaveBtn"
            style={styles.button}
            disabled={
              this.props.loading ||
              !this.props.formIsValid ||
              !this.props.formIsDirty
            }
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
  layoutSections: selectPopulatedLayout(state, props),
  showCancelDialog: selectShowCancelDialog(state, props),
  formIsDirty: selectFormIsDirty(state, props),
  formIsValid: selectFormValidity(state, props),
  contactForm: selectContactForm(state, props),
  formErrors: selectFormErrors(state, props),
  showErrors: selectShowErrors(state, props),
  loading: selectContactSaveLoading(state, props),
  attributes: selectAttributes(state, props).toJS(),
  selectedInteractionId: getSelectedInteractionId(state, props),
});

function mapDispatchToProps(dispatch) {
  return {
    setShowCancelDialog: (showCancelDialog) =>
      dispatch(setShowCancelDialog(showCancelDialog)),
    setFormIsDirty: (interactionId, formIsDirty) =>
      dispatch(setFormIsDirty(interactionId, formIsDirty)),
    setFormValidity: (interactionId, formIsValid) =>
      dispatch(setFormValidity(interactionId, formIsValid)),
    setShowError: (interactionId, field, error) =>
      dispatch(setShowError(interactionId, field, error)),
    setFormField: (interactionId, field, value) =>
      dispatch(setFormField(interactionId, field, value)),
    setFormError: (interactionId, field, error) =>
      dispatch(setFormError(interactionId, field, error)),
    submitContactCreate: (interactionId) =>
      dispatch(submitContactCreate(interactionId)),
    submitContactEdit: (interactionId) =>
      dispatch(submitContactEdit(interactionId)),
    dispatch,
  };
}

ContactEdit.propTypes = {
  layoutSections: PropTypes.array,
  attributes: PropTypes.array,
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
  contactForm: PropTypes.object,
  setNotEditing: PropTypes.func,
  setFormField: PropTypes.func,
  setFormError: PropTypes.func,
  setShowCancelDialog: PropTypes.func,
  formIsValid: PropTypes.bool,
  formIsDirty: PropTypes.bool,
  submitContactCreate: PropTypes.func,
  submitContactEdit: PropTypes.func,
  contactMode: PropTypes.string,
  selectedInteractionId: PropTypes.string,
};

export default ErrorBoundary(
  injectIntl(connect(mapStateToProps, mapDispatchToProps)(Radium(ContactEdit)))
);
