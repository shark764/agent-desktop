/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * Results
 *
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import Radium from 'radium';

import Icon from 'components/Icon';
import IconSVG from 'components/IconSVG';

import Contact from './Contact';

import messages from './messages';

const styles = {
  resultsContainer: {
    padding: '30px',
    overflowY: 'auto',
  },
  instructions: {
    color: '#979797',
    textAlign: 'center',
  },
  instructionsTitle: {
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  loadingIcon: {
    margin: '0 auto',
    width: 120,
  },
  noRecordsMessage: {
    textAlign: 'center',
    paddingBottom: '30px',
    marginBottom: '30px',
    borderBottom: '1px solid #D0D0D0',
  },
  startInteractionButton: {
    margin: '0 auto 10px',
    width: '300px',
    borderRadius: '2px',
    border: 'solid 1px #979797',
    padding: '10px 15px',
    cursor: 'pointer',
  },
  startInteractionButtonDisabled: {
    color: '#979797',
    cursor: 'default',
  },
  startInteractionText: {
    display: 'inline-block',
  },
  startInteractionIcon: {
    marginRight: '10px',
  },
  startInteractionValue: {
    float: 'right',
  },
};

function Results(props) {
  let results;
  console.log(props.searchResults);
  if (props.searchResults === undefined) {
    results = (
      <div style={styles.instructions}>
        <div style={styles.instructionsTitle}>
          <FormattedMessage {...messages.instructionsTitle} />
        </div>
        <div>
          <FormattedMessage {...messages.instructions} />
        </div>
      </div>
    );
  } else if (props.searchResults === 'loading') {
    results = <IconSVG id="loadingContacts" name="loading" styleOuter={styles.loadingIcon} />;
  } else if (props.searchResults === 'error') {
    results = <FormattedMessage {...messages.searchError} />;
  } else if (typeof props.searchResults === 'string') {
    results = (
      <div>
        <div style={styles.noRecordsMessage}>
          - <FormattedMessage {...messages.noRecords} /> -
        </div>
        <div>
          <div id="callNewInteractionButton" onClick={props.startCall} style={[styles.startInteractionButton, props.hasVoiceInteraction && styles.startInteractionButtonDisabled]}>
            <div style={styles.startInteractionText}>
              <Icon name={'voice_dark'} style={styles.startInteractionIcon} />
              <FormattedMessage {...messages.call} />
            </div>
            <div style={[styles.startInteractionText, styles.startInteractionValue]}>
              {props.searchResults}
            </div>
          </div>
          <div id="smsNewInteractionButton" onClick={props.startSms} style={[styles.startInteractionButton, props.smsInteractionNumbers.includes(props.searchResults) && styles.startInteractionButtonDisabled]}>
            <div style={styles.startInteractionText}>
              <Icon name={'message_dark'} style={styles.startInteractionIcon} />
              <FormattedMessage {...messages.sms} />
            </div>
            <div style={[styles.startInteractionText, styles.startInteractionValue]}>
              {props.searchResults}
            </div>
          </div>
        </div>
      </div>
    );
  } else if (Array.isArray(props.searchResults)) {
    results = props.searchResults.map((contact) =>
      <Contact key={contact.id} contact={contact} selectContact={props.selectContact} />
    );
  } else {
    throw new Error('Invalid searchResults');
  }

  return (
    <div id="resultsContainer" style={styles.resultsContainer}>
      {results}
    </div>
  );
}

Results.propTypes = {
  searchResults: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  selectContact: PropTypes.func.isRequired,
  hasVoiceInteraction: PropTypes.bool.isRequired,
  smsInteractionNumbers: PropTypes.array.isRequired,
  startCall: PropTypes.func.isRequired,
  startSms: PropTypes.func.isRequired,
};

export default Radium(Results);
