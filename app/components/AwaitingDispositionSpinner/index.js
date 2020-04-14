/*
 * Copyright © 2015-2020 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import Radium from 'radium';
import { FormattedMessage } from 'react-intl';

import IconSVG from 'components/IconSVG';
import messages from './messages';

const styles = {
  loading: {
    margin: '20px auto 10px',
    display: 'block',
    height: 80,
    width: 80,
  },
  centerText: {
    textAlign: 'center',
  },
};

function AwaitingDispositionSpinner() {
  return (
    <div key="awaitingDispositionSpinner" style={styles.loading}>
      <IconSVG id="awaitingDispositionIcon" name="loading" />
      <div style={styles.centerText}>
        <FormattedMessage
          key="dispoSpinner"
          {...messages.awaitingDisposition}
        />
      </div>
    </div>
  );
}

export default Radium(AwaitingDispositionSpinner);
