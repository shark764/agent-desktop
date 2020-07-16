/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/**
 *
 * Logo
 *
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import Radium from 'radium';
import {
  CXENGAGE_LEGAL_URL,
  MITEL_LEGAL_URL,
  MITEL_LEGAL_PROD_URL,
  CXENGAGE_LEGAL_PROD_URL,
} from 'serenova-js-utils/urls';
import messages from './messages';

const styles = {
  copyright: {
    gridArea: 'legal',
    alignSelf: 'end',
    width: '100%',
    color: '#FFFFFF',
    textAlign: 'center',
    msGridColumn: '3',
    msGridRow: '4',
  },
  copyrightText: {
    marginBottom: '1em',
    display: 'block',
  },
  legalText: {
    marginBottom: '1em',
    fontSize: '13px',
    textAlign: 'center',
  },
  privacyLink: {
    color: '#FFFFFF',
  },
  copyrightToolbar: {
    color: '#000000',
    padding: '0 30px',
  },
  legalLinkToolbar: {
    color: '#000000',
  },
};

function LegalCopyright(props, context) {
  let legalUrl;

  if (window.location.hostname.indexOf('labs') !== -1) {
    if (window.location.hostname.split('.')[0].indexOf('mitel') !== -1) {
      legalUrl = MITEL_LEGAL_URL;
    } else {
      legalUrl = CXENGAGE_LEGAL_URL;
    }
    /**
     * We add current language selected to cxengagelabs URLs
     * Production URLs will be added when they are deployed
     */
    if (props.locale && props.locale !== 'en-US') {
      legalUrl = `${legalUrl}/${props.locale}`;
    }
  } else if (window.location.hostname.split('.')[0].indexOf('mitel') !== -1) {
    legalUrl = MITEL_LEGAL_PROD_URL;
  } else {
    legalUrl = CXENGAGE_LEGAL_PROD_URL;
  }

  return (
    <div
      style={[
        styles.copyright,
        context.toolbarMode && styles.copyrightToolbar,
      ]}
    >
      <div style={styles.copyrightText} id="serenova_copyright">
        <FormattedMessage
          {...messages.copyright}
          values={{ year: new Date().getFullYear() }}
        />
      </div>
      <div style={styles.legalText} id="serenova_legal">
        <FormattedMessage {...messages.legal} />
        <a
          target="_blank"
          href={legalUrl}
          style={[
            styles.privacyLink,
            context.toolbarMode && styles.legalLinkToolbar,
          ]}
        >
          <FormattedMessage {...messages.legalLabel} />
        </a>
      </div>
    </div>
  );
}

LegalCopyright.propTypes = {
  locale: PropTypes.string,
};

LegalCopyright.contextTypes = {
  toolbarMode: PropTypes.bool,
};

export default Radium(LegalCopyright);
