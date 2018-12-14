import { goFetchOutboundIdentifierLists } from '../sagas';

describe('goFetchOutboundIdentifierLists', () => {
  global.CxEngage = {
    entities: {
      getUserOutboundIdentifierLists:
        'CxEngage.entities.getUserOutboundIdentifierLists',
    },
  };
  describe("when there's no outbound identifier list data on our state", () => {
    const generator = goFetchOutboundIdentifierLists();
    it('outboundIdentificationLists returns undefined the first time of its execution', () => {
      expect(generator.next(undefined)).toMatchSnapshot();
    });
    it('should call the promise util with the SDK goFetchOutboundIdentifierLists and the correct arguments', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('puts the result with setOutboundIdentification', () => {
      expect(generator.next('mock-result')).toMatchSnapshot();
    });
    it('is done', () => {
      expect(generator.next().done).toBe(true);
    });
  });
  describe("when there's outbound indentifier list data on our state", () => {
    const generator = goFetchOutboundIdentifierLists();
    it('select that returns an defined value ', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('is done', () => {
      expect(generator.next('mock-defined-value').done).toBe(true);
    });
  });
});
