/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/**
*
* Filter
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';
import { injectIntl } from 'react-intl';

import Icon from 'components/Icon';

const styles = {
  base: {
    background: '#DEF8FE',
    paddingLeft: '10px',
    height: '28px',
    display: 'flex',
    flexWrap: 'nowrap',
    alignItems: 'center',
  },
  filterName: {
    fontWeight: 'bold',
  },
  deleteFilterIcon: {
    margin: '0 10px',
    cursor: 'pointer',
  },
  valueText: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '200px',
  },
};

function Filter(props) {
  return (
    <div key={props.name} style={[styles.base, props.style]}>
      <span style={styles.filterName}>{`${props.name}:`}&nbsp;</span>
      <span style={styles.valueText}>{props.value}</span>
      <Icon name="close" onclick={props.remove} style={styles.deleteFilterIcon}></Icon>
    </div>
  );
}

Filter.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  remove: PropTypes.func.isRequired,
  style: PropTypes.object,
};

export default injectIntl(Radium(Filter));
