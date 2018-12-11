import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CollapsibleMultiselect from 'components/CollapsibleMultiselect';

import { selectQueues } from 'containers/AgentDesktop/selectors';
import { selectTransferLists } from 'containers/TransferMenu/selectors';
import ErrorBoundary from 'components/ErrorBoundary';
import { setTransferLists } from 'containers/TransferMenu/actions';
import {
  selectAgentsPreferences,
  selectSelectedQueues,
  selectSelectedTransferLists,
  selectShowQueues,
  selectShowTransferLists,
} from './selectors';
import {
  toggleAgentsTransferMenuPreference,
  toggleSelectedQueueTransferMenuPreference,
  toggleAllSelectedQueuesTransferMenuPreference,
  toggleSelectedTransferListTransferMenuPreference,
  toggleAllSelectedTransferListsTransferMenuPreference,
  toggleShowQueuesTransferMenuPreference,
  toggleShowTransferListsTransferMenuPreference,
} from './actions';

import messages from './messages';

export class AgentTransferMenuPreferenceMenu extends React.Component {
  constructor(props) {
    super(props);
    if (this.props.transferLists === 'loading') {
      this.initializeTransferLists();
    }
  }

  initializeTransferLists = () => {
    this.props.setTransferLists();
  };

  render() {
    return (
      <Fragment>
        <CollapsibleMultiselect
          title={messages.agents}
          toggleSelection={this.props.toggleAgents}
          singleToggleBtn={this.props.agentsTransferMenuEnabled}
        />
        {this.props.queues.length > 0 && (
          <CollapsibleMultiselect
            title={messages.queues}
            items={this.props.queues}
            selectAll={this.props.toggleAllQueues}
            selectAllBtn
            selectedItems={this.props.selectedQueues}
            toggleSelection={this.props.toggleQueue}
            toggleShowList={this.props.toggleShowQueues}
            open={this.props.showQueues}
          />
        )}
        {this.props.transferLists !== 'loading' &&
          this.props.transferLists !== 'noTransferListsAvailable' && (
          <CollapsibleMultiselect
            title={messages.transferLists}
            items={this.props.transferLists}
            selectAll={this.props.toggleAllTransferLists}
            selectAllBtn
            selectedItems={this.props.selectedTransferLists}
            toggleSelection={this.props.toggleTransferList}
            toggleShowList={this.props.toggleShowTransferLists}
            open={this.props.showTransferLists}
          />
        )}
      </Fragment>
    );
  }
}

const mapStateToProps = (state, props) => ({
  agentsTransferMenuEnabled: selectAgentsPreferences(state, props),
  transferLists: selectTransferLists(state, props),
  queues: selectQueues(state, props),
  selectedQueues: selectSelectedQueues(state, props),
  selectedTransferLists: selectSelectedTransferLists(state, props),
  showQueues: selectShowQueues(state, props),
  showTransferLists: selectShowTransferLists(state, props),
});

AgentTransferMenuPreferenceMenu.propTypes = {
  agentsTransferMenuEnabled: PropTypes.bool,
  toggleAgents: PropTypes.func.isRequired,
  transferLists: PropTypes.array.isRequired,
  queues: PropTypes.array.isRequired,
  toggleQueue: PropTypes.func.isRequired,
  toggleAllQueues: PropTypes.func,
  selectedQueues: PropTypes.array.isRequired,
  toggleTransferList: PropTypes.func.isRequired,
  toggleAllTransferLists: PropTypes.func,
  selectedTransferLists: PropTypes.array.isRequired,
  setTransferLists: PropTypes.func.isRequired,
  showQueues: PropTypes.bool.isRequired,
  showTransferLists: PropTypes.bool.isRequired,
  toggleShowQueues: PropTypes.func.isRequired,
  toggleShowTransferLists: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    toggleAgents: (agents) =>
      dispatch(toggleAgentsTransferMenuPreference(agents)),
    toggleQueue: (queue) =>
      dispatch(toggleSelectedQueueTransferMenuPreference(queue)),
    toggleAllQueues: (queues) =>
      dispatch(toggleAllSelectedQueuesTransferMenuPreference(queues)),
    toggleTransferList: (transferList) =>
      dispatch(toggleSelectedTransferListTransferMenuPreference(transferList)),
    toggleAllTransferLists: (transferLists) =>
      dispatch(
        toggleAllSelectedTransferListsTransferMenuPreference(transferLists)
      ),
    setTransferLists: () => dispatch(setTransferLists()),
    toggleShowQueues: (queues) =>
      dispatch(toggleShowQueuesTransferMenuPreference(queues)),
    toggleShowTransferLists: (transferLists) =>
      dispatch(toggleShowTransferListsTransferMenuPreference(transferLists)),
    dispatch,
  };
}

export default ErrorBoundary(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AgentTransferMenuPreferenceMenu)
);
