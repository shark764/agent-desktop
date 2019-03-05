/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */
import { createSelector } from 'reselect';
import { selectBatchRequests } from 'containers/Toolbar/selectors';
import { selectAgent } from 'containers/Login/selectors';

const selectAgentDesktopDomain = (state) => state.get('agentDesktop');

const selectWarmTransfers = createSelector(
  selectAgentDesktopDomain,
  (agentDesktop) => {
    if (agentDesktop.interactions !== undefined) {
      return agentDesktop
        .get('interactions')
        .find((interaction) => interaction.get('channelType') === 'voice')
        .get('warmTransfers')
        .toJS();
    } else {
      return null;
    }
  }
);

const selectResourceCapacity = (state) =>
  state.getIn(['transferMenu', 'resourceCapacity']);

const selectUsers = (state) => state.getIn(['transferMenu', 'users']);

const selectQueuesListVisibleState = (state) =>
  state.getIn(['transferMenu', 'queuesListVisibleState']);

const selectAgentsListVisibleState = (state) =>
  state.getIn(['transferMenu', 'agentsListVisibleState']);

const selectTransferSearchInput = (state) =>
  state.getIn(['transferMenu', 'transferSearchInput']);

const selectTransferTabIndex = (state) =>
  state.getIn(['transferMenu', 'transferTabIndex']);

const selectFocusedTransferItemIndex = (state) =>
  state.getIn(['transferMenu', 'focusedTransferItemIndex']);

const selectShowTransferDialpad = (state) =>
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
        const agents = agentList
          .filter(
            (agent) =>
              agent.direction !== 'agent-initiated' &&
              agent.agentId !== activeAgent.userId
          )
          .map((agent) => {
            let hasVoiceCapacity = false;
            if (agent.capacity) {
              const voiceCapacity = agent.capacity.find((agentCapacity) =>
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
            if (!agent1.isAvailable && agent2.isAvailable) return -1;
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
          .filter((agent) => agent.id !== activeAgent.userId)
          .map((agent) => ({
            agentId: agent.id,
            firstName: agent.firstName,
            lastName: agent.lastName,
            name: `${agent.firstName} ${agent.lastName}`,
            isAvailable: agent.state === 'ready',
          }))
          .sort((agent1, agent2) => {
            // Ready agents first, then sort by name alphabetically
            if (agent1.isAvailable && !agent2.isAvailable) return -1;
            if (!agent1.isAvailable && agent2.isAvailable) return -1;
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

const selectuserAssignedTransferListsMap = (state) =>
  state.getIn(['transferMenu', 'transferLists', 'userAssignedTransferLists']);

const selectUserAssignedTransferLists = createSelector(
  selectuserAssignedTransferListsMap,
  (userAssignedTransferLists) => {
    if (userAssignedTransferLists && userAssignedTransferLists.size > 0) {
      return userAssignedTransferLists.toJS();
    } else {
      return null;
    }
  }
);

const selectUserAssignedTransferListsLoadingState = (state) =>
  state.getIn([
    'transferMenu',
    'transferLists',
    'userAssignedTransferListsLoadingState',
  ]);

const selectUserAssignedTransferListsVisibleStateMap = (state) =>
  state.getIn([
    'transferMenu',
    'transferLists',
    'userAssignedTransferListsVisibleState',
  ]);

const selectUserAssignedTransferListsVisibleState = createSelector(
  selectUserAssignedTransferListsVisibleStateMap,
  (userAssignedTransferListsVisibleState) => {
    if (userAssignedTransferListsVisibleState) {
      return userAssignedTransferListsVisibleState.toJS();
    } else {
      return null;
    }
  }
);

const selectVisibleStateOfAllUserAssignedTrasferLists = (state) =>
  state.getIn([
    'transferMenu',
    'transferLists',
    'visibleStateOfAllUserAssignedTransferLists',
  ]);

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
  selectUserAssignedTransferListsLoadingState,
  selectUserAssignedTransferListsVisibleState,
  selectVisibleStateOfAllUserAssignedTrasferLists,
};
