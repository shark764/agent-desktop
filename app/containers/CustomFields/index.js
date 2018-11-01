/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/**
 *
 * CustomFields
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import Radium from 'radium';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import ErrorBoundary from 'components/ErrorBoundary';
import Icon from 'components/Icon';
import { toggleCustomFields } from 'containers/AgentDesktop/actions';
import {
  selectCustomFields,
  getSelectedInteractionId,
  selectCustomFieldsCollapsed,
} from 'containers/AgentDesktop/selectors';

import messages from './messages';

const styles = {
  customField: {
    display: 'inline-block',
    width: '50%',
  },
  customFieldToolbar: {
    display: 'block',
    width: '100%',
  },
  collapsed: {
    transition: 'height 0.3s ease-out',
    height: '45px',
  },
  customFieldLabel: {
    color: '#979797',
    display: 'inline-block',
    width: '90px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  customFieldValue: {
    display: 'inline-block',
    width: 'calc(100% - 90px)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '600px',
  },
  caret: {
    display: 'inline-block',
  },
  caretUp: {
    transform: 'rotate(180deg)',
  },
  firstRow: {
    display: 'inline-block',
    width: '45%',
  },
  firstRowToolbar: {
    width: '90%',
  },
  firstRowValue: {
    width: 'calc(90% - 90px)',
  },
};

export class CustomFields extends React.Component {
  toggleCustomFieldsCollapsed = () => {
    this.props.toggleCustomFields(this.props.interactionId);
  };

  render() {
    const expandable =
      (this.context.toolbarMode && this.props.customFields.length > 3) ||
      (!this.context.toolbarMode && this.props.customFields.length > 6);

    const mappedFields = this.props.customFields.map((customField, index) => {
      const firstRow =
        index === (this.context.toolbarMode ? 0 : 1) && expandable;
      return (
        <div
          key={customField.label + customField.value}
          style={[
            this.context.toolbarMode
              ? styles.customFieldToolbar
              : styles.customField,
            firstRow && styles.firstRow,
            this.context.toolbarMode && firstRow && styles.firstRowToolbar,
          ]}
        >
          <div style={styles.customFieldLabel} title={customField.label}>
            {customField.isLocalized ? (
              <FormattedMessage {...messages[customField.id]} />
            ) : (
              customField.label
            )}
          </div>
          <div
            style={[styles.customFieldValue, firstRow && styles.firstRowValue]}
            title={customField.value}
          >
            {customField.value}
          </div>
        </div>
      );
    });

    if (expandable) {
      const firstRowEnd = this.context.toolbarMode ? 1 : 2;
      const lastIndexCollapsed = this.context.toolbarMode ? 3 : 6;
      const expandedHeight =
        15 *
          Math.ceil(
            this.props.customFields.length / (this.context.toolbarMode ? 1 : 2)
          ) +
        15;
      return (
        <div
          style={[
            styles.collapsed,
            !this.props.customFieldsCollapsed && {
              height: `${expandedHeight}px`,
            },
          ]}
        >
          <div>
            {mappedFields.slice(0, firstRowEnd)}
            <Icon
              name="caret"
              style={[
                styles.caret,
                !this.props.customFieldsCollapsed && styles.caretUp,
              ]}
              onclick={this.toggleCustomFieldsCollapsed}
            />
          </div>
          {this.props.customFieldsCollapsed
            ? mappedFields.slice(firstRowEnd, lastIndexCollapsed)
            : mappedFields.slice(firstRowEnd)}
        </div>
      );
    }
    return (
      <div>
        {mappedFields}
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  customFields: selectCustomFields(state, props),
  interactionId: getSelectedInteractionId(state, props),
  customFieldsCollapsed: selectCustomFieldsCollapsed(state, props),
});

function mapDispatchToProps(dispatch) {
  return {
    toggleCustomFields: (interactionId) =>
      dispatch(toggleCustomFields(interactionId)),
    dispatch,
  };
}

CustomFields.propTypes = {
  customFields: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  interactionId: PropTypes.string.isRequired,
  toggleCustomFields: PropTypes.func.isRequired,
  customFieldsCollapsed: PropTypes.bool.isRequired,
};

CustomFields.contextTypes = {
  toolbarMode: PropTypes.bool,
};

export default ErrorBoundary(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Radium(CustomFields))
);
