/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * ContactSearchResult
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';

import 'velocity-animate';
import 'velocity-animate/velocity.ui';
import { VelocityTransitionGroup } from 'velocity-react';

import ErrorBoundary from 'components/ErrorBoundary';

import Checkbox from 'components/Checkbox';
import ContactView from 'containers/ContactView';

export class ContactSearchResult extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    };
  }

  styles = {
    base: {
      border: '1px solid #E4E4E4',
      borderRadius: '3px',
      padding: '17px',
      fontSize: '16px',
      transition: 'height 1s',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      alignContent: 'stretch',
      position: 'relative',
    },
    contact: {
      overflowX: 'hidden',
      marginBottom: '5px',
      paddingLeft: '0',
    },
    expandToggle: {
      borderRadius: '2px',
      border: '1px solid #979797',
      height: '15px',
      width: '31px',
      boxSizing: 'border-box',
      cursor: 'pointer',
    },
    ellip: {
      position: 'relative',
      bottom: '11px',
      left: '7px',
      fontWeight: 'bold',
      letterSpacing: '1px',
      fontSize: '18px',
      color: '#979797',
      lineHeight: '1.5em',
    },
    checkbox: {
      position: 'absolute',
      left: '-33px',
    },
    checkedContact: {
      border: '1px solid #23cdf4',
    },
  };

  render() {
    return (
      <div
        style={[
          this.styles.base,
          this.props.style,
          this.props.checked && this.styles.checkedContact,
        ]}
      >
        <VelocityTransitionGroup
          enter={{ animation: 'transition.fadeIn', duration: '1000' }}
          leave={{ animation: 'transition.fadeOut', duration: '1000' }}
        >
          {!this.props.hideContactSelectCheckbox && (
            <Checkbox
              style={this.styles.checkbox}
              id={this.props.contact.id}
              checked={this.props.checked}
              disabled={this.props.disableEditing}
              cb={this.props.selectContact}
            />
          )}
        </VelocityTransitionGroup>
        <ContactView
          contact={this.props.contact}
          showCompactView={!this.state.expanded}
          showControls={!this.props.disableEditing}
          style={this.styles.contact}
        />
        <div
          onClick={() =>
            this.setState((prevState) => ({ expanded: !prevState.expanded }))
          }
          style={this.styles.expandToggle}
        >
          <span style={this.styles.ellip}>
            {'...'}
          </span>
        </div>
      </div>
    );
  }
}

ContactSearchResult.propTypes = {
  hideContactSelectCheckbox: PropTypes.bool,
  disableEditing: PropTypes.bool,
  checked: PropTypes.bool.isRequired,
  selectContact: PropTypes.func.isRequired,
  style: PropTypes.object,
  contact: PropTypes.object.isRequired,
};

export default ErrorBoundary(Radium(ContactSearchResult));
