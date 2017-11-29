/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/**
 *
 * Large Menu Row
 *
 */

import React from 'react';
import { injectIntl, intlShape } from 'react-intl';
import PropTypes from 'prop-types';
import Radium from 'radium';

const styles = {
  base: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#F3F3F3',
    paddingLeft: '24px',
    paddingRight: '24px',
    paddingTop: '17px',
    paddingBottom: '17px',
    height: '74px',
    borderTop: 'solid 1px #e4e4e4',
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    flexGrow: 1,
  },
  titleText: {
    fontSize: '14px',
    color: '#979797',
    fontWeight: '300',
  },
  mainText: {
    fontSize: '18px',
    color: '#4B4B4B',
    fontWeight: 'bold',
    display: 'inline',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: '303px',
  },
  availableMenu: {
    backgroundColor: '#FFFFFF',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: '#DEF8FE',
    },
  },
  openMenuRoot: {
    backgroundColor: '#DEF8FE',
  },
  submenuContainer: {
    position: 'absolute',
    top: '18px',
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
};

function LargeMenuRow(props) {
  const titleText =
    typeof props.titleText === 'string'
      ? props.titleText
      : props.intl.formatMessage(props.titleText);
  const mainText =
    typeof props.mainText === 'string'
      ? props.mainText
      : props.intl.formatMessage(props.mainText);
  const mainRow = (
    <div
      id={props.id}
      key={props.id}
      style={[
        styles.base,
        !props.disabled && props.hasSubMenu && styles.availableMenu,
        props.isOpen && styles.openMenuRoot,
        props.style,
      ]}
      onClick={!props.disabled && props.onClick}
    >
      <div style={styles.textContainer}>
        <div style={[styles.titleText]}>{titleText}</div>
        <div title={mainText} style={[styles.mainText]}>
          {mainText}
        </div>
      </div>
      {props.hasSubMenu && <div>&#9658;</div>}
    </div>
  );
  if (!props.hasSubMenu) {
    return mainRow;
  }
  return (
    <div style={styles.submenuOuterContainer}>
      {mainRow}
      {props.isOpen && (
        <div style={styles.submenuContainer}>{props.subMenuRows}</div>
      )}
    </div>
  );
}

LargeMenuRow.propTypes = {
  intl: intlShape.isRequired,
  id: PropTypes.string.isRequired,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  titleText: PropTypes.oneOfType([PropTypes.object, PropTypes.string])
    .isRequired,
  mainText: PropTypes.oneOfType([PropTypes.object, PropTypes.string])
    .isRequired,
  hasSubMenu: PropTypes.bool,
  subMenuRows: PropTypes.array,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  isOpen: PropTypes.bool,
};

export default injectIntl(Radium(LargeMenuRow));
