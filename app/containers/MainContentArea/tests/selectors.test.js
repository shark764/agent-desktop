import { fromJS } from 'immutable';
import {
  selectMessageTemplates,
  selectLastInteractionNotification,
} from '../selectors';

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
describe('selectLastInteractionNotification', () => {
  it("if there's an interaction notification and its an error, should return an object with the notification attributes plus the errorDescription attribute", () => {
    const mockState = fromJS({
      agentDesktop: {
        selectedInteractionId: 'mockId',
        interactions: [
          {
            interactionId: 'mockId',
            notifications: [
              {
                isError: true,
              },
            ],
          },
        ],
        noInteractionContactPanel: {},
        newInteractionPanel: {},
        currentCrmItemHistoryPanel: {},
      },
    });
    expect(
      selectLastInteractionNotification(mockState, {
        intl: {
          formatMessage: (x) => x,
        },
      })
    ).toMatchSnapshot();
  });
  it("if there's no interaction notification it should return null", () => {
    const mockState = fromJS({
      agentDesktop: {
        selectedInteractionId: 'mockId',
        interactions: [
          {
            interactionId: 'mockId',
          },
        ],
        noInteractionContactPanel: {},
        newInteractionPanel: {},
        currentCrmItemHistoryPanel: {},
      },
    });
    expect(
      selectLastInteractionNotification(mockState, {
        intl: {
          formatMessage: (x) => x,
        },
      })
    ).toBeNull();
  });
});
