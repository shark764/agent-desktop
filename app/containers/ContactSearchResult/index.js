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

import Checkbox from 'components/Checkbox';
import Contact from 'containers/Contact';

export class ContactSearchResult extends React.Component {

  constructor() {
    super();

    this.state = {
      expanded: false,
    };

    this.assignContact = this.assignContact.bind(this);
    this.editContact = this.editContact.bind(this);
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
    },
    checkbox: {
      position: 'absolute',
      left: '-33px',
    },
    checkedContact: {
      border: '1px solid #23cdf4',
    },
  };
  assignContact() {
    this.props.assignContact(this.props.contact);
  }
  editContact() {
    this.props.editContact(this.props.contact);
  }

  render() {
    return (
      <div style={[this.styles.base, this.props.style, this.props.checked && this.styles.checkedContact]}>
        <VelocityTransitionGroup enter={{ animation: 'transition.fadeIn', duration: '1000' }} leave={{ animation: 'transition.fadeOut', duration: '1000' }}>
          {
            !this.props.isCollapsed ?
              <Checkbox
                style={this.styles.checkbox}
                id={this.props.contact.id}
                checked={this.props.checked}
                cb={this.props.selectContact}
              />
            : ''
          }
        </VelocityTransitionGroup>
        <Contact
          contact={this.props.contact}
          style={this.styles.contact}
          showCompactView={!this.state.expanded}
          isAssigned={this.props.isAssigned}
          assign={this.assignContact}
          edit={this.editContact}
          showControls
          loading={this.props.loading}
        />
        <div onClick={() => this.setState({ expanded: !this.state.expanded })} style={this.styles.expandToggle} >
          <span style={this.styles.ellip}>...</span>
        </div>
      </div>
    );
  }
}

ContactSearchResult.propTypes = {
  isCollapsed: PropTypes.bool.isRequired,
  checked: PropTypes.bool.isRequired,
  selectContact: PropTypes.func.isRequired,
  style: PropTypes.object,
  contact: PropTypes.object.isRequired,
  assignContact: PropTypes.func.isRequired,
  isAssigned: PropTypes.bool,
  editContact: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

ContactSearchResult.defaultProps = {
  isAssigned: false,
};

export default Radium(ContactSearchResult);
