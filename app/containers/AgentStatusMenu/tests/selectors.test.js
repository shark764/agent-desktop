import { fromJS } from 'immutable';
import {
  selectHasActiveInteractions,
  selectExtensions,
  selectActiveExtension,
} from '../selectors';

describe('selectHasActiveInteractions', () => {
  describe('if an interaction is present with status work-accepting', () => {
    const mockState = fromJS({
      agentDesktop: {
        interactions: [{
          status: 'work-accepting',
        }],
      },
    });

    it('should return true', () => {
      expect(selectHasActiveInteractions(mockState)).toEqual(true);
    });
  });

  describe('if an interaction is present with status work-accepted', () => {
    const mockState = fromJS({
      agentDesktop: {
        interactions: [{
          status: 'work-accepted',
        }],
      },
    });

    it('should return true', () => {
      expect(selectHasActiveInteractions(mockState)).toEqual(true);
    });
  });

  describe('if no interaction is present with valid active status', () => {
    const mockState = fromJS({
      agentDesktop: {
        interactions: [{
          status: 'nonActiveStatus',
        }],
      },
    });

    it('should return false', () => {
      expect(selectHasActiveInteractions(mockState)).toEqual(false);
    });
  });

  describe('selectExtensions', () => {
    const mockState = fromJS({
      agentDesktop: {
        extensions: ['mockExtension'],
      },
    });

    it('Should return extensions from the agentDesktop domain', () => {
      expect(selectExtensions(mockState)).toMatchSnapshot();
    });
  });

  describe('selectActiveExtention', () => {
    const mockState = fromJS({
      agentDesktop: {
        activeExtension: { mockExtension: 'mockExtension' },
      },
    });

    it('Should return activeExtension from the agentDesktop domain', () => {
      expect(selectActiveExtension(mockState)).toMatchSnapshot();
    });
  });
});
