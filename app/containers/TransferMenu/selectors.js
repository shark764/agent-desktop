/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */
import { createSelector } from 'reselect';
import { selectBatchRequests } from 'containers/Toolbar/selectors';
import { selectAgent } from 'containers/Login/selectors';
import { getCurrentTenantPermissions } from 'containers/App/selectors';
import { sortOrder } from 'utils/validator';

const selectAgentDesktopDomain = state => state.get('agentDesktop');

const selectWarmTransfers = createSelector(
  selectAgentDesktopDomain,
  agentDesktop => {
    if (agentDesktop.interactions !== undefined) {
      return agentDesktop
        .get('interactions')
        .find(interaction => interaction.get('channelType') === 'voice')
        .get('warmTransfers')
        .toJS();
    } else {
      return null;
    }
  }
);

const selectResourceCapacity = state =>
  state.getIn(['transferMenu', 'resourceCapacity']);

const selectUsers = state => state.getIn(['transferMenu', 'users']);

const selectQueuesListVisibleState = state =>
  state.getIn(['transferMenu', 'queuesListVisibleState']);

const selectAgentsListVisibleState = state =>
  state.getIn(['transferMenu', 'agentsListVisibleState']);

const selectTransferSearchInput = state =>
  state.getIn(['transferMenu', 'transferSearchInput']);

const selectTransferTabIndex = state =>
  state.getIn(['transferMenu', 'transferTabIndex']);

const selectFocusedTransferItemIndex = state =>
  state.getIn(['transferMenu', 'focusedTransferItemIndex']);

const selectShowTransferDialpad = state =>
  state.getIn(['transferMenu', 'showTransferDialpad']);

const selectAgents = createSelector(
  selectBatchRequests,
  selectResourceCapacity,
  selectUsers,
  selectAgent,
  (batchRequestsSuccessful, resourceCapacityList, users, activeAgent) => {
    let agentList;
    if (batchRequestsSuccessful) {
      if (resourceCapacityList !== undefined) {
        agentList = resourceCapacityList.toJS();

        /* Sometimes batch-request sends same agent Information multiple times because of a backend bug which breaks the TransferMenu UI */

        // Finds out if there are any active duplicate agent sessions going on:
        const isDuplicateAgentSessionExist = agentList.reduce(
          (prev, current) => {
            if (!prev) return undefined;
            else {
              return prev.agentId === current.agentId ? undefined : current;
            }
          }
        );

        // Gets the most recent logged in agent information (so that reportig stats will be displayed under the most recent agent session):
        if (!isDuplicateAgentSessionExist) {
          agentList = agentList.reduce(
            (accumulator, currentValue, index, originalAgentsList) => {
              const agentAlreadyExists = accumulator.find(
                agentInfo => agentInfo.agentId === currentValue.agentId
              );
              if (!agentAlreadyExists) {
                const mostRecentLoggedinDuplicateAgent = originalAgentsList
                  .filter(v => v.agentId === currentValue.agentId)
                  .reduce(
                    (prev, current) =>
                      new Date(prev.loginTimestamp).getTime() >
                      new Date(current.loginTimestamp).getTime()
                        ? prev
                        : current
                  );
                accumulator.push(mostRecentLoggedinDuplicateAgent);
              }
              return accumulator;
            },
            []
          );
        }

        const agents = agentList
          .filter(
            agent =>
              agent.direction !== 'agent-initiated' &&
              agent.agentId !== activeAgent.userId
          )
          .map(agent => {
            let hasVoiceCapacity = false;
            if (agent.capacity) {
              const voiceCapacity = agent.capacity.find(agentCapacity =>
                Object.keys(agentCapacity.channels).includes('voice')
              );
              if (voiceCapacity) {
                hasVoiceCapacity =
                  voiceCapacity.allocation !== 'fully-allocated';
              }
            }
            return {
              agentId: agent.agentId,
              firstName: agent.agentName ? agent.agentName.split(' ')[0] : '',
              lastName: agent.agentName ? agent.agentName.split(' ')[1] : '',
              name: agent.agentName ? agent.agentName : '',
              isAvailable: agent.presence === 'ready' && hasVoiceCapacity,
            };
          })
          .sort((agent1, agent2) => {
            // Ready agents first, then sort by name alphabetically
            if (agent1.isAvailable && !agent2.isAvailable) return -1;
            if (!agent1.isAvailable && agent2.isAvailable) return 1;
            if (
              agent1.firstName.toLowerCase() + agent1.lastName.toLowerCase() <
              agent2.firstName.toLowerCase() + agent2.lastName.toLowerCase()
            )
              return -1;
            if (
              agent1.firstName.toLowerCase() + agent1.lastName.toLowerCase() >
              agent2.firstName.toLowerCase() + agent2.lastName.toLowerCase()
            )
              return 1;
            return 0;
          });
        agentList = agents;
      }
      return agentList;
    } else {
      if (users !== undefined) {
        agentList = users.toJS();
        const agents = agentList
          .filter(agent => agent.id !== activeAgent.userId)
          .map(agent => ({
            agentId: agent.id,
            firstName: agent.firstName,
            lastName: agent.lastName,
            name: `${agent.firstName} ${agent.lastName}`,
            isAvailable: agent.state === 'ready',
          }))
          .sort((agent1, agent2) => {
            // Ready agents first, then sort by name alphabetically
            if (agent1.isAvailable && !agent2.isAvailable) return -1;
            if (!agent1.isAvailable && agent2.isAvailable) return 1;
            if (
              agent1.firstName.toLowerCase() + agent1.lastName.toLowerCase() <
              agent2.firstName.toLowerCase() + agent2.lastName.toLowerCase()
            )
              return -1;
            if (
              agent1.firstName.toLowerCase() + agent1.lastName.toLowerCase() >
              agent2.firstName.toLowerCase() + agent2.lastName.toLowerCase()
            )
              return 1;
            return 0;
          });
        agentList = agents;
      }
      return agentList;
    }
  }
);

const selectUserAssigTransListsMap = state =>
  state.getIn([
    'transferMenu',
    'userAssignedTransferLists',
    'pstnSipQueueTransferLists',
  ]);

const selectUserAssignedTransferLists = createSelector(
  selectUserAssigTransListsMap,
  allUserAssignedTranslists => {
    if (allUserAssignedTranslists && allUserAssignedTranslists.size > 0) {
      return allUserAssignedTranslists.toJS().sort((a, b) => sortOrder(a, b));
    } else {
      return null;
    }
  }
);

const selectUserAssigNonVoiceTransListsMap = state =>
  state.getIn([
    'transferMenu',
    'userAssignedTransferLists',
    'onlyQueueTransferLists',
  ]);

const selectUserAssigNonVoiceTransLists = createSelector(
  selectUserAssigNonVoiceTransListsMap,
  nonVoiceTransferLists => {
    if (nonVoiceTransferLists && nonVoiceTransferLists.size > 0) {
      return nonVoiceTransferLists.toJS();
    } else {
      return null;
    }
  }
);

const selectUserAssigVoiceTransListsLoadSt = state =>
  state.getIn([
    'transferMenu',
    'userAssignedTransferLists',
    'voiceListsLoadingState',
  ]);

const selectUserAssigNonVoiceTransListsLoadSt = state =>
  state.getIn([
    'transferMenu',
    'userAssignedTransferLists',
    'nonVoiceListsLoadingState',
  ]);

const selectUserAssigTransListsVisbileStateMap = state =>
  state.getIn([
    'transferMenu',
    'userAssignedTransferLists',
    'transferListsVisibleState',
  ]);

const selectUserAssigTransListsVisibleSt = createSelector(
  selectUserAssigTransListsVisbileStateMap,
  transferListsVisibleState => {
    if (transferListsVisibleState) {
      return transferListsVisibleState.toJS();
    } else {
      return null;
    }
  }
);

const selectUserAssigAllTransListsVisibleSt = state =>
  state.getIn([
    'transferMenu',
    'userAssignedTransferLists',
    'allTransferListsVisibleState',
  ]);

const selectHasAgentExperienceTransferMenuQueuesViewPermission = createSelector(
  [getCurrentTenantPermissions],
  tenantPermissions =>
    tenantPermissions.includes('AGENT_EXPERIENCE_TRANSFER_MENU_QUEUES_VIEW')
);

const selectHasAgentExperienceTransferMenuAgentsViewPermission = createSelector(
  [getCurrentTenantPermissions],
  tenantPermissions =>
    tenantPermissions.includes('AGENT_EXPERIENCE_TRANSFER_MENU_AGENTS_VIEW')
);

export {
  selectWarmTransfers,
  selectAgents,
  selectUsers,
  selectQueuesListVisibleState,
  selectAgentsListVisibleState,
  selectTransferSearchInput,
  selectTransferTabIndex,
  selectFocusedTransferItemIndex,
  selectShowTransferDialpad,
  selectUserAssignedTransferLists,
  selectUserAssigNonVoiceTransLists,
  selectUserAssigVoiceTransListsLoadSt,
  selectUserAssigNonVoiceTransListsLoadSt,
  selectUserAssigTransListsVisibleSt,
  selectUserAssigAllTransListsVisibleSt,
  selectHasAgentExperienceTransferMenuQueuesViewPermission,
  selectHasAgentExperienceTransferMenuAgentsViewPermission,
};
