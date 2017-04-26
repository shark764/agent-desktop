import { createSelector } from 'reselect';

const selectLoginDomain = (state) => state.get('login');
const selectAgentDesktopDomain = (state) => state.get('agentDesktop');

const selectLogin = createSelector(
  selectLoginDomain,
  (substate) => substate.toJS()
);

const selectAgentDesktop = createSelector(
  selectAgentDesktopDomain,
  (substate) => substate.toJS()
);

const selectAgentId = createSelector(
   selectLoginDomain,
   (login) => login.get('agent').get('userId')
 );

const selectInteractions = createSelector(
  selectAgentDesktopDomain,
  (agentDesktop) => agentDesktop.get('interactions')
);

const getSelectedInteractionId = createSelector(
  selectAgentDesktopDomain,
  (agentDesktop) => agentDesktop.get('selectedInteractionId')
);

const selectSelectedInteraction = createSelector(
  [selectInteractions, getSelectedInteractionId],
  (interactions, selectedInteractionId) => interactions.toJS().filter(
    (interaction) => interaction.interactionId === selectedInteractionId
  )[0]
);

const selectAwaitingDisposition = createSelector(
  selectSelectedInteraction,
  (interaction) => (
    typeof interaction !== 'undefined' &&
    interaction.status === 'wrapup' &&
    interaction.dispositionDetails.forceSelect &&
    interaction.dispositionDetails.selected.length === 0
  )
);

const selectPresenceReasonListId = createSelector(
  selectAgentDesktopDomain,
  (agentDesktop) => (
    agentDesktop.getIn(['presenceReasonList', 'id'])
  )
);

export default selectAgentDesktop;
export {
  selectInteractions,
  selectLogin,
  selectAgentId,
  selectAwaitingDisposition,
  selectPresenceReasonListId,
};
