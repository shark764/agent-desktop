/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * PhoneControls
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Radium from 'radium';

import ErrorBoundary from 'components/ErrorBoundary';

import PhoneControlsInactive from 'containers/PhoneControlsInactive';
import PhoneControlsActive from 'containers/PhoneControlsActive';

import { selectActiveVoiceInteraction } from './selectors';

export class PhoneControls extends React.Component {
  styles = {
    base: {
      backgroundColor: '#031417',
      color: '#FFFFFF',
    },
  };

  render() {
    return (
      <div style={[this.styles.base, this.props.style]}>
        {this.props.activeVoiceInteraction ? (
          <PhoneControlsActive
            activeVoiceInteraction={this.props.activeVoiceInteraction}
          />
        ) : (
          <PhoneControlsInactive />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  activeVoiceInteraction: selectActiveVoiceInteraction(state, props),
});

PhoneControls.propTypes = {
  activeVoiceInteraction: PropTypes.object,
  style: PropTypes.object,
};

export default ErrorBoundary(connect(mapStateToProps)(Radium(PhoneControls)));
