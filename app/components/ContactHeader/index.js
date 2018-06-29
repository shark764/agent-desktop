/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/* eslint react/prop-types: 0 */
/**
 *
 * ContactHeader
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';

import { FormattedMessage } from 'react-intl';

import Button from 'components/Button';

import messages from './messages';

function ContactHeader(props) {
  const styles = {
    bannerHeader: {
      backgroundColor: '#DEF8FE',
      width: 'calc(100% + 76px)',
      height: '70px',
      position: 'relative',
      left: '-51px',
      display: 'flex',
      alignItems: 'stretch',
      flexShrink: 0,
    },
    bannerHeaderText: {
      fontWeight: 'bold',
      alignSelf: 'center',
    },
    leftGutter: {
      width: '52px',
    },
    controlHeader: {
      minHeight: '70px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      flexShrink: '0',
    },
    buttonSet: {
      alignSelf: 'flex-end',
      flexGrow: '0',
      flexShrink: '1',
    },
    leftButton: {
      margin: '0 11px',
    },
    rightButton: {
      float: 'right',
      margin: '0',
      height: '36px',
      width: '60px',
    },
  };

  function getBannerHeader(text) {
    return (
      <div style={styles.bannerHeader}>
        <div style={styles.leftGutter} />
        <div style={styles.bannerHeaderText}>
          {text}
        </div>
      </div>
    );
  }

  function getViewControlHeader() {
    return (
      <div style={styles.controlHeader}>
        {props.showControls && (
          <div style={styles.buttonSet}>
            <Button
              id="contact-edit-btn"
              style={styles.leftButton}
              onClick={props.editAssignedContact}
              text={messages.edit}
              type="secondary"
            />
            <Button
              id="contact-search-btn"
              style={styles.rightButton}
              onClick={props.setSearching}
              iconName="search"
              type="secondary"
            />
          </div>
        )}
      </div>
    );
  }

  switch (props.contactMode) {
    case 'view':
      return getViewControlHeader();
    case 'create':
      return getBannerHeader(
        <FormattedMessage {...messages.newContactBanner} />
      );
    case 'merge':
      return getBannerHeader(
        <FormattedMessage {...messages.contactMergeBanner} />
      );
    case 'edit':
      return getBannerHeader(
        <FormattedMessage {...messages.contactEditingBanner} />
      );
    case 'search':
    default:
      return null;
  }
}

ContactHeader.propTypes = {
  editAssignedContact: PropTypes.func,
  setSearching: PropTypes.func,
  showControls: PropTypes.bool,
  contactMode: PropTypes.string,
};

export default Radium(ContactHeader);
