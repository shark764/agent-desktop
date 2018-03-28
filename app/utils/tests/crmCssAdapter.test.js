/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import crmCssAdapter from '../crmCssAdapter';

describe('crmCssAdapter', () => {
  it('modifies the style object based on which CRM toolbar is working within', () => {
    const crmModule = 'salesforce-lightning';
    const testStyles = {
      testStyleOrig: {
        width: '100px',
        height: '100px',
      },
      testStyleOrigSfLightning: {
        width: '200px',
        border: '1px solid red',
      },
      anotherTestStyleOrig: {
        width: '400px',
        height: '100px',
      },
      anotherTestStyleOrigSfLightning: {
        width: '500px',
        border: '6px solid green',
      },      
    }
  
    crmCssAdapter(
      testStyles, 
      [ 'testStyleOrig',
        'anotherTestStyleOrig'],
      crmModule
    );
    
    expect(testStyles.testStyleOrig.width).toEqual('200px');
    expect(testStyles.testStyleOrig.border).toEqual('1px solid red');
    expect(testStyles.testStyleOrig.height).toEqual('100px');
    expect(testStyles.anotherTestStyleOrig.width).toEqual('500px');
  });
});
