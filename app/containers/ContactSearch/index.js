import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Radium from 'radium';
import InfiniteScroll from 'react-infinite-scroller';

import BaseComponent from 'components/BaseComponent';
import { setCriticalError } from 'containers/Errors/actions';

import Button from 'components/Button';
import ContactBulkActions from 'components/ContactBulkActions';
import Filter from 'components/Filter';
import Icon from 'components/Icon';
import IconSVG from 'components/IconSVG';

import ContactSearchBar from 'containers/ContactSearchBar';
import ContactSearchResult from 'containers/ContactSearchResult';

import { removeSearchFilter, deleteContacts, setSidePanelTabIndex } from 'containers/AgentDesktop/actions';
import { getSelectedInteraction } from 'containers/SidePanel/selectors';
import { resetForm } from 'containers/ContactsControl/actions';
import { selectResults, selectResultsCount, selectNextPage, selectCheckedContacts, selectLoading, selectConfirmingDelete, selectDeletionPending, selectExpandedQuery, selectContactMode } from 'containers/InfoTab/selectors';
import { setSearchResults, checkContact, uncheckContact, newContact, setLoading, setConfirmingDelete, setContactMode, clearSearchResults, clearCheckedContacts } from 'containers/InfoTab/actions';

import messages from './messages';
import NoRecords from './NoRecords';

const styles = {
  base: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  controlHeader: {
    minHeight: '70px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    flexShrink: '0',
    paddingLeft: '54px',
  },
  contactSearchBar: {
    paddingTop: '19px',
  },
  filtersWrapper: {
    minHeight: '65px',
    display: 'flex',
    padding: '11.5px 0',
    overflowX: 'auto',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  filter: {
    margin: '5px 5px 5px 0',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
  },
  loadingIcon: {
    height: '60px',
  },
  contactResult: {
    marginBottom: '14px',
    alignSelf: 'stretch',
    flex: '1',
    flexGrow: '1',
    flexShrink: '1',
    marginLeft: '52px',
  },
  infiniteScrollContainer: {
    flex: '1 1 auto',
    overflowY: 'auto',
  },
  resultsPlaceholder: {
    color: '#979797',
    display: 'flex',
    marginTop: '150px',
    marginLeft: '52px',
    flexDirection: 'column',
    alignItems: 'center',
    flex: '1',
  },
  resultsPlaceholderTitle: {
    paddingBottom: '8px',
    display: 'flex',
    alignItems: 'center',
  },
  resultsPlaceholderBold: {
    paddingLeft: '15px',
    fontWeight: 'bold',
    alignItems: 'center',
  },
  filtersList: {
    textAlign: 'center',
    maxWidth: '300px',
  },
};

export class ContactSearch extends BaseComponent {

  componentWillMount() {
    this.props.clearSearchResults();
    this.props.clearCheckedContacts();
  }

  componentWillReceiveProps(nextProps) {
    const queryChanged = JSON.stringify(nextProps.selectedInteraction.query) !== JSON.stringify(this.props.selectedInteraction.query);
    const interactionChanged = (nextProps.selectedInteraction.interactionId !== this.props.selectedInteraction.interactionId);
    if (queryChanged || interactionChanged) {
      this.props.clearSearchResults();
      this.props.clearCheckedContacts();
    }
  }

  searchContacts = () => {
    if (!this.props.loading || this.props.deletionPending) {
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
        if (!error) {
          console.log('[ContactsControl] CxEngage.subscribe()', topic, response);
          this.props.setSearchResults(response);
        }
      });
    }
  }

  setMerging = () => {
    this.props.setContactMode('merge');
    this.props.setSidePanelTabIndex(this.props.selectedInteraction.interactionId, 0);
  }

  newContact = () => {
    this.props.newContact();
    this.props.setSidePanelTabIndex(this.props.selectedInteraction.interactionId, 0);
  }

  getLoader = () =>
    <div id="loadingContainer" style={styles.loading}>
      <IconSVG style={styles.loadingIcon} id="loadingIcon" name="loading" />
    </div>

  render() {
    let results;
    if (
      this.props.selectedInteraction
      && this.props.selectedInteraction.query
      && Object.keys(this.props.selectedInteraction.query).length
    ) {
      if (this.props.resultsCount !== 0) {
        const resultsMapped = !this.props.deletionPending && this.props.results.map(
          (contact) => {
            const isSelected = this.props.checkedContacts.find((checkedContact) => checkedContact.id === contact.id);
            return (<ContactSearchResult
              key={contact.id}
              hideContactSelectCheckbox={this.props.hideContactSelectCheckboxes}
              checked={!!isSelected}
              selectContact={(isChecked) => {
                if (isChecked) {
                  this.props.checkContact(contact);
                } else {
                  this.props.uncheckContact(contact);
                }
              }}
              contact={contact}
              style={styles.contactResult}
            />);
          });
        results = (
          <div style={styles.infiniteScrollContainer}>
            <InfiniteScroll
              key="infinite-scroll"
              loadMore={this.searchContacts}
              hasMore={this.props.resultsCount === -1 || this.props.results.length < this.props.resultsCount}
              loader={this.getLoader()}
              useWindow={false}
            >
              { resultsMapped }
            </InfiniteScroll>
          </div>
        );
      } else {
        results = <NoRecords query={this.props.selectedInteraction.query} />;
      }
    } else if (this.props.resultsCount < 1 && !this.props.loading) {
      results = (
        <div key="results-placeholder" id="results-placeholder" style={styles.resultsPlaceholder}>
          <div style={styles.resultsPlaceholderTitle}>
            <Icon name="search" />
            <div style={styles.resultsPlaceholderBold}>
              <FormattedMessage {...messages.searchText} />
            </div>
          </div>
          <div style={styles.filtersList}>
            <FormattedMessage {...messages.filtersList} />
          </div>
          <div style={{ margin: '5px 0' }}>
            <FormattedMessage {...messages.or} />
          </div>
          <Button id="createNewRecord" type="secondary" text="Create New Record" onClick={this.newContact}></Button>
        </div>
      );
    }
    return (
      <div style={styles.base}>
        <div style={styles.controlHeader}>
          <ContactSearchBar
            resultsCount={this.props.resultsCount}
            query={this.props.query}
            selectedInteraction={this.props.selectedInteraction}
            style={styles.contactSearchBar}
          />
          <div style={styles.filtersWrapper}>
            {this.props.query.map((filter) =>
              <Filter
                key={filter.attribute.objectName}
                name={filter.label}
                value={filter.value}
                remove={() => this.props.removeSearchFilter(filter.attribute.objectName)}
                style={styles.filter}
              />
            )}
          </div>
        </div>
        { results }
        {
          this.props.results.length > 0
          && !this.props.loading
          && !this.props.contactMode
          && <ContactBulkActions
            newContact={this.newContact}
            selectedContacts={this.props.checkedContacts}
            deleteContacts={this.props.deleteContacts}
            confirmingDelete={this.props.confirmingDelete}
            setMerging={this.setMerging}
            setConfirmingDelete={this.props.setConfirmingDelete}
          />
        }
      </div>
    );
  }
}

ContactSearch.propTypes = {
  hideContactSelectCheckboxes: PropTypes.bool,
  selectedInteraction: PropTypes.object.isRequired,
  results: PropTypes.any,
  resultsCount: PropTypes.number,
  nextPage: PropTypes.number,
  checkedContacts: PropTypes.array,
  loading: PropTypes.bool.isRequired,
  deletionPending: PropTypes.bool,
  confirmingDelete: PropTypes.bool,
  query: PropTypes.array,
  setSearchResults: PropTypes.func.isRequired,
  clearSearchResults: PropTypes.func.isRequired,
  clearCheckedContacts: PropTypes.func.isRequired,
  checkContact: PropTypes.func.isRequired,
  uncheckContact: PropTypes.func.isRequired,
  newContact: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
  deleteContacts: PropTypes.func.isRequired,
  setConfirmingDelete: PropTypes.func.isRequired,
  removeSearchFilter: PropTypes.func.isRequired,
  setContactMode: PropTypes.func.isRequired,
  contactMode: PropTypes.string,
  setSidePanelTabIndex: PropTypes.func.isRequired,
  resetForm: PropTypes.func.isRequired,
};

function mapStateToProps(state, props) {
  return {
    selectedInteraction: getSelectedInteraction(state, props),
    results: selectResults(state, props),
    resultsCount: selectResultsCount(state, props),
    nextPage: selectNextPage(state, props),
    checkedContacts: selectCheckedContacts(state, props),
    loading: selectLoading(state, props),
    deletionPending: selectDeletionPending(state, props),
    confirmingDelete: selectConfirmingDelete(state, props),
    query: selectExpandedQuery(state, props),
    contactMode: selectContactMode(state, props),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setCriticalError: () => dispatch(setCriticalError()),
    setSearchResults: (filter) => dispatch(setSearchResults(filter)),
    clearSearchResults: () => dispatch(clearSearchResults()),
    clearCheckedContacts: () => dispatch(clearCheckedContacts()),
    checkContact: (contact) => dispatch(checkContact(contact)),
    uncheckContact: (contact) => dispatch(uncheckContact(contact)),
    newContact: () => dispatch(newContact()),
    setLoading: (loading) => dispatch(setLoading(loading)),
    deleteContacts: () => dispatch(deleteContacts()),
    setConfirmingDelete: (confirmingDelete) => dispatch(setConfirmingDelete(confirmingDelete)),
    removeSearchFilter: (filter) => dispatch(removeSearchFilter(filter)),
    setContactMode: (contactMode) => dispatch(setContactMode(contactMode)),
    setSidePanelTabIndex: (interactionId, sidePanelTabIndex) => dispatch(setSidePanelTabIndex(interactionId, sidePanelTabIndex)),
    resetForm: () => dispatch(resetForm()),
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Radium(ContactSearch));