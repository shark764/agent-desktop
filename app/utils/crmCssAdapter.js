/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
  * crmCssAdapter
  *
  * Updates CSS as needed to work with various CRM integrations
  *
  */

export default function crmCssAdapter (styleObject, styleNameArray, crmModule) {
  let styleAffix;
  if (crmModule === 'salesforce-lightning') {
    styleAffix = 'SfLightning';
  }

  styleNameArray.forEach((styleName) => {
    Object.assign(
      styleObject[styleName],
      styleObject[`${styleName}${styleAffix}`]
    );
  });
}