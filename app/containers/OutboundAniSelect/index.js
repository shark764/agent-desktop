import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Radium from 'radium';
import { FormattedMessage } from 'react-intl';

import ErrorBoundary from 'components/ErrorBoundary';

import Select from 'components/Select';
import {
  selectOutboundIdentifierListsForChannel,
  getSelectedOutboundIdentifier,
} from './selectors';
import {
  selectOutboundIdentification,
  fetchOutboundIdentifierLists,
} from './actions';
import messages from './messages';

const styles = {
  base: {
    margin: '0px auto 10px',
    width: '282px',
  },
};

export class OutboundAniSelect extends React.Component {
  componentDidMount() {
    this.props.fetchOutboundIdentifierLists();
  }

  render() {
    return (
      <div style={styles.base}>
        <Select
          id="outboundAniSelect"
          options={this.props.selectOutboundIdentifierListsForChannel}
          placeholder={<FormattedMessage {...messages.selectOutboundAni} />}
          onChange={this.props.selectOutboundIdentification}
          value={
            this.props.getSelectedOutboundIdentifier
              ? this.props.getSelectedOutboundIdentifier.value
              : undefined
          }
        />
      </div>
    );
  }
}

export function mapStateToProps(state, props) {
  return {
    selectOutboundIdentifierListsForChannel: selectOutboundIdentifierListsForChannel(
      state,
      props
    ),
    getSelectedOutboundIdentifier: getSelectedOutboundIdentifier(state, props),
  };
}

export const actions = {
  fetchOutboundIdentifierLists,
  selectOutboundIdentification,
};

OutboundAniSelect.propTypes = {
  selectOutboundIdentifierListsForChannel: PropTypes.array.isRequired,
  selectOutboundIdentification: PropTypes.func.isRequired,
  getSelectedOutboundIdentifier: PropTypes.object,
  fetchOutboundIdentifierLists: PropTypes.func.isRequired,
};

export default ErrorBoundary(
  connect(
    mapStateToProps,
    actions
  )(Radium(OutboundAniSelect))
);
