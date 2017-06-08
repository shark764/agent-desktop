/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * Contact
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Radium from 'radium';

import BaseComponent from 'components/BaseComponent';
import { setCriticalError } from 'containers/Errors/actions';

const styles = {
  contact: {
    padding: '10px 15px',
    cursor: 'pointer',
    borderRadius: '3px',
    ':hover': {
      backgroundColor: '#DEF8FE',
    },
  },
};

export class Contact extends BaseComponent {
  selectContact = () => {
    this.props.selectContact(this.props.contact);
  }

  render() {
    return (
      <div id={this.props.contact.id} key={this.props.contact.id} style={styles.contact} onClick={this.selectContact}>
        {this.props.contact.attributes.name}
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setCriticalError: () => dispatch(setCriticalError()),
    dispatch,
  };
}

Contact.propTypes = {
  contact: PropTypes.object.isRequired,
  selectContact: PropTypes.func.isRequired,
};

export default connect(null, mapDispatchToProps)(Radium(Contact));
