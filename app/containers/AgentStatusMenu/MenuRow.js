/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/**
 *
 * Menu Row
 *
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import Radium from 'radium';

import Icon from 'components/Icon';

const styles = {
  base: {
    display: 'flex',
    padding: '3px 24px',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: '#DEF8FE',
    },
  },
  selected: {
    fontWeight: 'bold',
    cursor: 'default',
    ':hover': {
      backgroundColor: '',
    },
  },
  text: {
    flexGrow: 1,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflowX: 'hidden',
  },
  openMenuRoot: {
    backgroundColor: '#DEF8FE',
  },
  submenuContainer: {
    position: 'absolute',
    top: '-5px',
    left: '303px',
    width: '303px',
    backgroundColor: '#FFFFFF',
    borderRadius: '3px',
    padding: '5px 0',
    boxShadow: '0 0 6px 1px rgba(0,0,0,0.29)',
  },
  submenuOuterContainer: {
    position: 'relative',
  },
  selectedIcon: {
    alignSelf: 'center',
    cursor: 'inherit',
  },
  disabled: {
    cursor: 'default',
    color: '#979797',
    ':hover': {
      backgroundColor: '',
    },
  },
};

function MenuRow(props) {
  const rowText =
    typeof props.rowText === 'string'
      ? props.rowText
      : <FormattedMessage {...props.rowText} />;
  const allowSelect = !props.isSelected && !props.disabled;
  const mainRow = (
    <div
      id={props.id}
      style={[
        styles.base,
        props.isSelected && styles.selected,
        props.isOpen && styles.openMenuRoot,
        props.disabled && styles.disabled,
        props.style,
      ]}
      onClick={allowSelect ? props.onSelect : undefined}
    >
      <div style={styles.text} title={rowText}>
        {rowText}
      </div>
      {props.isSelected &&
        <Icon name="checkStatus" alt="selected" style={styles.selectedIcon} />}
      {props.hasSubMenu && <div>&#9658;</div>}
    </div>
  );
  if (!props.hasSubMenu) {
    return mainRow;
  }
  return (
    <div style={styles.submenuOuterContainer}>
      {mainRow}
      {props.isOpen &&
        <div style={styles.submenuContainer}>
          {props.subMenuRows}
        </div>}
    </div>
  );
}

MenuRow.propTypes = {
  id: PropTypes.string.isRequired,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  rowText: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
  hasSubMenu: PropTypes.bool,
  subMenuRows: PropTypes.array,
  onSelect: PropTypes.func,
  isSelected: PropTypes.bool,
  isOpen: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default Radium(MenuRow);
