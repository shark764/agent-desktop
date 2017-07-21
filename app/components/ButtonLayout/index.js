/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/**
*
* ButtonLayout
*
*/

import React from 'react';
import PropTypes from 'prop-types';

import Button, { possibleTypes } from 'components/Button';
import ButtonSplitMenu from 'components/ButtonSplitMenu';

const ButtonLayout = (props, context) => {
  if (context.toolbarMode && props.buttonConfig.length > 1) {
    return <ButtonSplitMenu buttonConfig={props.buttonConfig} />;
  } else {
    return (
      <span>
        {props.buttonConfig.map((val) => <Button key={val.id} {...val} />)}
      </span>
    );
  }
};

ButtonLayout.propTypes = {
  buttonConfig: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.any,
      mouseOverText: PropTypes.object,
      iconName: PropTypes.string,
      children: PropTypes.element,
      tabIndex: PropTypes.number,
      type: PropTypes.oneOf(possibleTypes),
      style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
      clear: PropTypes.bool,
      disabled: PropTypes.bool,
      onClick: PropTypes.func,
      id: PropTypes.string.isRequired,
      isMainBtn: PropTypes.bool,
      hasSubButtons: PropTypes.bool,
    })
  ).isRequired,
};

ButtonLayout.contextTypes = {
  toolbarMode: PropTypes.bool,
};

export default ButtonLayout;
