import { createSelector } from 'reselect';
import { getSelectedInteraction } from 'containers/AgentDesktop/selectors';

const makeCanRemoveEmailFromList = () =>
  createSelector(
    [
      getSelectedInteraction,
      (state, props) => props.listName,
      (state, props) => props.index,
    ],
    (interaction, listName, index) => (
      (listName === 'tos' &&
          (interaction.direction === 'agent-initiated' ||
            (interaction.status !== 'work-ended-pending-script' &&
              interaction.status !== 'wrapup')) &&
          index !== 0) ||
        (listName !== 'tos' &&
          (interaction.status !== 'work-ended-pending-script' &&
            interaction.status !== 'wrapup'))
    )
  );

const canAddEmailToList = createSelector(
  getSelectedInteraction,
  (interaction) =>
    interaction.status !== 'work-ended-pending-script' &&
    interaction.status !== 'wrapup'
);

export { makeCanRemoveEmailFromList, canAddEmailToList };
