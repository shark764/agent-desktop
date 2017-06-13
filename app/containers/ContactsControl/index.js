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

import { assignContact, selectContact, loadContactInteractionHistory } from 'containers/AgentDesktop/actions';
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
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.contactMode === 'editing' && this.props.contactMode !== 'editing') {
      if (nextProps.selectedInteraction.contactAction === 'view' && nextProps.selectedInteraction.contact) {
        this.hydrateEditForm(nextProps.selectedInteraction.contact);
      } else {
        this.hydrateEditForm(nextProps.editingContact);
      }
    } else if (nextProps.contactMode === 'merging' && this.props.contactMode !== 'merging') {
      this.hydrateMergeForm();
    }
  }

  unassignCurrentContact = (callback) => {
    CxEngage.interactions.unassignContact({
      interactionId: this.props.selectedInteraction.interactionId,
      contactId: this.props.selectedInteraction.contact.id,
    }, (error, response, topic) => {
      this.props.setLoading(false);
      console.log('[ContactsControl] CxEngage.subscribe()', topic, response);
      callback(error);
    });
  }

  handleContactAssign = (contact, callback) => {
    if (!this.props.selectedInteraction.interactionId) {
      this.props.selectContact(contact);
      if (typeof callback === 'function') callback();
      this.props.loadContactInteractionHistory(contact.id);
    } else {
      this.props.setLoading(true);
      const handleError = (error) => {
        this.props.addNotification('notAssigned', true, 'serverError'); // TODO: when errors are ready, get error from response?
        console.error(error);
      };
      if (this.props.selectedInteraction.contact !== undefined) {
        this.unassignCurrentContact((unassignError) => {
          if (unassignError) {
            this.props.setLoading(false);
            handleError(unassignError);
            if (typeof callback === 'function') callback();
          } else {
            this.assignContactToSelected(contact, (assignError) => {
              if (assignError) {
                handleError(assignError);
              }
              this.props.setLoading(false);
              if (typeof callback === 'function') callback();
            });
          }
        });
      } else {
        this.assignContactToSelected(contact, (assignError) => {
          if (assignError) {
            handleError(assignError);
          }
          this.props.setLoading(false);
          if (typeof callback === 'function') callback();
        });
      }
    }
  }

  assignContactToSelected = (contact, callback) => {
    CxEngage.interactions.assignContact({
      interactionId: this.props.selectedInteraction.interactionId,
      contactId: contact.id,
    }, (error, topic, response) => {
      this.props.setLoading(false);
      console.log('[ContactsControl] CxEngage.subscribe()', topic, response);
      if (error) {
        callback(error);
      } else {
        this.props.loadContactInteractionHistory(contact.id);
        this.props.clearSearchResults();
        this.props.assignContact(this.props.selectedInteraction.interactionId, contact);
        callback();
      }
    });
  }

  handleCancel = (event) => {
    event.preventDefault();
    if (this.props.formIsDirty || this.props.contactMode === 'merging') {
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

  hydrateMergeForm = () => {
    const firstContact = this.props.checkedContacts[0].attributes;
    const secondContact = this.props.checkedContacts[1].attributes;
    Object.keys(firstContact).forEach((attributeName) => {
      if (firstContact[attributeName] === undefined || firstContact[attributeName] === '') {
        this.props.setFormField(attributeName, secondContact[attributeName]);
        this.props.setFormError(attributeName, this.getError(attributeName, secondContact[attributeName]));
      } else {
        this.props.setFormField(attributeName, firstContact[attributeName]);
        this.props.setFormError(attributeName, this.getError(attributeName, firstContact[attributeName]));

        if (secondContact[attributeName] !== undefined && secondContact[attributeName] !== '') {
          this.props.setUnusedField(attributeName, secondContact[attributeName]);
          this.props.setSelectedIndex(attributeName, 0);
        }
      }
      this.props.setShowError(attributeName, false);
    });
  }

  render() {
    let content;
    if (this.props.loading && (this.props.contactMode === 'editing' || this.props.contactMode === 'merging' || this.props.selectedInteraction.contactAction === 'view')) {
      content = (
        <div id="loadingContainer" style={this.styles.loading}>
          <IconSVG style={this.styles.loadingIcon} id="loadingIcon" name="loading" />
        </div>
      );
    } else if (this.props.contactMode === 'editing') {
      content = (<ContactEdit
        getError={this.getError}
        formatValue={this.formatValue}
        setNotEditing={this.props.setNotEditing}
        style={this.styles.mainContact}
        contact={this.props.editingContact}
        handleCancel={this.handleCancel}
        addNotification={this.props.addNotification}
        assignContact={this.handleContactAssign}
      />);
    } else if (this.props.contactMode === 'merging') {
      content = (<ContactMerge
        getError={this.getError}
        formatValue={this.formatValue}
        setNotEditing={this.props.setNotEditing}
        style={this.styles.mainContact}
        handleCancel={this.handleCancel}
        addNotification={this.props.addNotification}
        assignContact={this.handleContactAssign}
      />);
    } else {
      switch (this.props.selectedInteraction.contactAction) {
        case 'view':
          content = (<ContactView
            contact={this.props.selectedInteraction.contact ? this.props.selectedInteraction.contact : this.props.editingContact}
            assignContact={this.handleContactAssign}
            style={this.styles.mainContact}
          />);
          break;
        case 'search':
        default: {
          if (this.props.selectedInteraction.interactionId !== 'creating-new-interaction') {
            content = (<ContactSearch hideContactSelectCheckboxes={this.props.isCollapsed} />);
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
    loadContactInteractionHistory: (contactId, page) => dispatch(loadContactInteractionHistory(contactId, page)),
    assignContact: (interactionId, contact) => dispatch(assignContact(interactionId, contact)),
    setShowCancelDialog: (showCancelDialog) => dispatch(setShowCancelDialog(showCancelDialog)),
    setFormField: (field, value) => dispatch(setFormField(field, value)),
    setFormError: (field, error) => dispatch(setFormError(field, error)),
    setShowError: (field, error) => dispatch(setShowError(field, error)),
    setUnusedField: (field, value) => dispatch(setUnusedField(field, value)),
    setSelectedIndex: (field, index) => dispatch(setSelectedIndex(field, index)),
    dispatch,
  };
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Radium(ContactsControl)));
