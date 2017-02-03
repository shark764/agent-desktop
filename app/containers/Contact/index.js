/*
 *
 * Contact
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { selectPopulatedLayout, selectPopulatedCompactAttributes } from './selectors';
import Radium from 'radium';
import { injectIntl } from 'react-intl';

import Button from 'components/Button';
import TextInput from 'components/TextInput';

export class Contact extends React.Component {
  constructor() {
    super();

    this.state = {
      formInput: {},
    };

    this.getSection = this.getSection.bind(this);
    this.getSectionHeading = this.getSectionHeading.bind(this);
    this.getAttributeRow = this.getAttributeRow.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setAttributeValue = this.setAttributeValue.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleInputClear = this.handleInputClear.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  getAttributeValueDisplay(attribute) {
    let value;
    if (this.props.isEditing) {
      value = this.state.formInput[attribute.objectName] || '';
      return (
        <div key={attribute.objectName} ref={(element) => { this.inputDiv = element; }} style={this.styles.inputBox}>
          <TextInput
            noBorder
            cb={this.handleInputChange}
            style={this.styles.textInput}
            id={`${attribute.objectName}Input`}
            name={attribute.objectName}
            value={value}
            placeholder={attribute.label[this.props.intl.locale]}
            autocomplete="off"
          />
          {value.length
            ? <Button
              id={`${attribute.objectName}-clear-btn`}
              name={attribute.objectName}
              style={this.styles.closeButton}
              iconName="close"
              type="secondary"
              onClick={this.handleInputClear}
            />
            : ''
          }
        </div>
      );
    }
    value = this.props.contactAttributes[attribute.objectName];
    let content;
    switch (attribute.type) { // TODO: AttributeValue components w/edit flags & callbacks
      case 'phone':
        content = (
          <a href={`tel:${value}`}>{value}</a>
        );
        break;
      case 'link':
        content = (
          <a href={value} target="_blank">{value}</a>
        );
        break;
      case 'email':
        content = (
          <a href={`mailto:${value}`}>{value}</a>
        );
        break;
      default:
        content = value;
    }
    return (
      <div style={this.styles.attributeValue}>
        {content}
      </div>
    );
  }

  getAttributeRow(attribute) {
    return (
      <div style={this.styles.attributeRow} key={attribute.id}>
        <div style={this.styles.attributeName}>
          {attribute.label[this.props.intl.locale]}
        </div>
        {this.getAttributeValueDisplay(attribute)}
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

  setAttributeValue(name, newValue) {
    const stateUpdate = { formInput: { ...this.state.formInput } };
    stateUpdate.formInput[name] = newValue;
    this.setState(stateUpdate);
  }

  handleSubmit(event) {
    this.props.save(this.state.formInput);
    console.log('submit');
    event.preventDefault();
  }

  styles = {
    base: {
      color: '#4B4B4B',
      fontSize: '14px',
      lineHeight: '20px',
      marginTop: '36px',
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
      flexShrink: '0',
      alignSelf: 'center',
    },
    attributeRow: {
      display: 'flex',
      flexDirection: 'row',
      marginBottom: '4px',
    },
    attributeValue: {
      flexShrink: '1',
    },
    buttonGroup: {
      width: '100%',
    },
    button: {
      float: 'left',
      marginRight: '10px',
    },
    textInput: {
      width: '',
      height: '',
      fontSize: '14px',
      outline: 'none',
      ':focus': {
        outline: 'none',
      },
      padding: '',
      flexGrow: '1',
      flexShrink: '1',
      alignSelf: 'stretch',
    },
    inputBox: {
      backgroundColor: '#ffffff',
      padding: '2px',
      height: '21px',
      borderRadius: '2px 0 0 3px',
      border: 'solid 1px #979797',
      ':focus': {
        boxShadow: '0 0 6px 1px rgba(0, 0, 0, 0.12)',
        border: 'solid 1px #23CEF5',
      },
      maxWidth: '100%',
      display: 'flex',
      alignItems: 'center',
      flexGrow: '1',
      flexShrink: '1',
    },
    closeButton: {
      height: '',
      width: '',
      margin: '0',
      border: '0',
      order: '1',
      flexGrow: '0',
      flexShrink: '0',
      ':hover': {
        backgroundColor: '',
      },
    },
  };

  cancel(event) {
    event.preventDefault();
    this.props.cancel();
  }

  getEditView() {
    return this.props.layoutSections.map(this.getSection);
  }

  getDisplayView() {
    return this.props.showCompactView
      ? this.props.compactLayoutAttributes.map(this.getAttributeRow)
      : this.props.layoutSections.map(this.getSection);
  }

  handleInputClear(event) {
    const targetInputElement = event.target.previousSibling ? event.target.previousSibling : event.target.parentElement.previousSibling;
    const inputName = targetInputElement.name;
    this.setAttributeValue(inputName, '');
  }

  handleInputChange(newValue, event) {
    this.setAttributeValue(event.target.name, newValue);
  }

  render() {
    return (
      <div style={[this.props.style, this.styles.base]}>
        {
          this.props.isEditing
            ? this.getEditView()
            : this.getDisplayView()
        }
        {
          this.props.isEditing
            ? <div>
              <Button
                id="contactSaveBtn"
                style={this.styles.button}
                type="secondary"
                onClick={this.handleSubmit}
                text="Save Changes"
              />
              <Button
                id="contactCancelBtn"
                style={this.styles.button}
                type="secondary"
                text="Cancel"
                onClick={this.cancel}
              />
            </div>
            : ''
        }
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  layoutSections: selectPopulatedLayout(state, props),
  compactLayoutAttributes: selectPopulatedCompactAttributes(state, props),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

Contact.propTypes = {
  showCompactView: PropTypes.bool,
  compactLayoutAttributes: PropTypes.array,
  layoutSections: PropTypes.array,
  contactAttributes: PropTypes.object,
  isEditing: PropTypes.bool,
  cancel: PropTypes.func,
  save: PropTypes.func,
  intl: PropTypes.object.isRequired,
  style: PropTypes.object,
};

Contact.defaultProps = {
  contactAttributes: {},
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Radium(Contact)));
