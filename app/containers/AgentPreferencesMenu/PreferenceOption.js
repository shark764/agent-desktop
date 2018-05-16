import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Radium from 'radium';

import Icon from 'components/Icon';

import messages from './messages';

const styles = {
  option: {
    padding: '5px',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: '#DEF8FE',
    },
  },
  optionCaret: {
    transform: 'rotate(-90deg)',
    float: 'right',
    marginTop: '7px',
  },
};

export class PreferenceOption extends React.Component {
  setPreferenceSelected = () =>
    this.props.setPreferenceSelected(this.props.preference);

  render() {
    return (
      <div
        id={`${this.props.preference}-preference`}
        onClick={this.setPreferenceSelected}
        style={styles.option}
      >
        <FormattedMessage {...messages[this.props.preference]} />
        <Icon name="caret" style={styles.optionCaret} />
      </div>
    );
  }
}

PreferenceOption.propTypes = {
  preference: PropTypes.string.isRequired,
  setPreferenceSelected: PropTypes.func.isRequired,
};

export default Radium(PreferenceOption);
