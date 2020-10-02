import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import messages from './messages';

function Queues(props){
  return (
    <>
      {props.hasAgentExperienceTransferMenuQueuesViewPermission && (
        <div style={props.styles.transferListDivContainer}>
          {props.globalQueues.length > 0 && (
            <div
              id="queuesExpandCollapseBtn"
              key="queuesListBtn"
              style={props.styles.expandedTransferHeading}
              onClick={() => props.updateQueuesListVisibleState()}
            >
              <FormattedMessage {...messages.queues} />
              {(props.queuesListVisibleState ||
                  props.transferSearchInput.trim() !== '') && (
                <div
                  id="refreshQueues"
                  key="queuesRefreshBtn"
                  style={[
                    props.styles.refresh,
                    (props.globalQueues === undefined ||
                        props.globalQueues[0] === undefined ||
                        props.globalQueues[0].queueTime === undefined ||
                        !props.batchRequestsAreSuccessful) &&
                        props.styles.refreshInProgress,
                  ]}
                  onClick={props.refreshQueuesButton}
                >
                    &#8635;
                </div>
              )}
              <Icon
                name="caret"
                style={
                  props.queuesListVisibleState
                    ? props.styles.iconOpen
                    : props.styles.iconClosed
                }
              />
            </div>
          )}
          {(props.queuesListVisibleState ||
              props.transferSearchInput.trim() !== '') &&
              props.queues}
          <div className="bigSpacer" style={props.styles.lineSpacer} />
        </div>
      )}
    </>
  );
}

Queues.propTypes = {
  hasAgentExperienceTransferMenuQueuesViewPermission: PropTypes.bool.isRequired,
  updateQueuesListVisibleState: PropTypes.func.isRequired,
  queuesListVisibleState: PropTypes.bool,
  transferSearchInput: PropTypes.string,
  batchRequestsAreSuccessful: PropTypes.bool.isRequired,
  globalQueues: PropTypes.array.isRequired,
  refreshQueuesButton: PropTypes.func.isRequired,
  queues: PropTypes.array.isRequired,
  styles: PropTypes.object.isRequired,
};

export default Radium(Queues);
