/*
 *
 * ContactsControl
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import Radium from 'radium';
import { isValidEmail } from 'utils/validator';
import isURL from 'validator/lib/isURL';
import { PhoneNumberUtil } from 'google-libphonenumber';
import InfiniteScroll from 'react-infinite-scroller';

import BaseComponent from 'components/BaseComponent';
import { setCriticalError } from 'containers/Errors/actions';

import Button from 'components/Button';
import Icon from 'components/Icon';
import IconSVG from 'components/IconSVG';
import Contact from 'containers/Contact';
import ContactMerge from 'containers/ContactMerge';
import ContactSearchResult from 'containers/ContactSearchResult';

import { assignContact, selectContact, loadContactInteractionHistory } from 'containers/AgentDesktop/actions';
import { selectPopulatedLayout } from 'containers/Contact/selectors';
import selectInfoTab, { selectCheckedContacts, selectContactMode, selectUnassignedContact, selectLoading, selectDeletionPending } from 'containers/InfoTab/selectors';
import { setSearchResults, clearSearchResults, checkContact, uncheckContact, setLoading, setDeletionPending } from 'containers/InfoTab/actions';

import { selectCurrentInteraction, selectAttributes, selectShowCancelDialog, selectFormIsDirty, selectContactForm } from './selectors';
import { setShowCancelDialog, setFormField, setFormError, setShowError, setUnusedField, setSelectedIndex } from './actions';
import messages from './messages';

const resultsPlaceholderWidth = 330;

export class ContactsControl extends BaseComponent {

  styles = {
    mainContact: {
      marginTop: '8px',
      paddingRight: '5px',
      alignSelf: 'stretch',
      flexGrow: '1',
      flexShrink: '0',
    },
    contactResult: {
      marginBottom: '14px',
      alignSelf: 'stretch',
      flex: '1',
      flexGrow: '1',
      flexShrink: '1',
      marginLeft: '52px',
    },
    resultsPlaceholder: {
      color: '#979797',
      display: 'flex',
      marginTop: '150px',
      flexDirection: 'column',
      alignItems: 'center',
      flex: '1',
    },
    resultsPlaceholderBold: {
      paddingLeft: '15px',
      fontWeight: 'bold',
      alignItems: 'center',
    },
    filtersListText: {
      textAlign: 'center',
    },
    resultsPlaceholderTitle: {
      paddingBottom: '8px',
      display: 'flex',
      alignItems: 'center',
    },
    filtersList: {
      textAlign: 'center',
      maxWidth: `${resultsPlaceholderWidth}px`,
    },
    loading: {
      display: 'flex',
      justifyContent: 'center',
    },
    loadingIcon: {
      height: '60px',
    },
    infiniteScroll: {
      flex: '1',
    },
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.contactMode === 'editing' && this.props.contactMode !== 'editing') {
      if (nextProps.selectedInteraction.contactAction === 'view' && nextProps.selectedInteraction.contact) {
        this.hydrateEditForm(nextProps.selectedInteraction.contact);
      } else {
        this.hydrateEditForm(nextProps.unassignedContact);
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
            this.props.assignContact(this.props.selectedInteraction.interactionId);
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

  searchContacts = () => {
    if (!this.props.loading || this.props.deletionPending) {
      this.props.setLoading(true);
      this.props.setDeletionPending(false);
      const encodedQuery = {};
      Object.keys(this.props.selectedInteraction.query).forEach((queryName) => {
        const queryToEncode = this.props.selectedInteraction.query[queryName];
        const queryNoQuotes = queryToEncode.replace(/"/g, '');
        let finalQuery = queryNoQuotes;

        // here we are looking for queries that either start and end with double-quotes,
        // or are telephone queries. If they are either, then put double quotes around
        // them so that the sdk does an exact string match instead of the default partial match
        if (/^".*"$/.test(queryToEncode) || queryName === 'phone') {
          finalQuery = `"${queryNoQuotes}"`;
        }

        encodedQuery[queryName] = encodeURIComponent(finalQuery);
      });
      CxEngage.contacts.search({ query: Object.assign(encodedQuery, { page: this.props.nextPage }) }, (error, topic, response) => {
        console.log('[ContactsControl] CxEngage.subscribe()', topic, response);
        this.props.setSearchResults(response);
        this.props.setLoading(false);
      });
    }
  }

  handleCancel = (event) => {
    event.preventDefault();
    if (this.props.formIsDirty || this.props.contactMode === 'merging') {
      this.props.setShowCancelDialog(true);
    } else {
      this.props.setNotEditing();
    }
  }

  getLoader = () =>
    <div id="loadingContainer" style={this.styles.loading}>
      <IconSVG style={this.styles.loadingIcon} id="loadingIcon" name="loading" />
    </div>

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

  renderResults = () => {
    let results;
    if (this.props.selectedInteraction.query && Object.keys(this.props.selectedInteraction.query).length) {
      const resultsMapped = !this.props.deletionPending && this.props.results.map(
        (contact, index) => {
          const isSelected = this.props.checkedContacts.find((checkedContact) => checkedContact.id === contact.id);
          return (<ContactSearchResult
            getError={this.getError}
            formatValue={this.formatValue}
            isCollapsed={this.props.isCollapsed}
            checked={!!isSelected}
            style={this.styles.contactResult}
            selectContact={(isChecked) => {
              if (isChecked) {
                this.props.checkContact(contact);
              } else {
                this.props.uncheckContact(contact);
              }
            }}
            key={contact.id}
            id={`contactSearchResult-${index}`}
            isAssigned={this.props.selectedInteraction.contact && this.props.selectedInteraction.contact.id === contact.id}
            contact={contact}
            assignContact={this.handleContactAssign}
            loading={this.props.loading}
          />);
        });
      results = (
        <InfiniteScroll
          key="infinite-scroll"
          loadMore={this.searchContacts}
          hasMore={this.props.resultsCount === -1 || this.props.results.length < this.props.resultsCount}
          loader={this.getLoader()}
          useWindow={false}
          style={this.styles.infiniteScroll}
        >
          { resultsMapped }
        </InfiniteScroll>
      );
    } else if (this.props.resultsCount < 1 && !this.props.loading) {
      results = (
        <div key="results-placeholder" id="results-placeholder" style={this.styles.resultsPlaceholder}>
          <div style={this.styles.resultsPlaceholderTitle}>
            <Icon name="search" />
            <div style={this.styles.resultsPlaceholderBold}>
              <FormattedMessage {...messages.searchText} />
            </div>
          </div>
          <div style={this.styles.filtersList}>
            <FormattedMessage {...messages.filtersList} />
          </div>
          <div style={{ margin: '5px 0' }}>
            <FormattedMessage {...messages.or} />
          </div>
          <Button id="createNewRecord" type="secondary" text="Create New Record" onClick={this.props.newContact}></Button>
        </div>
      );
    }
    return results;
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
    switch (this.props.selectedInteraction.contactAction) {
      case 'view':
        if (this.props.selectedInteraction.contact) {
          content = Object.keys(this.props.selectedInteraction.contact).length ?
            (<Contact
              getError={this.getError}
              formatValue={this.formatValue}
              key={this.props.selectedInteraction.contact.id}
              style={this.styles.mainContact}
              isAssigned
              contact={this.props.selectedInteraction.contact}
              setNotEditing={this.props.setNotEditing}
              handleCancel={this.handleCancel}
              isEditing={this.props.contactMode === 'editing'}
              addNotification={this.props.addNotification}
              assignContact={this.handleContactAssign}
            />)
          :
          '';
        } else {
          content = (<Contact
            getError={this.getError}
            formatValue={this.formatValue}
            key={this.props.unassignedContact}
            style={this.styles.mainContact}
            isAssigned
            contact={this.props.unassignedContact}
            setNotEditing={this.props.setNotEditing}
            handleCancel={this.handleCancel}
            isEditing={this.props.contactMode === 'editing'}
            addNotification={this.props.addNotification}
            assignContact={this.handleContactAssign}
          />);
        }
        break;
      case 'search':
      default:
        if (this.props.contactMode === 'editing') {
          content = (<Contact
            getError={this.getError}
            formatValue={this.formatValue}
            key={this.props.unassignedContact.id}
            setNotEditing={this.props.setNotEditing}
            style={this.styles.mainContact}
            isEditing
            contact={this.props.unassignedContact}
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
          content = this.renderResults();
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
  isCollapsed: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  setSearchResults: PropTypes.func,
  clearSearchResults: PropTypes.func,
  checkContact: PropTypes.func,
  uncheckContact: PropTypes.func,
  selectContact: PropTypes.func,
  loadContactInteractionHistory: PropTypes.func,
  assignContact: PropTypes.func,
  contactMode: PropTypes.string,
  unassignedContact: PropTypes.object,
  setLoading: PropTypes.func,
  addNotification: PropTypes.func,
  deletionPending: PropTypes.bool,
  setDeletionPending: PropTypes.func,
  nextPage: PropTypes.number,
  formIsDirty: PropTypes.bool,
  setShowCancelDialog: PropTypes.func,
  setNotEditing: PropTypes.func,
  checkedContacts: PropTypes.array,
  newContact: PropTypes.func,
  layoutSections: PropTypes.array,
  setFormField: PropTypes.func,
  setFormError: PropTypes.func,
  setUnusedField: PropTypes.func,
  setSelectedIndex: PropTypes.func,
  setShowError: PropTypes.func,
};

function mapStateToProps(state, props) {
  return {
    attributes: selectAttributes(state, props),
    selectedInteraction: selectCurrentInteraction(state, props),
    checkedContacts: selectCheckedContacts(state, props),
    contactMode: selectContactMode(state, props),
    unassignedContact: selectUnassignedContact(state, props),
    loading: selectLoading(state, props),
    deletionPending: selectDeletionPending(state, props),
    showCancelDialog: selectShowCancelDialog(state, props),
    formIsDirty: selectFormIsDirty(state, props),
    contactForm: selectContactForm(state, props),
    layoutSections: selectPopulatedLayout(state, props),
    ...selectInfoTab(state, props),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setCriticalError: () => dispatch(setCriticalError()),
    setSearchResults: (filter) => dispatch(setSearchResults(filter)),
    clearSearchResults: () => dispatch(clearSearchResults()),
    checkContact: (contact) => dispatch(checkContact(contact)),
    uncheckContact: (contact) => dispatch(uncheckContact(contact)),
    setLoading: (loading) => dispatch(setLoading(loading)),
    setDeletionPending: (deletionPending) => dispatch(setDeletionPending(deletionPending)),
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
