import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Radium from 'radium';
import { FormattedMessage } from 'react-intl';
import ErrorBoundary from 'components/ErrorBoundary';

import Select from 'components/Select';
import IconSVG from 'components/IconSVG';
import {
  getSelectedOutboundIdentifier,
  selectOutboundIdentifierListsForChannel,
} from './selectors';
import {
  selectOutboundIdentification,
  fetchOutboundIdentifierLists,
} from './actions';
import messages from './messages';

export class OutboundAniSelect extends React.Component {
  componentDidMount() {
    this.props.fetchOutboundIdentifierLists();
  }

  render() {
    if (
      this.props.selectOutboundIdentifierListsForChannel &&
      this.props.selectOutboundIdentifierListsForChannel.length > 0
    ) {
      return (
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
      );
    } else if (!this.props.selectOutboundIdentifierListsForChannel) {
      return (
        <IconSVG
          id="fetching-outbound-lists-loading-icon"
          name="loading"
          width="40px"
        />
      );
    }
    return null;
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
  selectOutboundIdentifierListsForChannel: PropTypes.array,
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
