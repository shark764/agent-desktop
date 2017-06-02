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

const styles = {
  base: {
    backgroundColor: '#072931',
    width: '100%',
    height: '35px',
    paddingLeft: '52px',
    display: 'flex',
    alignItems: 'center',
    color: 'white',
    flexShrink: 0,
  },
  baseError: {
    backgroundColor: '#FE4565',
  },
  titleText: {
    fontWeight: '600',
  },
  rightLinkText: {
    textDecoration: 'underline',
    cursor: 'pointer',
    marginLeft: '4px',
  },
  closeButton: {
    margin: '0 10px 0 0',
    borderTop: '0',
    borderRight: '0',
    borderBottom: '0',
    borderLeft: '0',
  },
};

function NotificationBanner(props) {
  return (
    <div id={props.id} style={[styles.base, props.style, props.isError && styles.baseError]}>
      {
        props.titleMessage
        && <div key="1" style={styles.titleText}>
          {props.intl.formatMessage(props.titleMessage)}
          &nbsp;
        </div>
      }
      <div>
        { props.intl.formatMessage(props.descriptionMessage) }
      </div>
      {
        props.rightLinkAction
        && <div onClick={props.rightLinkAction} style={styles.rightLinkText}>
          {props.intl.formatMessage(props.rightLinkMessage || messages.tryAgain)}
        </div>
      }
      <div style={{ flexGrow: 1 }}></div>
      {
        props.isError
        && props.dismiss
        && <Button
          id={`${props.id}error-dismiss-btn`}
          style={styles.closeButton}
          iconName="close"
          type="primaryRed"
          onClick={props.dismiss}
        />
      }
    </div>
  );
}

NotificationBanner.propTypes = {
  intl: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  style: PropTypes.object,
  titleMessage: PropTypes.object,
  descriptionMessage: PropTypes.object.isRequired,
  dismiss: PropTypes.func,
  isError: PropTypes.bool.isRequired,
  rightLinkAction: PropTypes.func,
  rightLinkMessage: PropTypes.object,
};

export default injectIntl(Radium(NotificationBanner));
