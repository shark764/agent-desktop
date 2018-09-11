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
import IconSVG from 'components/IconSVG';

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
    position: 'relative',
  },
  iconLoading: {
    float: 'right',
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
      role="button"
      tabIndex={0}
    >
      {props.loading ? (
        <IconSVG
          id={`${props.id}-loading-icon`}
          name="loading"
          width="40px"
          style={styles.iconLoading}
        />
      ) : (
        <Icon
          id={`${props.id}-icon`}
          name={props.name}
          active={props.active}
          style={[styles.base, props.style, styles.icon]}
          onclick={props.onClick}
          loading={props.loading}
        />
      )}
      {props.innerElement && (
        <div>
          {props.innerElement}
        </div>
      )}
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
  loading: PropTypes.bool,
};

export default Radium(CircleIconButton);
