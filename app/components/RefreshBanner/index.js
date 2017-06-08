/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/**
*
* RefreshBanner
*
*/

import React from 'react';

import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import Radium from 'radium';
import closeIcon from './assets/close.png';
import messages from './messages';

function RefreshBanner(props) {
  const styles = {
    base: {
      height: '2em',
      backgroundColor: '#3EC5EC',
      textAlign: 'center',
      width: '100vw',
      padding: '0.25em',
      color: '#FFFFFF',
      textDecoration: 'underline',
      cursor: 'pointer',
    },
    close: {
      position: 'absolute',
      right: '0.75em',
    },
  };

  return (
    <div style={styles.base}>
      <span onClick={() => location.reload()}><FormattedMessage {...messages.notification} /></span>
      <span onClick={() => props.hide(false)} style={styles.close}><img id="hideRefreshBanner" alt={'close'} src={closeIcon} /></span>
    </div>
  );
}

RefreshBanner.propTypes = {
  hide: PropTypes.func,
};

export default Radium(RefreshBanner);
