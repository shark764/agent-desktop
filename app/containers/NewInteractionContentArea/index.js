/*
 *
 * NewInteractionContentArea
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Radium from 'radium';

import BaseComponent from 'components/BaseComponent';
import { setCriticalError } from 'containers/Errors/actions';

import { selectHasVoiceInteraction, selectSmsInteractionNumbers } from 'containers/AgentDesktop/selectors';
import { startOutboundInteraction, newInteractionPanelSelectContact, closeNewInteractionPanel, showContactsPanel } from 'containers/AgentDesktop/actions';

import SearchBar from './SearchBar';
import Results from './Results';

const styles = {
  base: {
    backgroundColor: '#FFFFFF',
    height: '100%',
  },
};

export class NewInteractionContentArea extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: undefined,
    };
  }

  searchContacts = (searchTerm) => {
    this.setState({ searchResults: 'loading' });
    this.props.newInteractionPanelSelectContact(undefined);
    CxEngage.contacts.search({ query: { q: encodeURIComponent(`"${searchTerm}"`) } }, (error, topic, response) => {
      if (error) {
        this.setState({ searchResults: 'error' });
      } else {
        console.log('[NewInteractionContentArea] CxEngage.subscribe()', topic, response);
        // Set the search term as the result if there are no results so we can use it as the number to dial/SMS
        this.setState({ searchResults: response.results.length === 0 ? searchTerm : response.results });
        // Auto select if there is only one result
        if (response.results.length === 1) {
          this.selectContact(response.results[0]);
        }
      }
    });
  }

  selectContact = (contact) => {
    this.props.newInteractionPanelSelectContact(contact);
    this.props.showContactsPanel();
  }

  startCall = () => {
    if (!this.props.hasVoiceInteraction) {
      this.props.startOutboundInteraction('voice', this.state.searchResults, undefined, true);
      CxEngage.interactions.voice.dial({ phoneNumber: this.state.searchResults });
    }
  }

  startSms = () => {
    if (!this.props.smsInteractionNumbers.includes(this.state.searchResults)) {
      this.props.startOutboundInteraction('sms', this.state.searchResults, undefined, true);
    }
  }

  render() {
    return (
      <div style={styles.base}>
        <SearchBar
          searchContacts={this.searchContacts}
          closeNewInteractionPanel={this.props.closeNewInteractionPanel}
        />
        <Results
          searchResults={this.state.searchResults}
          selectContact={this.selectContact}
          hasVoiceInteraction={this.props.hasVoiceInteraction}
          smsInteractionNumbers={this.props.smsInteractionNumbers}
          startCall={this.startCall}
          startSms={this.startSms}
        />
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  hasVoiceInteraction: selectHasVoiceInteraction(state, props),
  smsInteractionNumbers: selectSmsInteractionNumbers(state, props),
});

function mapDispatchToProps(dispatch) {
  return {
    setCriticalError: () => dispatch(setCriticalError()),
    startOutboundInteraction: (channelType, customer, contact, addedByNewInteractionPanel) => dispatch(startOutboundInteraction(channelType, customer, contact, addedByNewInteractionPanel)),
    newInteractionPanelSelectContact: (contact) => dispatch(newInteractionPanelSelectContact(contact)),
    closeNewInteractionPanel: () => dispatch(closeNewInteractionPanel()),
    showContactsPanel: () => dispatch(showContactsPanel()),
    dispatch,
  };
}

NewInteractionContentArea.propTypes = {
  showContactsPanel: PropTypes.func.isRequired,
  hasVoiceInteraction: PropTypes.bool.isRequired,
  smsInteractionNumbers: PropTypes.array.isRequired,
  setCriticalError: PropTypes.func.isRequired,
  startOutboundInteraction: PropTypes.func.isRequired,
  newInteractionPanelSelectContact: PropTypes.func.isRequired,
  closeNewInteractionPanel: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Radium(NewInteractionContentArea));
