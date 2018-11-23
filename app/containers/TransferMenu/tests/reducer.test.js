import reducer from '../reducer';
import * as action from '../actions';

describe('TransferMenu reducer tests', () => {
  it('returns initial state', () => {
    expect(reducer(undefined, {})).toMatchSnapshot();
  });
  it('sets queuesListVisibleState', () => {
    expect(
      reducer(undefined, action.setQueuesListVisibleState(true))
    ).toMatchSnapshot();
  });
  it('sets agentsListVisibleState', () => {
    expect(
      reducer(undefined, action.setAgentsListVisibleState(true))
    ).toMatchSnapshot();
  });
  it('sets transferLists', () => {
    expect(
      reducer(
        undefined,
        action.getAndSetTransferLists([
          { mockTransferListKey: 'mockTransferListValue' },
        ])
      )
    ).toMatchSnapshot();
  });
  it('sets transferListsListVisibleState', () => {
    expect(
      reducer(
        undefined,
        action.setTransferListsVisibleState({
          mockTransferListHiddenState: 'mockValueTrue',
        })
      )
    ).toMatchSnapshot();
  });
});
