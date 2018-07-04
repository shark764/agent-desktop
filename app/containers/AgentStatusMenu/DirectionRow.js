/*
 * Copyright © 2015-2018 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Radium from 'radium';
import { capitalizeFirstLetter } from 'serenova-js-utils/strings';

import Icon from 'components/Icon';

import { selectIsSelectedDirection } from './selectors';
import messages from './messages';

function DirectionRow({
  style,
  direction,
  isSelectedDirection,
  setCollapsibleMenus,
}) {
  return (
    <div
      id={`agentDirection${capitalizeFirstLetter(direction)}`}
      style={style}
      disabled={isSelectedDirection}
      onClick={() => {
        if (!isSelectedDirection) {
          CxEngage.session.setDirection({ direction });
          setCollapsibleMenus();
        }
      }}
    >
      <FormattedMessage {...messages[direction]} />
      {isSelectedDirection && (
        <Icon name="checkStatus" alt="selected" style={{ float: 'right' }} />
      )}
    </div>
  );
}

DirectionRow.propTypes = {
  style: PropTypes.object,
  direction: PropTypes.string.isRequired,
  isSelectedDirection: PropTypes.bool,
  setCollapsibleMenus: PropTypes.func.isRequired,
};

const mapStateToProps = (state, props) => ({
  isSelectedDirection: selectIsSelectedDirection(state, props),
});

export default connect(mapStateToProps)(Radium(DirectionRow));
