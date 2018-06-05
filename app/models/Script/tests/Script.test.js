/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import Script from '../Script';

describe('Script', () => {
  describe('constructor', () => {
    it('should construct properly', () => {
      const script = new Script({
        id: 'special-id',
        name: 'special-name',
        elements: [{
          type: 'text',
          name: 'text-name',
        },{
          type: 'freeform',
          name: 'freeform-input-name',
          value: 'freeform-input-value',
        },{
          type: 'checkbox-input',
          name: 'checkbox-input-name',
          options: [{
            value: 'checkbox1',
          },{
            value: 'checkbox2',
          }],
        },{
          type: 'dropdown',
          name: 'dropdown-name',
        },{
          type: 'scale',
          name: 'scale-name',
        }],
        autoScriptDismiss: true,
        scriptReporting: true,
      });
      expect(script).toMatchSnapshot();
    });
  });
});
