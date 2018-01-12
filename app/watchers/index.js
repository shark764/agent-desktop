import { isUUID } from 'utils/validator';

export default [
  {
    statePath: 'agentDesktop.selectedInteractionId',
    watchAction: (newVal, oldVal) => {
      if (isUUID(oldVal)) {
        CxEngage.interactions.unfocus({ interactionId: oldVal });
      }
      if (isUUID(newVal)) {
        CxEngage.interactions.focus({ interactionId: newVal });
      }
    },
  },
];
