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
        <div style={styles.leftGutter}></div>
        <div style={styles.bannerHeaderText}>
          {text}
        </div>
      </div>
    );
  }

  function getViewControlHeader() {
    return (
      <div style={styles.controlHeader}>
        {
          props.selectedInteraction.interactionId !== 'creating-new-interaction'
          && <div style={styles.buttonSet}>
            <Button id="contact-edit-btn" style={styles.leftButton} onClick={props.editAssignedContact} text={messages.edit} type="secondary" />
            <Button id="contact-search-btn" style={styles.rightButton} onClick={props.setSearching} iconName="search" type="secondary" />
          </div>
        }
      </div>
    );
  }

  switch (props.selectedInteraction.contactAction) {
    case 'view':
      if (props.contactMode === 'editing') {
        return getBannerHeader(<FormattedMessage {...messages.contactEditingBanner} />);
      }
      return getViewControlHeader();
    case 'search':
    default:
      if (props.contactMode === 'editing') {
        if (Object.keys(props.editingContactEditing).length === 0) {
          return getBannerHeader(<FormattedMessage {...messages.newContactBanner} />);
        } else {
          return getBannerHeader(<FormattedMessage {...messages.contactEditingBanner} />);
        }
      }
      if (props.contactMode === 'merging') {
        return getBannerHeader(<FormattedMessage {...messages.contactMergeBanner} />);
      }
      return null;
  }
}

ContactHeader.propTypes = {
  editAssignedContact: PropTypes.func,
  setSearching: PropTypes.func,
};

export default Radium(ContactHeader);
