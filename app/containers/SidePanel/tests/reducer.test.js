import sidePanelReducer from '../reducer';

describe('sidePanelReducer', () => {
  it('returns the initial state', () => {
    expect(sidePanelReducer(undefined, {})).toMatchSnapshot();
  });
});
