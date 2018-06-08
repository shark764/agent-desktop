/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import Immutable, { List, Map, fromJS } from 'immutable';

export default class Script extends Immutable.Record({
  id: 'no-id',
  name: 'no-name',
  elements: new List(),
  values: new Map(),
  autoScriptDismiss: false,
  scriptReporting: false,
  scrollTop: 0,
}) {
  constructor({
    id,
    name,
    elements,
    autoScriptDismiss,
    scriptReporting,
    scrollTop,
    sending,
  }) {
    const scriptValues = {};

    if (elements) {
      elements.forEach((element) => {
        switch (element.type) {
          case 'freeform':
            if (!element.value) {
              scriptValues[element.name] = '';
            } else {
              scriptValues[element.name] = element.value;
            }
            break;
          case 'dropdown':
          case 'scale':
            scriptValues[element.name] = null;
            break;
          case 'checkbox': {
            const checkboxOptions = {};
            element.options.forEach((option) => {
              checkboxOptions[option.value] = false;
            });
            scriptValues[element.name] = checkboxOptions;
            break;
          }
          default:
            break;
        }
      });
    }

    super({
      id,
      name,
      elements,
      values: fromJS(scriptValues),
      autoScriptDismiss,
      scriptReporting,
      scrollTop,
      sending,
    });
  }
}
