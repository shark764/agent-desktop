import { Map } from 'immutable';
import reducer from '../reducer';
import * as action from '../actions';

describe('TransferMenu reducer tests', () => {
  it('returns initial state', () => {
    expect(reducer(undefined, {})).toMatchSnapshot();
  });
  it('sets queuesListVisibleState', () => {
    expect(
      reducer(Map(), action.setQueuesListVisibleState(true))
    ).toMatchSnapshot();
  });
  it('sets agentsListVisibleState', () => {
    expect(
      reducer(Map(), action.setAgentsListVisibleState(true))
    ).toMatchSnapshot();
  });
  it('updates showTransferDialpad state', () => {
    expect(
      reducer(Map(), action.setShowTransferDialPad(true))
    ).toMatchSnapshot();
  });
  it('sets transferSearchInput', () => {
    expect(
      reducer(Map(), action.setTransferSearchInput('mockTransferSearchInput'))
    ).toMatchSnapshot();
  });
  it('sets transferTabIndex', () => {
    expect(reducer(Map(), action.setTransferTabIndex(1))).toMatchSnapshot();
  });
  it('sets focusedTransferItemIndex', () => {
    expect(
      reducer(Map(), action.setFocusedTransferItemIndex(0))
    ).toMatchSnapshot();
  });
  it('sets userAssigned voice interaction TransferLists', () => {
    expect(
      reducer(
        Map(),
        action.setUserAssignedTransferLists(
          [{ mockTransferListKey: 'mockTransferListValue' }],
          'voice'
        )
      )
    ).toMatchSnapshot();
  });
  it('sets userAssigned non-voice interaction TransferLists', () => {
    expect(
      reducer(
        Map(),
        action.setUserAssignedTransferLists(
          [{ mockTransferListKey: 'mockTransferListValue' }],
          'nonVoice'
        )
      )
    ).toMatchSnapshot();
  });
  it('sets userAssigned voice interaction TransferLists LoadingState', () => {
    expect(
      reducer(
        Map(),
        action.setUserAssignedTransferListsLoadingState('voice', true)
      )
    ).toMatchSnapshot();
  });
  it('sets userAssigned non-voice interaction TransferLists LoadingState', () => {
    expect(
      reducer(
        Map(),
        action.setUserAssignedTransferListsLoadingState('nonVoice', true)
      )
    ).toMatchSnapshot();
  });
  it('sets userAssignedTransferListsVisibleState', () => {
    expect(
      reducer(
        Map(),
        action.setUserAssignedTransferListsVisibleState({
          'assignedTransferList-abc': true,
        })
      )
    ).toMatchSnapshot();
  });
  it('sets visibleStateOfAllUserAssignedTransferLists', () => {
    expect(
      reducer(Map(), action.setVisibleStateOfAllUserAssignedTransferLists(true))
    ).toMatchSnapshot();
  });
});
