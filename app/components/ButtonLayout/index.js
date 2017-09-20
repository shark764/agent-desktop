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
import Radium from 'radium';

import Button, { possibleTypes } from 'components/Button';
import ButtonMenu from 'components/ButtonMenu';

const styles = {
  indivButtonContainer: {
    display: 'inline-block',
    margin: '0 8px 0 0',
  },
};

function ButtonLayout(props, context) {
  if (context.toolbarMode && props.buttonConfig.length > 1) {
    return (
      <ButtonMenu
        buttonConfig={props.buttonConfig}
        {...props.buttonMenuConfig}
      />
    );
  } else {
    return (
      <span>
        {props.buttonConfig.map((val) =>
          (<span
            style={styles.indivButtonContainer}
            key={`btn-container-${val.id}`}
          >
            <Button {...val} />
          </span>)
        )}
      </span>
    );
  }
}

export const buttonConfigPropTypes = {
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
  isSelected: PropTypes.bool,
};

ButtonLayout.propTypes = {
  buttonConfig: PropTypes.arrayOf(PropTypes.shape(buttonConfigPropTypes))
    .isRequired,
  buttonMenuConfig: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.string,
    text: PropTypes.any,
  }).isRequired,
};

ButtonLayout.contextTypes = {
  toolbarMode: PropTypes.bool,
};

export default Radium(ButtonLayout);
