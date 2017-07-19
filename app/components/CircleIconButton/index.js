/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/**
*
* CircleIconButton
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';

import Icon from 'components/Icon';

const styles = {
  base: {
    border: 'none',
    borderRadius: '50%',
    outline: 'none',
    padding: 0,
    ':focus': {
      border: 'none',
    },
    display: 'inline-block',
  },
};

function CircleIconButton(props) {
  return (
    // using a div instead of a button here since we're now allowing
    // HTML into the button for the purpose of more simpler dynamic
    // positioning, using "role" & "tabindex" attributes for semantics and accessibility
    <div
      id={props.id}
      style={[styles.base, props.style]}
      onClick={props.onClick}
      role="button"
      tabIndex={0}
    >
      <Icon
        id={`${props.id}-icon`}
        name={props.name}
        active={props.active}
        style={[styles.base, props.style, styles.icon]}
      />
      {props.innerElement &&
        <div>
          {props.innerElement}
        </div>}
    </div>
  );
}

CircleIconButton.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  style: PropTypes.object,
  active: PropTypes.bool,
  innerElement: PropTypes.element,
  onClick: PropTypes.func.isRequired,
};

export default Radium(CircleIconButton);
