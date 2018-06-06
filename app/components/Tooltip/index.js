/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/**
 *
 * Tooltip
 *
 */

/**
 *
 * Example:
 *
 * <Button
 *   data-tip
 *   data-for={tooltipTextObj.id}
 * />
 *
 * <Tooltip text={tooltipTextObj} id={tooltipTextObj.id}/>
 *
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import Radium from 'radium';

import ReactTooltip from 'react-tooltip';

const styles = {
  defaultTheme: {
    color: '#ff6e00 !important',
    backgroundColor: 'orange !important',
  },
};

function Tooltip(props) {
  return (
    <ReactTooltip
      id={props.id}
      type={props.type}
      effect={props.effect}
      place={props.place}
      style={styles.defaultTheme}
    >
      <FormattedMessage {...props.text} />
    </ReactTooltip>
  );
}

Tooltip.propTypes = {
  id: PropTypes.string,
  text: PropTypes.shape({
    id: PropTypes.string,
    defaultMessage: PropTypes.string,
  }).isRequired,
  type: PropTypes.oneOf(['success', 'warning', 'error', 'info', 'light']),
  effect: PropTypes.oneOf(['float', 'solid']),
  place: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
};

Tooltip.defaultProps = {
  type: 'error',
  effect: 'solid',
  place: 'bottom',
};

export default Radium(Tooltip);
