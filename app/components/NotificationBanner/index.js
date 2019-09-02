/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/**
 *
 * NotificationBanner
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';
import { injectIntl } from 'react-intl';

import IconSVG from 'components/IconSVG';

import messages from './messages';

const styles = {
  base: {
    backgroundColor: '#3EC5EC',
    width: '100%',
    height: '28px',
    fontSize: '14px',
    padding: '0 15px',
    display: 'flex',
    alignItems: 'center',
    color: 'white',
    flexShrink: 0,
    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
  },
  baseError: {
    backgroundColor: '#FE4565',
  },
  titleText: {
    flexShrink: 0,
    fontWeight: '600',
    marginRight: '7px',
  },
  descriptionMessage: {
    flexGrow: 1,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  rightLinkText: {
    flexShrink: 0,
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  closeButton: {
    borderTop: '0',
    borderRight: '0',
    borderBottom: '0',
    borderLeft: '0',
    padding: '0 0 0 4px',
    marginTop: '-4px',
  },
  fullBannerAction: {
    cursor: 'pointer',
  },
};

export class NotificationBanner extends React.Component {
  dismiss = () => {
    if (this.props.dismissArguments && this.props.dismissArguments.length) {
      this.props.dismiss(...this.props.dismissArguments);
    } else {
      this.props.dismiss();
    }
  };

  render() {
    const descriptionMessage =
      typeof this.props.descriptionMessage === 'object'
        ? this.props.intl.formatMessage(this.props.descriptionMessage)
        : this.props.descriptionMessage;
    return (
      <div
        id={this.props.id}
        style={[
          styles.base,
          this.props.isError && styles.baseError,
          this.props.style,
        ]}
      >
        {this.props.titleMessage && (
          <div style={styles.titleText}>
            {this.props.intl.formatMessage(this.props.titleMessage)}
            &nbsp;
          </div>
        )}
        <div
          style={[
            styles.descriptionMessage,
            this.props.fullBannerAction && styles.fullBannerAction,
            this.props.descriptionStyle,
          ]}
          onClick={this.props.fullBannerAction}
          title={descriptionMessage}
        >
          {descriptionMessage}
          {this.props.children}
        </div>
        {this.props.rightLinkAction && (
          <div
            onClick={this.props.rightLinkAction}
            style={styles.rightLinkText}
          >
            {this.props.intl.formatMessage(
              this.props.rightLinkMessage || messages.tryAgain
            )}
          </div>
        )}
        {this.props.dismiss && (
          <IconSVG
            name="close"
            id={`${this.props.id}-dismiss-btn`}
            onClick={this.dismiss}
            clear
            style={{ width: '20px', flexShrink: 0 }}
          />
        )}
      </div>
    );
  }
}

NotificationBanner.propTypes = {
  children: PropTypes.any,
  intl: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  style: PropTypes.object,
  descriptionStyle: PropTypes.object,
  titleMessage: PropTypes.object,
  descriptionMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  dismiss: PropTypes.func,
  dismissArguments: PropTypes.array,
  isError: PropTypes.bool,
  rightLinkAction: PropTypes.func,
  rightLinkMessage: PropTypes.object,
  fullBannerAction: PropTypes.func,
};

export default injectIntl(Radium(NotificationBanner));
