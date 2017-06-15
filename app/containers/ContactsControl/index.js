/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * ContactsControl
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import Radium from 'radium';
import { isValidEmail } from 'utils/validator';
import isURL from 'validator/lib/isURL';
import { PhoneNumberUtil } from 'google-libphonenumber';

import BaseComponent from 'components/BaseComponent';
import { setCriticalError } from 'containers/Errors/actions';

import IconSVG from 'components/IconSVG';

import ContactEdit from 'containers/ContactEdit';
import ContactMerge from 'containers/ContactMerge';
import ContactSearch from 'containers/ContactSearch';
import ContactView from 'containers/ContactView';

import { showContactsPanel, assignContactToSelected, selectContact, loadContactInteractionHistory, setContactAction } from 'containers/AgentDesktop/actions';
import { selectIsContactsPanelCollapsed } from 'containers/AgentDesktop/selectors';
import { selectPopulatedLayout } from 'containers/ContactView/selectors';
import selectInfoTab, { selectCheckedContacts, selectContactMode, selectEditingContact, selectLoading } from 'containers/InfoTab/selectors';
import { clearSearchResults, setLoading } from 'containers/InfoTab/actions';

import { selectCurrentInteraction, selectAttributes, selectShowCancelDialog, selectFormIsDirty, selectContactForm } from './selectors';
import { setShowCancelDialog, setFormField, setFormError, setShowError, setUnusedField, setSelectedIndex } from './actions';

import messages from './messages';

export class ContactsControl extends BaseComponent {

  styles = {
    mainContact: {
      marginTop: '8px',
      paddingRight: '5px',
      alignSelf: 'stretch',
      flexGrow: '1',
      flexShrink: '0',
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      flexGrow: 1,
      paddingTop: '50px',
    },
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.contactMode !== this.props.contactMode) {
      switch (nextProps.contactMode) {
        case 'edit':
          if (!Object.keys(nextProps.editingContact).length) {
            this.hydrateEditForm(nextProps.selectedInteraction.contact);
          } else {
            this.hydrateEditForm(nextProps.editingContact);
          }
          break;
        case 'create':
        default:
          this.hydrateEditForm({});
      }
      this.props.showContactsPanel();
    }
  }

  handleCancel = (event) => {
    event.preventDefault();
    if (this.props.formIsDirty || this.props.contactMode === 'merge') {
      this.props.setShowCancelDialog(true);
    } else {
      this.props.setNotEditing();
    }
  }

  formatValue = (name, value) => {
    const attributeToValidate = this.props.attributes.find((attribute) => attribute.objectName === name);
    let formattedValue;
    switch (attributeToValidate.type) {
      case 'phone':
        formattedValue = value.replace(/[^0-9+*#]/g, '');
        if (formattedValue.indexOf('+') !== 0 && formattedValue.length > 0) {
          formattedValue = `+${formattedValue}`;
        }
        break;
      case 'boolean':
        if (value === 'false' || value === '') formattedValue = false;
        else formattedValue = !!value;
        break;
      default:
        return value;
    }
    return formattedValue;
  }

  phoneNumberUtil = PhoneNumberUtil.getInstance();

  getError = (name, value) => {
    if (!value) return false;
    const attributeToValidate = this.props.attributes.find((attribute) => attribute.objectName === name);
    let error = false;
    if (attributeToValidate.mandatory && (value.length < 1)) {
      error = this.props.intl.formatMessage(messages.errorRequired);
    } else if (value.length) {
      switch (attributeToValidate.type) {
        case 'email':
          if (!isValidEmail(value)) {
            error = this.props.intl.formatMessage(messages.errorEmail);
          }
          break;
        case 'phone':
          try {
            if (!this.phoneNumberUtil.isValidNumber(this.phoneNumberUtil.parse(value, 'E164'))) {
              error = this.props.intl.formatMessage(messages.errorPhone);
            }
          } catch (e) {
            error = this.props.intl.formatMessage(messages.errorPhone);
          }
          break;
        case 'link':
          if (!isURL(value, { protocols: ['http', 'https'], require_protocol: true })) {
            error = this.props.intl.formatMessage(messages.errorLink);
          }
          break;
        case 'number':
          if (isNaN(Number(value))) {
            error = this.props.intl.formatMessage(messages.errorNumber);
          }
          break;
        default:
          break;
      }
    }
    return error;
  }

  hydrateEditForm = (contact) => {
    const contactAttributes = contact.attributes ? contact.attributes : {};
    this.props.layoutSections.forEach((section) => {
      section.attributes.forEach((attribute) => {
        const isExistingValueDefined = (contactAttributes && contactAttributes[attribute.objectName] !== undefined);
        let initialValue = isExistingValueDefined ? contactAttributes[attribute.objectName] : (attribute.default || '');
        initialValue = this.formatValue(attribute.objectName, initialValue);
        this.props.setFormField(attribute.objectName, initialValue);
        this.props.setFormError(attribute.objectName, this.getError(attribute.objectName, initialValue));
        this.props.setShowError(attribute.objectName, false);
      });
    });
  }

  render() {
    let content;
    if (this.props.loading && (this.props.selectedInteraction.contactAction === 'search' && !this.props.contactMode)) {
      content = (
        <div id="loadingContainer" style={this.styles.loadingContainer}>
          <IconSVG style={this.styles.loadingIcon} id="loadingIcon" name="loading" />
        </div>
      );
    } else if (this.props.contactMode === 'edit' || this.props.contactMode === 'create') {
      let contactId;
      if (this.props.contactMode === 'edit') {
        contactId =
          this.props.editingContact.id
          || (
            this.props.selectedInteraction &&
            this.props.selectedInteraction.contact &&
            this.props.selectedInteraction.contact.id
          );
      }
      content = (<ContactEdit
        getError={this.getError}
        formatValue={this.formatValue}
        setNotEditing={this.props.setNotEditing}
        style={this.styles.mainContact}
        contactId={contactId}
        handleCancel={this.handleCancel}
        addNotification={this.props.addNotification}
        assignContact={this.props.assignContact}
      />);
    } else if (this.props.contactMode === 'merge') {
      content = (<ContactMerge
        getError={this.getError}
        formatValue={this.formatValue}
        setNotEditing={this.props.setNotEditing}
        style={this.styles.mainContact}
        handleCancel={this.handleCancel}
        addNotification={this.props.addNotification}
        assignContact={this.props.assignContact}
      />);
    } else {
      switch (this.props.selectedInteraction.contactAction) {
        case 'view':
          content = (<ContactView
            contact={this.props.selectedInteraction.contact ? this.props.selectedInteraction.contact : this.props.editingContact}
            assignContact={this.props.assignContact}
            style={this.styles.mainContact}
          />);
          break;
        case 'search':
        default: {
          if (this.props.selectedInteraction.interactionId !== 'creating-new-interaction') {
            content = (<ContactSearch
              hideContactSelectCheckboxes={this.props.isCollapsed}
            />);
          } else {
            content = null;
          }
        }
      }
    }
    return content;
  }
}

ContactsControl.propTypes = {
  attributes: PropTypes.array.isRequired,
  selectedInteraction: PropTypes.object.isRequired,
  intl: PropTypes.object.isRequired,
  results: PropTypes.any,
  resultsCount: PropTypes.number,
  loading: PropTypes.bool.isRequired,
  setSearchResults: PropTypes.func,
  clearSearchResults: PropTypes.func,
  checkContact: PropTypes.func,
  uncheckContact: PropTypes.func,
  selectContact: PropTypes.func,
  loadContactInteractionHistory: PropTypes.func,
  assignContact: PropTypes.func,
  contactMode: PropTypes.string,
  editingContact: PropTypes.object,
  setLoading: PropTypes.func,
  addNotification: PropTypes.func,
  formIsDirty: PropTypes.bool,
  setShowCancelDialog: PropTypes.func,
  setNotEditing: PropTypes.func,
  checkedContacts: PropTypes.array,
  layoutSections: PropTypes.array,
  setFormField: PropTypes.func,
  setFormError: PropTypes.func,
  setUnusedField: PropTypes.func,
  setSelectedIndex: PropTypes.func,
  setShowError: PropTypes.func,
  setContactAction: PropTypes.func,
  showContactsPanel: PropTypes.func,
  isCollapsed: PropTypes.bool.isRequired,
};

function mapStateToProps(state, props) {
  return {
    attributes: selectAttributes(state, props),
    selectedInteraction: selectCurrentInteraction(state, props),
    checkedContacts: selectCheckedContacts(state, props),
    contactMode: selectContactMode(state, props),
    editingContact: selectEditingContact(state, props),
    loading: selectLoading(state, props),
    showCancelDialog: selectShowCancelDialog(state, props),
    formIsDirty: selectFormIsDirty(state, props),
    contactForm: selectContactForm(state, props),
    layoutSections: selectPopulatedLayout(state, props),
    isCollapsed: selectIsContactsPanelCollapsed(state, props),
    ...selectInfoTab(state, props),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setCriticalError: () => dispatch(setCriticalError()),
    clearSearchResults: () => dispatch(clearSearchResults()),
    setLoading: (loading) => dispatch(setLoading(loading)),
    selectContact: (contact) => dispatch(selectContact(contact)),
    setContactAction: (interactionId, action) => dispatch(setContactAction(interactionId, action)),
    loadContactInteractionHistory: (contactId, page) => dispatch(loadContactInteractionHistory(contactId, page)),
    assignContact: (contact) => dispatch(assignContactToSelected(contact)),
    setShowCancelDialog: (showCancelDialog) => dispatch(setShowCancelDialog(showCancelDialog)),
    setFormField: (field, value) => dispatch(setFormField(field, value)),
    setFormError: (field, error) => dispatch(setFormError(field, error)),
    setShowError: (field, error) => dispatch(setShowError(field, error)),
    setUnusedField: (field, value) => dispatch(setUnusedField(field, value)),
    setSelectedIndex: (field, index) => dispatch(setSelectedIndex(field, index)),
    showContactsPanel: () => dispatch(showContactsPanel()),
    dispatch,
  };
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Radium(ContactsControl)));
