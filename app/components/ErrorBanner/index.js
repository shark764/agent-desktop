/**
*
* ErrorBanner
*
*/

import React, { PropTypes } from 'react';

import { injectIntl } from 'react-intl';
import messages from './messages';
import Button from 'components/Button';

import Radium from 'radium';

function ErrorBanner(props) {
  const styles = {
    base: {
      backgroundColor: '#FE4565',
      width: 'calc(100% + 76px)',
      height: '35px',
      position: 'relative',
      left: '-51px',
      display: 'flex',
      alignItems: 'stretch',
      color: 'white',
      flexShrink: 0,
    },
    errorTypeText: {
      fontWeight: '600',
      alignSelf: 'center',
    },
    errorMessageText: {
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
    <div id={props.id} style={styles.base} key={props.key}>
      <div style={styles.leftGutter}></div>
      <div style={styles.errorTypeText}>
        {props.intl.formatMessage(messages[`${props.errorType}Error`])}
      </div>
      &nbsp;
      <div style={styles.errorMessageText}>
        {props.intl.formatMessage(messages[props.messageType])}
      </div>
      {
        props.tryAgain ? <div onClick={props.tryAgain} style={styles.tryAgainText}>
          {props.intl.formatMessage(messages.tryAgain)}
        </div>
        : undefined
      }
      <div style={{ flexGrow: 1 }}></div>
      <Button
        id={`${props.id}error-dismiss-btn`}
        style={styles.closeButton}
        iconName="close"
        type="primaryRed"
        onClick={props.dismiss}
      />
    </div>
  );
}

ErrorBanner.propTypes = {
  intl: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  errorType: PropTypes.oneOf(['server', 'network']).isRequired,
  messageType: PropTypes.oneOf(['notSaved', 'notCreated']).isRequired,
  dismiss: PropTypes.func.isRequired,
  tryAgain: PropTypes.func,
  key: PropTypes.string,
};

export default injectIntl(Radium(ErrorBanner));
