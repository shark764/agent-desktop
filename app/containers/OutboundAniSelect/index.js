import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Radium from 'radium';
import { FormattedMessage } from 'react-intl';
import ErrorBoundary from 'components/ErrorBoundary';

import Select from 'components/Select';
import IconSVG from 'components/IconSVG';
import { selectOutboundIdentifierListsForChannel } from './selectors';
import { fetchOutboundIdentifierLists } from './actions';
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
          onChange={this.props.changeSelected}
          value={
            this.props.valueSelected
              ? this.props.valueSelected.value
              : undefined
          }
          style={this.props.styles}
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
  };
}

export const actions = {
  fetchOutboundIdentifierLists,
};

OutboundAniSelect.propTypes = {
  selectOutboundIdentifierListsForChannel: PropTypes.array,
  fetchOutboundIdentifierLists: PropTypes.func.isRequired,
  valueSelected: PropTypes.object.isRequired,
  channelTypes: PropTypes.array,
  changeSelected: PropTypes.func.isRequired,
  styles: PropTypes.object,
};

export default ErrorBoundary(
  connect(
    mapStateToProps,
    actions
  )(Radium(OutboundAniSelect))
);
