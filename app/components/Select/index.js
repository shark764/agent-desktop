/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/**
 *
 * Select
 *
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import TetheredSelect from 'components/TetheredSelect';
import PropTypes from 'prop-types';
import Radium from 'radium';
import './react-select.css';
import messages from './messages';

const styles = {
  base: {
    height: '44px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #979797',
    borderRadius: '2px',
  },
};

function Select(props) {
  return (
    <div id={props.type}>
      <TetheredSelect
        id={props.id}
        style={({ ...styles.base, ...props.style})}
        onChange={props.onChange}
        name="form-field-name"
        value={props.value}
        options={props.options}
        noResultsText={
          props.noResultsText || (
            <FormattedMessage {...messages.noResultsText} />
          )
        }
        autoFocus={props.autoFocus}
        clearable={props.clearable}
        backspaceRemoves={props.backspaceRemoves}
        placeholder={
          props.placeholder || (
            <FormattedMessage {...messages.selectPlaceholder} />
          )
        }
        tabIndex="0"
      />
    </div>
  );
}

Select.propTypes = {
  style: PropTypes.array,
  onChange: PropTypes.func,
  options: PropTypes.array,
  value: PropTypes.string,
  noResultsText: PropTypes.object,
  autoFocus: PropTypes.bool,
  id: PropTypes.string.isRequired,
  clearable: PropTypes.bool,
  backspaceRemoves: PropTypes.bool,
  placeholder: PropTypes.object,
  type: PropTypes.oneOf(['inline-small']),
};

export default Radium(Select);
