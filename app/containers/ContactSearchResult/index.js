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
import { connect } from 'react-redux';
import Radium from 'radium';

import 'velocity-animate';
import 'velocity-animate/velocity.ui';
import { VelocityTransitionGroup } from 'velocity-react';

import BaseComponent from 'components/BaseComponent';
import { setCriticalError } from 'containers/Errors/actions';

import Checkbox from 'components/Checkbox';
import ContactView from 'containers/ContactView';

import { assignContactToSelected } from 'containers/AgentDesktop/actions';

export class ContactSearchResult extends BaseComponent {

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
      marginBottom: '5px',
      overflowY: 'hidden',
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

  assignContact = () => {
    this.props.assignContact(this.props.contact);
  }

  render() {
    return (
      <div style={[this.styles.base, this.props.style, this.props.checked && this.styles.checkedContact]}>
        <VelocityTransitionGroup enter={{ animation: 'transition.fadeIn', duration: '1000' }} leave={{ animation: 'transition.fadeOut', duration: '1000' }}>
          {
            !this.props.hideContactSelectCheckbox &&
            <Checkbox
              style={this.styles.checkbox}
              id={this.props.contact.id}
              checked={this.props.checked}
              cb={this.props.selectContact}
            />
          }
        </VelocityTransitionGroup>
        <ContactView
          contact={this.props.contact}
          assignContact={this.assignContact}
          showCompactView={!this.state.expanded}
          showControls
          style={this.styles.contact}
        />
        <div onClick={() => this.setState({ expanded: !this.state.expanded })} style={this.styles.expandToggle} >
          <span style={this.styles.ellip}>...</span>
        </div>
      </div>
    );
  }
}

ContactSearchResult.propTypes = {
  hideContactSelectCheckbox: PropTypes.bool,
  checked: PropTypes.bool.isRequired,
  selectContact: PropTypes.func.isRequired,
  style: PropTypes.object,
  contact: PropTypes.object.isRequired,
  assignContact: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    setCriticalError: () => dispatch(setCriticalError()),
    assignContact: (contact) => dispatch(assignContactToSelected(contact)),
    dispatch,
  };
}

export default connect(null, mapDispatchToProps)(Radium(ContactSearchResult));
