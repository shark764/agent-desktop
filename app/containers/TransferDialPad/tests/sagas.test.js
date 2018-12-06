import { changeDialPadText } from '../sagas';

describe('changeDialPadText', () => {
  const action = {
    dialpadText: '123aA456!@7890*#%',
  };
  const generator = changeDialPadText(action);
  it('updates dialpadText state by dispatching setDialpadText action', () => {
    expect(generator.next()).toMatchSnapshot();
  });
  it('is done', () => {
    expect(generator.next().done).toBe(true);
  });
});
