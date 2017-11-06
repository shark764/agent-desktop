/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * ContactInteractionHistory
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import Radium from 'radium';
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroller';

import ErrorBoundary from 'components/ErrorBoundary';

import IconSVG from 'components/IconSVG';
import ContactInteractionHistoryItem from 'containers/ContactInteractionHistoryItem';

import {
  setContactInteractionHistory,
  setCrmInteractionHistory,
  addNotesToContactInteractionHistory,
  loadHistoricalInteractionBody,
  loadContactInteractionHistory,
  loadCrmInteractionHistory,
} from 'containers/AgentDesktop/actions';
import { selectCrmModule } from 'containers/AgentDesktop/selectors';
import { selectContact } from './selectors';
import messages from './messages';

const styles = {
  loading: {
    margin: '0 auto',
    display: 'block',
  },
  base: {
    padding: '28px 26px 26px 0',
    fontSize: '14px',
    height: '100%',
    overflowY: 'auto',
  },
  interactionsHeaderContainer: {
    fontSize: '15px',
    marginBottom: '19px',
  },
  interactionsHeader: {
    display: 'inline-block',
  },
  refresh: {
    display: 'inline-block',
    float: 'right',
    fontSize: '22px',
    marginTop: '-4px',
    cursor: 'pointer',
  },
  interaction: {
    border: '1px solid #E4E4E4',
    borderRadius: '3px',
  },
};

export class ContactInteractionHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedInteractionIndex: undefined,
    };
  }

  refreshContactInteractionHistory = () => {
    if (this.props.crmModule === undefined) {
      this.props.setContactInteractionHistory(this.props.contactId, {
        results: undefined,
      });
      this.props.loadContactInteractionHistory(this.props.contactId);
    } else {
      this.props.setCrmInteractionHistory(
        this.props.contactSubType,
        this.props.contactId,
        {
          results: undefined,
        }
      );
      this.props.loadCrmInteractionHistory(
        this.props.contactSubType,
        this.props.contactId
      );
    }
  };

  loadMoreContactInteractionHistory = () => {
    if (this.props.crmModule === undefined) {
      this.props.loadContactInteractionHistory(
        this.props.contactId,
        this.props.contactInteractionHistory.nextPage
      );
    } else {
      this.props.loadCrmInteractionHistory(
        this.props.contactSubType,
        this.props.contactId,
        this.props.contactInteractionHistory.nextPage
      );
    }
  };

  selectInteraction = (selectedInteractionIndex) => {
    if (selectedInteractionIndex !== undefined) {
      const interaction = this.props.contactInteractionHistory.results[
        selectedInteractionIndex
      ];
      const needsNotes =
        this.props.crmModule === undefined &&
        interaction.interactionDetails.agents.findIndex(
          (agent) => agent.noteTitle !== null && agent.note === undefined
        ) !== -1;
      if (needsNotes) {
        CxEngage.interactions.getAllNotes(
          { interactionId: interaction.interactionId },
          (error, topic, response) => {
            if (!error) {
              console.log(
                '[ContactInteractionHistory] CxEngage.subscribe()',
                topic,
                response
              );
              this.props.addNotesToContactInteractionHistory(
                interaction.interactionId,
                response
              );
            }
          }
        );
      }
      const needsBody =
        interaction.interactionDetails.recordings === undefined &&
        interaction.interactionDetails.transcript === undefined;
      if (needsBody) {
        switch (interaction.channelType) {
          case 'voice':
            this.props.loadHistoricalInteractionBody(
              interaction.interactionId,
              'recordings'
            );
            break;
          case 'sms':
          case 'messaging':
            this.props.loadHistoricalInteractionBody(
              interaction.interactionId,
              'transcript'
            );
            break;
          default:
            break;
        }
      }
    }
    this.setState({ selectedInteractionIndex });
  };

  getInteractionHistoryHeader = () => {
    const interactionsTotal = this.props.contactInteractionHistory.total;
    const earliestTimestamp = this.props.contactInteractionHistory
      .earliestTimestamp;
    return (
      <div
        id="interaction-history-header"
        key="interaction-history-header"
        style={styles.interactionsHeaderContainer}
      >
        <div id="interactionsSince" style={styles.interactionsHeader}>
          {interactionsTotal > 0
            ? <div>
              {interactionsTotal}
                &nbsp;
              {interactionsTotal > 1
                  ? <FormattedMessage {...messages.interactions} />
                  : <FormattedMessage {...messages.interaction} />}
              {earliestTimestamp &&
              <span>
                    &nbsp;
                <FormattedMessage {...messages.since} />
                    &nbsp;
                {moment(earliestTimestamp).format('LL')}
              </span>}
            </div>
            : <FormattedMessage {...messages.noPastInteractions} />}
        </div>
        <div
          id="refreshContactInteractionHistory"
          onClick={this.refreshContactInteractionHistory}
          style={styles.refresh}
        >
          &#8635;
        </div>
      </div>
    );
  };

  getInteractionHistoryList = () => {
    if (this.props.contactInteractionHistory === undefined) {
      return (
        <IconSVG id="loadingContactHistoryIcon" name="loading" width="80px" />
      );
    } else {
      const interactions = this.props.contactInteractionHistory.results.map(
        (interaction, interactionIndex) =>
          (<ContactInteractionHistoryItem
            key={interaction.interactionId}
            interaction={interaction}
            interactionIndex={interactionIndex}
            contactName={this.props.contactName}
            selectInteraction={this.selectInteraction}
          />)
      );
      return [
        this.getInteractionHistoryHeader(),
        <InfiniteScroll
          key="infinite-scroll"
          loadMore={this.loadMoreContactInteractionHistory}
          hasMore={
            this.props.contactInteractionHistory.results.length <
            this.props.contactInteractionHistory.total
          }
          loader={
            <IconSVG
              id="loadingContactHistoryIcon"
              name="loading"
              width="80px"
            />
          }
          useWindow={false}
        >
          {interactions}
        </InfiniteScroll>,
      ];
    }
  };

  render() {
    let content;
    if (this.state.selectedInteractionIndex === undefined) {
      content = this.getInteractionHistoryList();
    } else {
      content = (
        <ContactInteractionHistoryItem
          interaction={
            this.props.contactInteractionHistory.results[
              this.state.selectedInteractionIndex
            ]
          }
          contactName={this.props.contactName}
          selectInteraction={this.selectInteraction}
        />
      );
    }
    return (
      <div style={[styles.base, this.props.style]}>
        {content}
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  const contact = selectContact(state, props);
  return {
    crmModule: selectCrmModule(state, props),
    contactId: contact.id,
    contactSubType: contact.type,
    contactName: contact.attributes.name,
    contactInteractionHistory: contact.interactionHistory,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setContactInteractionHistory: (contactId, response) =>
      dispatch(setContactInteractionHistory(contactId, response)),
    setCrmInteractionHistory: (subType, id, response) =>
      dispatch(setCrmInteractionHistory(subType, id, response)),
    addNotesToContactInteractionHistory: (
      contactHistoryInteractionId,
      response
    ) =>
      dispatch(
        addNotesToContactInteractionHistory(
          contactHistoryInteractionId,
          response
        )
      ),
    loadHistoricalInteractionBody: (interactionId, bodyType) =>
      dispatch(loadHistoricalInteractionBody(interactionId, bodyType)),
    loadContactInteractionHistory: (contactId, page) =>
      dispatch(loadContactInteractionHistory(contactId, page)),
    loadCrmInteractionHistory: (subType, id, page) =>
      dispatch(loadCrmInteractionHistory(subType, id, page)),
    dispatch,
  };
}

ContactInteractionHistory.propTypes = {
  crmModule: PropTypes.string,
  contactId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  contactSubType: PropTypes.string,
  contactName: PropTypes.string.isRequired,
  contactInteractionHistory: PropTypes.object,
  setContactInteractionHistory: PropTypes.func.isRequired,
  setCrmInteractionHistory: PropTypes.func.isRequired,
  addNotesToContactInteractionHistory: PropTypes.func.isRequired,
  loadHistoricalInteractionBody: PropTypes.func.isRequired,
  loadContactInteractionHistory: PropTypes.func.isRequired,
  loadCrmInteractionHistory: PropTypes.func.isRequired,
  style: PropTypes.object,
};

export default ErrorBoundary(
  connect(mapStateToProps, mapDispatchToProps)(
    Radium(ContactInteractionHistory)
  )
);
