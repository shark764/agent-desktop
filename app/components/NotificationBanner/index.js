/**
*
* NotificationBanner
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';
import { injectIntl } from 'react-intl';

import Button from 'components/Button';

import messages from './messages';

function NotificationBanner(props) {
  const styles = {
    base: {
      backgroundColor: props.isError ? '#FE4565' : '#072931',
      width: 'calc(100% + 76px)',
      height: '35px',
      position: 'relative',
      left: '-51px',
      display: 'flex',
      alignItems: 'stretch',
      color: 'white',
      flexShrink: 0,
    },
    typeText: {
      fontWeight: '600',
      alignSelf: 'center',
    },
    messageText: {
      alignSelf: 'center',
    },
    tryAgainText: {
      textDecoration: 'underline',
      cursor: 'pointer',
      alignSelf: 'center',
    },
    leftGutter: {
      width: '52px',
    },
    closeButton: {
      margin: '0 10px 0 0',
      border: '0',
      alignSelf: 'center',
    },
  };

  return (
    <div id={props.id} style={[styles.base]} key={props.key}>
      <div style={styles.leftGutter}></div>
      {
        props.isError
        ? <div key="1" style={styles.typeText}>
          {props.intl.formatMessage(messages[`${props.errorType}`])}
          &nbsp;
        </div>
        : undefined
      }
      <div style={styles.messageText}>
        {props.intl.formatMessage(messages[props.messageType])}
      </div>
      {
        props.tryAgain ? <div onClick={props.tryAgain} style={styles.tryAgainText}>
          {props.intl.formatMessage(messages.tryAgain)}
        </div>
        : undefined
      }
      <div style={{ flexGrow: 1 }}></div>
      {
        props.isError
        ? <Button
          id={`${props.id}error-dismiss-btn`}
          style={styles.closeButton}
          iconName="close"
          type="primaryRed"
          onClick={props.dismiss}
        />
        : undefined
      }
    </div>
  );
}

NotificationBanner.propTypes = {
  intl: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  errorType: PropTypes.oneOf(['serverError', 'networkError']),
  messageType: PropTypes.oneOf(['notSaved', 'notCreated', 'notAssigned', 'created', 'saved']).isRequired,
  dismiss: PropTypes.func.isRequired,
  isError: PropTypes.bool.isRequired,
  tryAgain: PropTypes.func,
  key: PropTypes.string,
};

export default injectIntl(Radium(NotificationBanner));
