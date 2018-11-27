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
  it('sets transferLists', () => {
    expect(
      reducer(
        Map(),
        action.getAndSetTransferLists([
          { mockTransferListKey: 'mockTransferListValue' },
        ])
      )
    ).toMatchSnapshot();
  });
  it('sets transferListsListVisibleState', () => {
    expect(
      reducer(
        Map(),
        action.setTransferListsVisibleState({
          mockTransferListHiddenState: 'mockValueTrue',
        })
      )
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
});
