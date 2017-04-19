import { fromJS } from 'immutable';
import { selectEnabledStats, selectAvailableStats } from '../selectors';

const mockState = fromJS({
  toolbar: {
    enabledStats: ['mockEnabledStat'],
    availableStats: ['mockAvailableStat'],
  },
});

describe('selectEnabledStats', () => {
  it('Should return enabledStats from the toolbar domain', () => {
    expect(selectEnabledStats(mockState)).toMatchSnapshot();
  });
});

describe('selectAvailableStats', () => {
  it('Should return availableStats from the toolbar domain', () => {
    expect(selectAvailableStats(mockState)).toMatchSnapshot();
  });
});
