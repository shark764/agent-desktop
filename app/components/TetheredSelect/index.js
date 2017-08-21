/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/**
*
* TetheredSelect
*
*/

import React from 'react';
import Select from 'react-select';
import TetherComponent from 'react-tether';
import Radium from 'radium';

class TetheredSelect extends Select {
  constructor(props) {
    super(props);
    this.renderOuter = this._renderOuter; // eslint-disable-line
  }

  _renderOuter() {
    const menu = super.renderOuter.apply(this, arguments); // eslint-disable-line

    // Don't return an updated menu render if we don't have one
    if (!menu) {
      return undefined;
    }

    /* this.wrapper comes from the ref of the main Select component (super.render()) */
    const selectWidth = this.wrapper ? this.wrapper.offsetWidth : null;

    return (
      <TetherComponent
        style={{ zIndex: '4', paddingBottom: '2em' }}
        renderElementTo="body"
        ref="tethered-component" // eslint-disable-line
        attachment="top left"
        targetAttachment="top left"
        constraints={[
          {
            to: 'window',
            attachment: 'together',
            pin: ['top'],
          },
        ]}
      >
        {/* Apply position:static to our menu so that it's parent will get the correct dimensions and we can tether the parent */}
        <div />
        {React.cloneElement(menu, {
          style: { position: 'relative', width: selectWidth },
        })}
      </TetherComponent>
    );
  }
}

export default Radium(TetheredSelect);
