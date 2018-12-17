import { fromJS } from 'immutable';
import { selectMessageTemplates } from '../selectors';

describe('selectMessageTemplates', () => {
  it('should filter out active messaging templates from those assigned to agents', () => {
    expect(
      selectMessageTemplates(
        fromJS({
          agentDesktop: {
            userConfig: {
              messageTemplates: [{ active: true }, { active: false }],
            },
          },
        })
      )
    ).toMatchSnapshot();
  });
  it('should return empty array when no messaging-templates are assigned to agents', () => {
    expect(
      selectMessageTemplates(
        fromJS({ agentDesktop: { userConfig: { messageTemplates: [] } } })
      )
    ).toEqual([]);
  });
});
