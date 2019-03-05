import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CollapsibleMultiselect from 'components/CollapsibleMultiselect';

import { selectQueues } from 'containers/AgentDesktop/selectors';
import { selectUserAssignedTransferLists } from 'containers/TransferMenu/selectors';
import ErrorBoundary from 'components/ErrorBoundary';
import {
  selectAgentsPreferences,
  selectVisibleQueues,
  selectVisibleTransferLists,
  selectPreferenceMenuQueuesLoading,
  selectPreferenceMenuTransferListsLoading,
} from './selectors';
import {
  toggleAgentsTransferMenuPreference,
  toggleSelectedQueueTransferMenuPreference,
  toggleAllSelectedQueuesTransferMenuPreference,
  toggleSelectedTransferListTransferMenuPreference,
  toggleAllSelectedTransferListsTransferMenuPreference,
  toggleShowQueuesTransferMenuPreference,
  toggleShowTransferListsTransferMenuPreference,
  initializeTransferMenuPreferences,
} from './actions';

import messages from './messages';

export class AgentTransferMenuPreferenceMenu extends React.Component {
  constructor(props) {
    super(props);
    this.initializeTransferLists();
  }

  initializeTransferLists = () => {
    this.props.initializeTransferMenuPreferences();
  };

  render() {
    return (
      <Fragment>
        <CollapsibleMultiselect
          title={messages.agents}
          toggleSelection={this.props.toggleAgents}
          singleToggleBtn={this.props.agentsTransferMenuEnabled}
        />

        <CollapsibleMultiselect
          title={messages.queues}
          items={this.props.queues}
          selectAll={this.props.toggleAllQueues}
          selectAllBtn
          selectedItems={this.props.visibleQueues.map((queue) => queue.id)}
          toggleSelection={this.props.toggleQueue}
          toggleShowList={this.props.toggleShowQueues}
          loading={this.props.preferenceMenuQueuesLoading}
        />

        <CollapsibleMultiselect
          title={messages.transferLists}
          items={
            this.props.transferLists !== null ? this.props.transferLists : []
          }
          selectAll={this.props.toggleAllTransferLists}
          selectAllBtn
          selectedItems={this.props.visibleTransferLists.map(
            (transferList) => transferList.id
          )}
          toggleSelection={this.props.toggleTransferList}
          toggleShowList={this.props.toggleShowTransferLists}
          loading={this.props.preferenceMenuTransferListsLoading}
        />
      </Fragment>
    );
  }
}

const mapStateToProps = (state, props) => ({
  agentsTransferMenuEnabled: selectAgentsPreferences(state, props),
  transferLists: selectUserAssignedTransferLists(state, props),
  queues: selectQueues(state, props),
  visibleQueues: selectVisibleQueues(state, props),
  visibleTransferLists: selectVisibleTransferLists(state, props),
  preferenceMenuQueuesLoading: selectPreferenceMenuQueuesLoading(state, props),
  preferenceMenuTransferListsLoading: selectPreferenceMenuTransferListsLoading(
    state,
    props
  ),
});

AgentTransferMenuPreferenceMenu.propTypes = {
  agentsTransferMenuEnabled: PropTypes.bool,
  toggleAgents: PropTypes.func.isRequired,
  transferLists: PropTypes.array,
  queues: PropTypes.array,
  toggleQueue: PropTypes.func,
  toggleAllQueues: PropTypes.func,
  toggleTransferList: PropTypes.func,
  toggleAllTransferLists: PropTypes.func,
  toggleShowQueues: PropTypes.func,
  toggleShowTransferLists: PropTypes.func,
  initializeTransferMenuPreferences: PropTypes.func.isRequired,
  visibleQueues: PropTypes.array,
  visibleTransferLists: PropTypes.array,
  preferenceMenuQueuesLoading: PropTypes.bool,
  preferenceMenuTransferListsLoading: PropTypes.bool,
};

export const actions = {
  toggleAgents: toggleAgentsTransferMenuPreference,
  toggleQueue: toggleSelectedQueueTransferMenuPreference,
  toggleAllQueues: toggleAllSelectedQueuesTransferMenuPreference,
  toggleTransferList: toggleSelectedTransferListTransferMenuPreference,
  toggleAllTransferLists: toggleAllSelectedTransferListsTransferMenuPreference,
  toggleShowQueues: toggleShowQueuesTransferMenuPreference,
  toggleShowTransferLists: toggleShowTransferListsTransferMenuPreference,
  initializeTransferMenuPreferences,
};

export default ErrorBoundary(
  connect(
    mapStateToProps,
    actions
  )(AgentTransferMenuPreferenceMenu)
);
