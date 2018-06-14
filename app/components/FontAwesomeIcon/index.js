/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/**
 *
 * FontAwesomeIcon
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

import 'font-awesome/css/font-awesome.css';

const styles = {
  button: {
    border: 'none',
    padding: '0',
    cursor: 'pointer',
  },
};

function FontAwesomeIcon(props) {
  return (
    <button style={styles.button} onClick={props.onclick} tabIndex={0}>
      <i
        id={props.id ? props.id : `${props.name}-icon`}
        className={`fa fa-${props.name} fa-${
          props.faSize ? props.faSize : '2'
        }x`}
        style={props.style}
        alt={props.alt || props.name}
        title={props.title}
      />
    </button>
  );
}

FontAwesomeIcon.propTypes = {
  name: PropTypes.string.isRequired,
  faSize: PropTypes.string,
  alt: PropTypes.string,
  title: PropTypes.string,
  style: PropTypes.object,
  id: PropTypes.string.isRequired,
  onclick: PropTypes.func,
};

export default FontAwesomeIcon;
