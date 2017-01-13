/*
 *
 * Contact
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { selectPopulatedLayout } from './selectors';
import Radium from 'radium';
import { injectIntl } from 'react-intl';

export class Contact extends React.Component {
  constructor() {
    super();

    this.getSection = this.getSection.bind(this);
    this.getSectionHeading = this.getSectionHeading.bind(this);
    this.getAttributeRow = this.getAttributeRow.bind(this);
  }

  getAttributeValueDisplay(attribute, value) {
    switch (attribute.type) { // TODO: AttributeValue components w/edit flags & callbacks
      case 'phone':
        return (
          <a href={`tel:${value}`}>{value}</a>
        );
      case 'link':
        return (
          <a href={value} target="_blank">{value}</a>
        );
      case 'email':
        return (
          <a href={`mailto:${value}`}>{value}</a>
        );
      default:
        return value;
    }
  }

  getAttributeRow(attribute) {
    return (
      <div style={this.styles.attributeRow} key={attribute.id}>
        <div style={[this.styles.attributeName, this.styles.attributeRowChild]}>
          {attribute.label[this.props.intl.locale]}
        </div>
        <div style={this.styles.attributeRowChild}>{this.getAttributeValueDisplay(attribute, this.props.contact.attributes[attribute.objectName])}</div>
      </div>
    );
  }

  getSectionHeading(section) {
    return (
      <div style={this.styles.sectionHeading}>
        {section.label[this.props.intl.locale]}
      </div>
    );
  }

  getSection(section) {
    return (
      <div style={this.styles.section} key={section.label.en}>
        {this.getSectionHeading(section)}
        {section.attributes.map(this.getAttributeRow)}
      </div>
    );
  }

  styles = {
    base: {
      color: '#4B4B4B',
      fontSize: '14px',
      lineHeight: '20px',
    },
    section: {
      marginBottom: '28px',
    },
    sectionHeading: {
      height: '17px',
      fontSize: '15px',
      lineHeight: '18px',
      marginBottom: '8px',
    },
    attributeName: {
      color: '#979797',
      width: '161px',
    },
    attributeRow: {
      display: 'flex',
      flexDirection: 'row',
      marginBottom: '4px',
    },
    attributeRowChild: {
      flex: '0 1 auto',
    },
  };

  render() {
    return (
      <div style={this.styles.base}>
        {this.props.layout.map(this.getSection)}
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  layout: selectPopulatedLayout(state, props),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

Contact.propTypes = {
  layout: PropTypes.array,
  contact: PropTypes.object.isRequired,
  intl: PropTypes.object.isRequired,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Radium(Contact)));
