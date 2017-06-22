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

import BaseComponent from 'components/BaseComponent';
import { setCriticalError } from 'containers/Errors/actions';

import IconSVG from 'components/IconSVG';

import ContactEdit from 'containers/ContactEdit';
import ContactMerge from 'containers/ContactMerge';
import ContactSearch from 'containers/ContactSearch';
import ContactView from 'containers/ContactView';

import { showContactsPanel, assignContact, selectContact, loadContactInteractionHistory } from 'containers/AgentDesktop/actions';
import { selectIsContactsPanelCollapsed } from 'containers/AgentDesktop/selectors';
import { selectPopulatedLayout } from 'containers/ContactView/selectors';
import selectInfoTab, { selectCheckedContacts, selectLoading, selectCurrentInteraction } from 'containers/InfoTab/selectors';
import { clearSearchResults, setLoading } from 'containers/InfoTab/actions';

import { selectAttributes, selectShowCancelDialog, selectFormIsDirty, selectContactForm } from './selectors';
import { setShowCancelDialog } from './actions';

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
    const newMode = nextProps.selectedInteraction.contactMode;
    if (newMode !== this.props.selectedInteraction.contactMode) {
      this.props.showContactsPanel();
    }
  }

  handleCancel = (event) => {
    event.preventDefault();
    if (this.props.formIsDirty || this.props.selectedInteraction.contactMode === 'merge') {
      this.props.setShowCancelDialog(true);
    } else {
      this.props.setNotEditing();
    }
  }

  render() {
    let content;
    if (this.props.loading && (this.props.selectedInteraction.contactMode === 'search')) {
      content = (
        <div id="loadingContainer" style={this.styles.loadingContainer}>
          <IconSVG style={this.styles.loadingIcon} id="loadingIcon" name="loading" />
        </div>
      );
    } else {
      switch (this.props.selectedInteraction.contactMode) {
        case 'create':
        case 'edit': {
          const contactId = this.props.editingContact && this.props.editingContact.id;
          content = (<ContactEdit
            setNotEditing={this.props.setNotEditing}
            style={this.styles.mainContact}
            contactId={contactId}
            contact={this.props.editingContact}
            handleCancel={this.handleCancel}
            addNotification={this.props.addNotification}
            contactMode={this.props.selectedInteraction.contactMode}
          />);
          break;
        }
        case 'merge':
          content = (<ContactMerge
            setNotEditing={this.props.setNotEditing}
            style={this.styles.mainContact}
            handleCancel={this.handleCancel}
            addNotification={this.props.addNotification}
          />);
          break;
        case 'view':
          content = (
            this.props.selectedInteraction.contact
              ? (<ContactView
                contact={this.props.selectedInteraction.contact}
                style={this.styles.mainContact}
              />)
              : null
          );
          break;
        case 'search':
        default:
          if (this.props.selectedInteraction.interactionId !== 'creating-new-interaction') {
            content = (<ContactSearch hideContactSelectCheckboxes={this.props.isCollapsed} />);
          } else {
            content = null;
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
  setLoading: PropTypes.func,
  addNotification: PropTypes.func,
  formIsDirty: PropTypes.bool,
  setShowCancelDialog: PropTypes.func,
  setNotEditing: PropTypes.func,
  checkedContacts: PropTypes.array,
  layoutSections: PropTypes.array,
  showContactsPanel: PropTypes.func,
  isCollapsed: PropTypes.bool.isRequired,
};

function mapStateToProps(state, props) {
  return {
    attributes: selectAttributes(state, props),
    selectedInteraction: selectCurrentInteraction(state, props),
    checkedContacts: selectCheckedContacts(state, props),
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
    assignContact: (contact) => dispatch(assignContact(contact)),
    setShowCancelDialog: (showCancelDialog) => dispatch(setShowCancelDialog(showCancelDialog)),
    showContactsPanel: () => dispatch(showContactsPanel()),
    dispatch,
  };
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Radium(ContactsControl)));
