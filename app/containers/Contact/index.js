/*
 *
 * Contact
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Radium from 'radium';
import { injectIntl, intlShape } from 'react-intl';
import { PhoneNumberUtil } from 'google-libphonenumber';

import { selectPopulatedLayout, selectPopulatedCompactAttributes, selectAttributes } from './selectors';
import messages from './messages';

import Button from 'components/Button';
import TextInput from 'components/TextInput';

export class Contact extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      formInputs: {},
      showErrors: {},
      errors: {},
      disableSubmit: true,
    };

    if (this.props.isEditing) {
      Object.assign(this.state, this.initFormInputsState(this.props));
    }


    this.getSection = this.getSection.bind(this);
    this.getSectionHeading = this.getSectionHeading.bind(this);
    this.getAttributeRow = this.getAttributeRow.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setAttributeValue = this.setAttributeValue.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleInputClear = this.handleInputClear.bind(this);
    this.getHeader = this.getHeader.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.showError = this.showError.bind(this);
    this.handleOnBlur = this.handleOnBlur.bind(this);
    this.formatValue = this.formatValue.bind(this);
    this.getError = this.getError.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isEditing && !this.props.isEditing) {
      this.setState(this.initFormInputsState(nextProps));
    } else if (!nextProps.isEditing && this.props.isEditing) {
      this.setState({
        editingContactId: false,
        formInputs: {},
        errors: {},
        disableSubmit: true,
      });
    }
  }

  initFormInputsState(props) {
    const contactAttributes = props.contact.attributes ? props.contact.attributes : {};
    const formInputs = {};
    const errors = {};
    const showErrors = {};
    props.layoutSections.forEach((section) => {
      section.attributes.forEach((attribute) => {
        const isExistingValueDefined = (contactAttributes && contactAttributes[attribute.objectName] !== undefined);
        const initialValue = isExistingValueDefined ? contactAttributes[attribute.objectName] : (attribute.default || '');
        formInputs[attribute.objectName] = initialValue;
        errors[attribute.objectName] = this.getError(attribute.objectName, initialValue);
        showErrors[attribute.objectName] = false;
      });
    });
    return { formInputs, errors, showErrors, editingContactId: props.contact.id };
  }

  phoneNumberUtil = PhoneNumberUtil.getInstance();

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
      maxWidth: '100%',
      display: 'flex',
      alignItems: 'center',
      flexGrow: '1',
      flexShrink: '1',
    },
    inputBorder: {
      ':focus': {
        boxShadow: '0 0 6px 1px rgba(0, 0, 0, 0.12)',
        border: 'solid 1px #23CEF5',
      },
      border: 'solid 1px #979797',
    },
    inputErrorBorder: {
      ':focus': {
        boxShadow: '0 0 6px 1px rgba(0, 0, 0, 0.12)',
        border: 'solid 1px #FE4565',
      },
      border: 'solid 1px #F99CAC',
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
    header: {
      borderBottom: '1px solid #E4E4E4',
      paddingBottom: '12px',
      marginBottom: '12px',
      flexGrow: '1',
      flexShrink: '1',
      display: 'flex',
      justifyContent: 'space-between',
    },
    titlesWrapper: {
      display: 'flex',
      flexDirection: 'column',
      flexShrink: '1',
    },
    title: {
      fontSize: '16px',
      fontWeight: 'bold',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      flexShrink: '1',
    },
  };

  handleInputChange(newValue, event) {
    this.setAttributeValue(event.target.name, newValue);
  }

  handleInputClear(event) {
    const targetInputElement = event.target.previousSibling ? event.target.previousSibling : event.target.parentElement.previousSibling;
    const inputName = targetInputElement.name;
    this.setAttributeValue(inputName, '');
  }

  getError(name, value) {
    const attributeToValidate = this.props.attributes.find((attribute) => attribute.objectName === name);
    let error = false;
    if (attributeToValidate.mandatory && (value.length < 1)) {
      error = this.props.intl.formatMessage(messages.errorRequired);
    } else if (value.length) {
      switch (attributeToValidate.type) {
        case 'email':
          if (!/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value)) {
            error = this.props.intl.formatMessage(messages.errorEmail);
          }
          break;
        case 'phone':
          try {
            if (!this.phoneNumberUtil.isValidNumber(this.phoneNumberUtil.parse(value, 'E164'))) {
              error = this.props.intl.formatMessage(messages.errorPhone);
            }
          } catch (e) {
            error = this.props.intl.formatMessage(messages.errorPhone);
          }
          break;
        default:
          break;
      }
    }
    return error;
  }

  formatValue(name, value) {
    const attributeToValidate = this.props.attributes.find((attribute) => attribute.objectName === name);
    let formattedValue;
    switch (attributeToValidate.type) {
      case 'phone':
        formattedValue = value.replace(/[^0-9+*#]/g, '');
        if (formattedValue.indexOf('+') !== 0 && formattedValue.length > 0) {
          formattedValue = `+${formattedValue}`;
        }
        return formattedValue;
      default:
        return value;
    }
  }

  showError(name) {
    if (!this.state.showErrors[name]) {
      const stateUpdate = { showErrors: { ...this.state.showErrors } };
      stateUpdate.showErrors[name] = true;
      this.setState(stateUpdate);
    }
  }

  handleOnBlur(event) {
    this.setState({
      disableSubmit: Object.keys(this.state.errors).some((key) => this.state.errors[key] !== false),
    });
    this.showError(event.target.name);
  }

  handleSubmit() {
    this.props.save(this.state.formInputs, this.state.editingContactId);
  }

  handleCancel(event) {
    const isNewRecord = !this.state.editingContactId;
    event.preventDefault();
    if (window.confirm(isNewRecord ? this.props.intl.formatMessage(messages.warnNew) : this.props.intl.formatMessage(messages.warnEdit))) {
      this.props.cancel();
    }
  }

  getAttributeValueDisplay(attribute) {
    let value;
    const inputError = this.state.showErrors[attribute.objectName] ? this.state.errors[attribute.objectName] : false;
    if (this.props.isEditing) {
      value = this.state.formInputs[attribute.objectName] || '';
      return (
        <div key={attribute.objectName} ref={(element) => { this.inputDiv = element; }} style={[this.styles.inputBox, inputError ? this.styles.inputErrorBorder : this.styles.inputBorder]}>
          <TextInput
            noBorder
            cb={this.handleInputChange}
            style={this.styles.textInput}
            id={`${attribute.objectName}Input`}
            name={attribute.objectName}
            type={attribute.type}
            value={value}
            placeholder={attribute.label[this.props.intl.locale]}
            autocomplete="off"
            onBlur={this.handleOnBlur}
          />
          {value.length
            ? <Button
              id={`${attribute.objectName}-clear-btn`}
              tabIndex={-1}
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
    value = this.props.contact.attributes ? this.props.contact.attributes[attribute.objectName] : '';
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
          {`${attribute.label[this.props.intl.locale]}${(attribute.mandatory && this.props.isEditing) ? '*' : ''}`}
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
      <div style={this.styles.section} key={section.label[this.props.intl.locale]}>
        {this.getSectionHeading(section)}
        {section.attributes.map(this.getAttributeRow)}
      </div>
    );
  }

  setAttributeValue(name, newValue) {
    const stateUpdate = { formInputs: { ...this.state.formInputs }, errors: { ...this.state.errors } };
    const cleanedInput = this.formatValue(name, newValue);
    stateUpdate.formInputs[name] = cleanedInput;
    stateUpdate.errors[name] = this.getError(name, cleanedInput);
    stateUpdate.disableSubmit = Object.keys(stateUpdate.errors).some((key) => stateUpdate.errors[key] !== false);
    this.setState(stateUpdate);
  }

  getHeader() {
    return this.getAttributeValueDisplay(this.props.attributes.find((attribute) => attribute.objectName === 'name'));
  }

  getEditView() {
    return this.props.layoutSections.map(this.getSection);
  }

  getDisplayView() {
    return (
      <div>
        <div style={this.styles.header}>
          <div style={this.styles.titlesWrapper}>
            <div style={this.styles.title}>
              { this.getHeader() }
            </div>
          </div>
        </div>
        { this.props.showCompactView
          // Skip the first attribute for compact view; we're displaying it in the header
          ? this.props.compactLayoutAttributes.attributes.map(this.getAttributeRow)
          : this.props.layoutSections.map(this.getSection)
        }
      </div>
    );
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
                disabled={this.props.loading || this.state.disableSubmit}
                type="secondary"
                onClick={this.handleSubmit}
                text={this.props.intl.formatMessage(messages.saveBtn)}
              />
              <Button
                id="contactCancelBtn"
                style={this.styles.button}
                type="secondary"
                text={this.props.intl.formatMessage(messages.cancelBtn)}
                onClick={this.handleCancel}
              />
            </div>
            : ''
        }
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  attributes: selectAttributes(state, props),
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
  compactLayoutAttributes: PropTypes.object,
  layoutSections: PropTypes.array,
  attributes: PropTypes.array,
  contact: PropTypes.object,
  isEditing: PropTypes.bool,
  cancel: PropTypes.func,
  save: PropTypes.func,
  loading: PropTypes.bool,
  intl: intlShape.isRequired,
  style: PropTypes.object,
};

Contact.defaultProps = {
  contact: {},
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Radium(Contact)));
