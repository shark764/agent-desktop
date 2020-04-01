import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import messages from './messages';

function Agents(props) {
  return (
    <React.Fragment>
      {!props.nonVoice &&
          props.showAgentsTransferMenuPreference &&
          props.hasAgentExperienceTransferMenuAgentsViewPermission && (
        <div style={props.styles.transferListDivContainer}>
          <div
            id="agentsExpandCollapseBtn"
            key="agentsListBtn"
            style={[
              { marginTop: '20px' },
              props.styles.expandedTransferHeading,
            ]}
            onClick={() =>
              !props.nonVoice &&
                  props.updateAgentsListVisibleState()
            }
          >
            <FormattedMessage {...messages.agents} />
            {(props.agentsListVisibleState ||
                  props.transferSearchInput.trim() !== '') && (
              <div
                id="refreshAgents"
                key="agentsRefreshBtn"
                style={[
                  props.styles.refresh,
                  props.selectAgents === undefined &&
                        props.styles.refreshInProgress,
                ]}
                onClick={props.refreshAgents}
              >
                    &#8635;
              </div>
            )}
            <Icon
              name="caret"
              style={
                props.agentsListVisibleState
                  ? props.styles.iconOpen
                  : props.styles.iconClosed
              }
            />
          </div>
          {(props.agentsListVisibleState ||
                props.transferSearchInput.trim() !== '') &&
                props.agents}
          <div className="bigSpacer" style={props.styles.lineSpacer} />
        </div>
      )}
    </React.Fragment>
  );
}

Agents.propTypes = {
  nonVoice: PropTypes.bool,
  showAgentsTransferMenuPreference: PropTypes.bool.isRequired,
  hasAgentExperienceTransferMenuAgentsViewPermission: PropTypes.bool.isRequired,
  updateAgentsListVisibleState: PropTypes.func.isRequired,
  agentsListVisibleState: PropTypes.bool,
  transferSearchInput: PropTypes.string,
  selectAgents: PropTypes.array,
  refreshAgents: PropTypes.func.isRequired,
  agents: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  styles: PropTypes.object.isRequired,
};

export default Radium(Agents);
