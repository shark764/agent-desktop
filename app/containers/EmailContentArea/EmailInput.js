/**
 * EmailInput
 */

import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import Radium from 'radium';

import { isValidEmail } from 'utils/validator';

import TextInput from 'components/TextInput';

import EmailListItem from './EmailListItem';
import { addEmail } from './actions';
import { canAddEmailToList } from './selectors';

const styles = {
  detailsField: {
    color: '#979797',
    display: 'inline-block',
    width: '90px',
    verticalAlign: 'top',
  },
  detailsValue: {
    display: 'inline-block',
    width: 'calc(100% - 90px)',
    minHeight: '1.5em',
    wordBreak: 'break-all',
  },
  emailAddress: {
    display: 'inline-block',
    whiteSpace: 'nowrap',
    backgroundColor: '#FFFFFF',
    border: '1px solid #D0D0D0',
    borderRadius: '3px',
    padding: '0 6px',
    marginRight: '6px',
  },
  emailAddressRemove: {
    display: 'inline-block',
    marginLeft: '5px',
  },
};

export class EmailInput extends React.Component {
  onCommaAdd = (e) => {
    if (e.keyCode === 188) {
      e.preventDefault();
      if (isValidEmail(this.props.value)) {
        this.props.addEmail(
          {
            name: this.props.value,
            address: this.props.value,
          },
          this.props.inputType
        );
      }
      return false;
    } else {
      return true;
    }
  };

  onBlurAdd = () => {
    if (isValidEmail(this.props.value)) {
      this.props.addEmail(
        {
          name: this.props.value,
          address: this.props.value,
        },
        this.props.inputType
      );
    }
  };

  render() {
    return (
      <div style={this.props.style}>
        <div style={styles.detailsField}>
          <FormattedMessage {...this.props.message} />
        </div>
        <div style={styles.detailsValue}>
          {this.props.emails.map((email, index) => (
            <EmailListItem
              key={index} // eslint-disable-line react/no-array-index-key
              index={index}
              email={email}
              listName={`${this.props.inputType}s`}
            />
          ))}
          {this.props.canAddEmailToList && (
            <TextInput
              id={`email${this.props.inputType}Input`}
              styleType="inlineInherit"
              noBorder
              placeholder="…"
              value={this.props.value}
              cb={this.props.cb}
              onKeyDown={this.onCommaAdd}
              onBlur={this.onBlurAdd}
            />
          )}
        </div>
      </div>
    );
  }
}

EmailInput.propTypes = {
  style: PropTypes.object,
  emails: PropTypes.array.isRequired,
  message: PropTypes.object.isRequired,
  inputType: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  cb: PropTypes.func.isRequired,
  addEmail: PropTypes.func.isRequired,
  canAddEmailToList: PropTypes.bool.isRequired,
};

const mapStateToProps = (state, props) => ({
  canAddEmailToList: canAddEmailToList(state, props),
});

function mapDispatchToProps(dispatch) {
  return {
    addEmail: (email, inputType) => dispatch(addEmail(email, inputType)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Radium(EmailInput));
