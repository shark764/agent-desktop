import { fromJS } from 'immutable';

import {
  selectIsReady,
  selectInInteractionContext,
  selectPopulatedLayout,
  selectPopulatedCompactAttributes,
  selectAttributes,
} from '../selectors';

// AgentDesktop Domain Selectors
describe('selectIsReady', () => {
  describe('if presence is ready', () => {
    const mockState = fromJS({
      agentDesktop: {
        presence: 'ready',
      },
    });
    it('should return true', () => {
      expect(selectIsReady(mockState)).toEqual(true);
    });
  });
  describe('if presence is not ready', () => {
    const mockState = fromJS({
      agentDesktop: {
        presence: 'literallyAnyOtherString',
      },
    });
    it('should return false', () => {
      expect(selectIsReady(mockState)).toEqual(false);
    });
  });
});

describe('selectInInteractionContext', () => {
  describe('if a selected interaction id is defined', () => {
    const mockState = fromJS({
      agentDesktop: {
        selectedInteractionId: 'mockInteractionId',
      },
    });
    it('should return true', () => {
      expect(selectInInteractionContext(mockState)).toEqual(true);
    });
  });
  describe('if a selected interaction id is not defined', () => {
    const mockState = fromJS({
      agentDesktop: {},
    });
    it('should return false', () => {
      expect(selectInInteractionContext(mockState)).toEqual(false);
    });
  });
});

// SidePanel Domain Selectors
describe('selectPopulatedLayout', () => {
  it('should return the Layout with attributes populated', () => {
    const mockState = fromJS({
      sidePanel: {
        contactLayout: {
          layout: [
            { attributes: ['mockAttributeIdOne', 'mockAttributeIdTwo'] },
            { attributes: ['mockAttributeIdThree'] },
          ],
        },
        contactAttributes: [
          { id: 'mockAttributeIdOne' },
          { id: 'mockAttributeIdTwo' },
          { id: 'mockAttributeIdThree' },
        ],
      },
    });

    expect(selectPopulatedLayout(mockState)).toMatchSnapshot();
  });
});

describe('selectPopulatedCompactAttributes', () => {
  it('should return the first section of the layout with attributes populated from attributes', () => {
    const mockState = fromJS({
      sidePanel: {
        contactLayout: {
          layout: [
            { attributes: ['mockAttributeIdOne', 'mockAttributeIdTwo'] },
            { attributes: ['mockAttributeIdThree'] },
          ],
        },
        contactAttributes: [
          { id: 'mockAttributeIdOne' },
          { id: 'mockAttributeIdTwo' },
          { id: 'mockAttributeIdThree' },
        ],
      },
    });

    expect(selectPopulatedCompactAttributes(mockState)).toMatchSnapshot();
  });
});

describe('selectAttributes', () => {
  it('should return the  attributes from the SidePanel domain', () => {
    const mockState = fromJS({
      sidePanel: {
        contactAttributes: ['mockContactAttribute'],
      },
    });

    expect(selectAttributes(mockState)).toMatchSnapshot();
  });
});
