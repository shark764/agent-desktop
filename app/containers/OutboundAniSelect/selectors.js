import { createSelector } from 'reselect';

export const outboundIdentificationLists = (state) =>
  state.getIn(['outboundAniSelect', 'outboundIdentifierLists']);

const getChannelTypes = (state, props) => props.channelTypes;

export const selectOutboundIdentifierListsForChannel = createSelector(
  outboundIdentificationLists,
  getChannelTypes,
  (outboundIdentifierLists, inputChannelTypes) => {
    const outboundList = [];
    if (outboundIdentifierLists) {
      const outboundIdentifierListsJs = outboundIdentifierLists.toJS();
      outboundIdentifierListsJs.effective
        .filter((outbound) => outbound.active === true)
        .forEach((outboundIdentifierList) => {
          outboundIdentifierList.members
            .filter(
              ({ channelType, active }) =>
                inputChannelTypes.includes(channelType) && active === true
            )
            .map(({ id, value, name, flowId }) => ({
              label: name,
              value: id,
              outboundIdentifier: value,
              flowId,
            }))
            .forEach((member) => {
              outboundList.push(member);
            });
        });
    }
    return outboundList;
  }
);

const selectedOutboundId = (state) =>
  state.getIn(['outboundAniSelect', 'selectedOutboundIdentifier']);

export const getSelectedOutboundIdentifier = createSelector(
  selectedOutboundId,
  (outboundAniSelect) => {
    if (outboundAniSelect) {
      return outboundAniSelect.toJS();
    }
    return null;
  }
);
