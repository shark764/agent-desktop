/*
 *
 * ContactSearchResult
 *
 */

import React from 'react';
import Radium from 'radium';

import Contact from 'containers/Contact';

export class ContactSearchResult extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor() {
    super();

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
      overflowY: 'hidden',
      transition: 'height 1s',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      alignContent: 'stretch',
    },
    header: {
      borderBottom: '1px solid #E4E4E4',
      paddingBottom: '12px',
      flexGrow: '1',
      flexShrink: '1',
      display: 'flex',
      justifyContent: 'space-between',
    },
    title: {
      fontWeight: 'bold',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      flexShrink: '1',
    },
    subTitle: {
      color: '#979797',
      fontSize: '14px',
      flexShrink: '1',
    },
    headerRight: {
      alignSelf: 'flex-end',
      flexShrink: '1',
    },
    contact: {
      marginTop: '12px',
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
    titlesWrapper: {
      display: 'flex',
      flexDirection: 'column',
      flexShrink: '1',
    },
  };

  render() {
    return (
      <div style={[this.styles.base, this.props.style]}>
        <div style={this.styles.header}>
          <div style={this.styles.titlesWrapper}>
            <div style={this.styles.title}>{this.props.contact.attributes.name}</div>
            <div style={this.styles.subTitle}>{this.props.contact.attributes.accountName}</div>
          </div>
          <div>#{this.props.contact.attributes.customerNumber}</div>
        </div>
        <Contact contactAttributes={this.props.contact.attributes} style={[this.styles.contact]} showCompactView={!this.state.expanded} ></Contact>
        <div onClick={() => this.setState({ expanded: !this.state.expanded })} style={this.styles.expandToggle} >
          <span style={this.styles.ellip}>...</span>
        </div>
      </div>
    );
  }
}

ContactSearchResult.propTypes = {
  style: React.PropTypes.object,
  contact: React.PropTypes.object.isRequired,
};

export default Radium(ContactSearchResult);
