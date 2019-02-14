import { createSelector } from 'reselect';

export const outboundIdentificationLists = (state) =>
  state.getIn(['outboundAniSelect', 'outboundIdentifierLists']);

const getChannelTypes = (state, props) => props.channelTypes;

export const selectOutboundIdentifierListsForChannel = createSelector(
  outboundIdentificationLists,
  getChannelTypes,
  (outboundIdentifierLists, inputChannelTypes) => {
    let outboundList;
    if (outboundIdentifierLists) {
      outboundList = [];
      outboundIdentifierLists
        .toJS()
        .effective.filter((outbound) => outbound.active === true)
        .forEach((outboundIdentifierList) => {
          outboundIdentifierList.members.forEach(
            ({ id, value, name, flowId, channelType, active }) => {
              if (
                outboundList.findIndex((item) => item.value === id) === -1 &&
                inputChannelTypes.includes(channelType) &&
                active
              ) {
                outboundList.push({
                  label: name,
                  value: id,
                  outboundIdentifier: value,
                  flowId,
                  channelType,
                });
              }
            }
          );
        });
    }
    return outboundList;
  }
);

const selectedOutboundId = (state) =>
  state.getIn(['outboundAniSelect', 'selectedEmailOutboundIdentifier']);

export const getSelectedOutboundEmailIdentifier = createSelector(
  selectedOutboundId,
  (outboundAniSelect) => {
    if (outboundAniSelect) {
      return outboundAniSelect.toJS();
    }
    return null;
  }
);
const selectedOutboundPhoneId = (state) =>
  state.getIn(['outboundAniSelect', 'selectedPhoneOutboundIdentifier']);

export const getSelectedOutboundPhoneIdentifier = createSelector(
  selectedOutboundPhoneId,
  (outboundAniSelect) => {
    if (outboundAniSelect) {
      return outboundAniSelect.toJS();
    }
    return null;
  }
);
