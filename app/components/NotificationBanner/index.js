/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

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
    backgroundColor: '#3EC5EC',
    width: '100%',
    height: '28px',
    fontSize: '14px',
    padding: '0 30px',
    display: 'flex',
    alignItems: 'center',
    color: 'white',
    flexShrink: 0,
    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
  },
  baseError: {
    backgroundColor: '#FE4565',
  },
  titleText: {
    fontWeight: '600',
    marginRight: '24px',
  },
  descriptionMessage: {
    flexGrow: 1,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  rightLinkText: {
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  closeButton: {
    borderTop: '0',
    borderRight: '0',
    borderBottom: '0',
    borderLeft: '0',
  },
  fullBannerAction: {
    cursor: 'pointer',
  },
};

function NotificationBanner(props) {
  const descriptionMessage =
    typeof props.descriptionMessage === 'object'
      ? props.intl.formatMessage(props.descriptionMessage)
      : props.descriptionMessage;
  return (
    <div
      id={props.id}
      style={[styles.base, props.isError && styles.baseError, props.style]}
    >
      {props.titleMessage &&
        <div key="1" style={styles.titleText}>
          {props.intl.formatMessage(props.titleMessage)}
          &nbsp;
        </div>}
      <div
        style={[
          styles.descriptionMessage,
          props.fullBannerAction && styles.fullBannerAction,
          props.descriptionStyle,
        ]}
        onClick={props.fullBannerAction}
        title={descriptionMessage}
      >
        {descriptionMessage}
      </div>
      {props.rightLinkAction &&
        <div onClick={props.rightLinkAction} style={styles.rightLinkText}>
          {props.intl.formatMessage(
            props.rightLinkMessage || messages.tryAgain
          )}
        </div>}
      {props.dismiss &&
        <Button
          id={`${props.id}-dismiss-btn`}
          style={styles.closeButton}
          iconName="close"
          onClick={props.dismiss}
          clear
        />}
    </div>
  );
}

NotificationBanner.propTypes = {
  intl: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  style: PropTypes.object,
  descriptionStyle: PropTypes.object,
  titleMessage: PropTypes.object,
  descriptionMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
    .isRequired,
  dismiss: PropTypes.func,
  isError: PropTypes.bool,
  rightLinkAction: PropTypes.func,
  rightLinkMessage: PropTypes.object,
  fullBannerAction: PropTypes.func,
};

export default injectIntl(Radium(NotificationBanner));
