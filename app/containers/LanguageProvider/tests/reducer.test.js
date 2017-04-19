import interactionsBarReducer from '../reducer';

describe('interactionsBarReducer', () => {
  it('returns the initial state', () => {
    expect(interactionsBarReducer(undefined, {})).toMatchSnapshot();
  });
});
