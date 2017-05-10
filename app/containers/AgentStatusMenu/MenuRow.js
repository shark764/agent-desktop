/**
 *
 * Menu Row
 *
 */

import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
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
  },
  clearButton: {
    border: '0',
    margin: '-4px 0 0 0',
    ':hover': {
      backgroundColor: '',
    },
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
  },
  submenuOuterContainer: {
    position: 'relative',
  },
  selectedIcon: {
    alignSelf: 'center',
    cursor: 'inherit',
  },
};

function MenuRow(props) {
  const rowText = typeof props.rowText === 'string' ? props.rowText : <FormattedMessage {...props.rowText} />;
  const mainRow = (
    <div
      id={props.id}
      style={[
        styles.base,
        props.isSelected && styles.selected,
        props.isOpen && styles.openMenuRoot,
        props.style,
      ]}
      onClick={!props.isSelected && props.onSelect}
    >
      <div style={styles.text}>
        {rowText}
      </div>
      {
        props.isSelected &&
        <Icon name="checkStatus" alt="selected" style={styles.selectedIcon} />
      }
      {
        props.hasSubMenu &&
        <div>
          &#9658;
        </div>
      }
    </div>
  );
  if (!props.hasSubMenu) {
    return mainRow;
  }
  return (
    <div style={styles.submenuOuterContainer}>
      {mainRow}
      {props.isOpen && <div style={styles.submenuContainer}>
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
};

export default Radium(MenuRow);
