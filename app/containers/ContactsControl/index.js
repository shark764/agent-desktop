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
import PropTypes from 'prop-types';
import Radium from 'radium';

import ErrorBoundary from 'components/ErrorBoundary';

import IconSVG from 'components/IconSVG';

import ContactEdit from 'containers/ContactEdit';
import ContactMerge from 'containers/ContactMerge';
import ContactSearch from 'containers/ContactSearch';
import ContactView from 'containers/ContactView';

import { selectIsSidePanelCollapsed } from 'containers/AgentDesktop/selectors';
import selectInfoTab, {
  selectLoading,
  selectCurrentInteraction,
} from 'containers/InfoTab/selectors';

import { selectShowCancelDialog, selectFormIsDirty } from './selectors';
import { setShowCancelDialog } from './actions';

export class ContactsControl extends React.Component {
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

  handleCancel = (event) => {
    event.preventDefault();
    if (
      this.props.formIsDirty ||
      this.props.selectedInteraction.contactMode === 'merge'
    ) {
      this.props.setShowCancelDialog(true);
    } else {
      this.props.setNotEditing();
    }
  };

  render() {
    let content;
    if (
      this.props.loading &&
      this.props.selectedInteraction.contactMode === 'search'
    ) {
      content = (
        <div id="loadingContainer" style={this.styles.loadingContainer}>
          <IconSVG id="loadingIcon" name="loading" width="80px" />
        </div>
      );
    } else {
      switch (this.props.selectedInteraction.contactMode) {
        case 'create':
        case 'edit': {
          content = (
            <ContactEdit
              setNotEditing={this.props.setNotEditing}
              style={this.styles.mainContact}
              handleCancel={this.handleCancel}
              addNotification={this.props.addNotification}
              contactMode={this.props.selectedInteraction.contactMode}
            />
          );
          break;
        }
        case 'merge':
          content = (
            <ContactMerge
              setNotEditing={this.props.setNotEditing}
              style={this.styles.mainContact}
              handleCancel={this.handleCancel}
              addNotification={this.props.addNotification}
            />
          );
          break;
        case 'view':
          content =
            this.props.selectedInteraction.contact &&
            this.props.selectedInteraction.contact.id
              ? (<ContactView
                contact={this.props.selectedInteraction.contact}
                style={this.styles.mainContact}
              />)
              : null;
          break;
        case 'search':
        default:
          if (
            this.props.selectedInteraction.interactionId !==
            'creating-new-interaction'
          ) {
            content = (
              <ContactSearch
                hideContactSelectCheckboxes={this.props.isCollapsed}
              />
            );
          } else {
            content = null;
          }
      }
    }
    return content;
  }
}

ContactsControl.propTypes = {
  selectedInteraction: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  addNotification: PropTypes.func,
  formIsDirty: PropTypes.bool,
  setShowCancelDialog: PropTypes.func,
  setNotEditing: PropTypes.func,
  isCollapsed: PropTypes.bool.isRequired,
};

function mapStateToProps(state, props) {
  return {
    selectedInteraction: selectCurrentInteraction(state, props),
    loading: selectLoading(state, props),
    showCancelDialog: selectShowCancelDialog(state, props),
    formIsDirty: selectFormIsDirty(state, props),
    isCollapsed: selectIsSidePanelCollapsed(state, props),
    ...selectInfoTab(state, props),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setShowCancelDialog: (showCancelDialog) =>
      dispatch(setShowCancelDialog(showCancelDialog)),
    dispatch,
  };
}

export default ErrorBoundary(
  connect(mapStateToProps, mapDispatchToProps)(Radium(ContactsControl))
);
