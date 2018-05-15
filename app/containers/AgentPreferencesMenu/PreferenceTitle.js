import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Radium from 'radium';

import Icon from 'components/Icon';

import messages from './messages';

const styles = {
  title: {
    fontSize: '18px',
    color: '#4B4B4B',
    fontWeight: 'bold',
    marginBottom: '10px',
    borderBottom: 'solid 1px #e4e4e4',
    padding: '0 0 5px 0',
  },
  option: {
    padding: '5px 0',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: '#DEF8FE',
    },
  },
  backCaret: {
    transform: 'rotate(90deg)',
    verticalAlign: 'top',
    margin: '8px 5px 0 0',
  },
};

export class PreferenceTitle extends React.Component {
  clearPreferenceSelected = () => this.props.setPreferenceSelected(undefined);

  render() {
    if (this.props.preference) {
      return (
        <div
          id="preferenceTitleBack"
          onClick={this.clearPreferenceSelected}
          style={[styles.title, styles.option]}
        >
          <Icon name="caret" style={styles.backCaret} />
          <FormattedMessage {...messages.preferences} />
          &nbsp;-&nbsp;
          <FormattedMessage {...messages[this.props.preference]} />
        </div>
      );
    } else {
      return (
        <div id="preferenceTitle" style={styles.title}>
          <FormattedMessage {...messages.preferences} />
        </div>
      );
    }
  }
}

PreferenceTitle.propTypes = {
  preference: PropTypes.string,
  setPreferenceSelected: PropTypes.func.isRequired,
};

export default Radium(PreferenceTitle);
