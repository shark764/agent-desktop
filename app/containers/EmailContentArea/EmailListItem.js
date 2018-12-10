import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Radium from 'radium';

import IconSVG from 'components/IconSVG';

import { makeCanRemoveEmailFromList } from './selectors';
import { removeEmail } from './actions';

const styles = {
  emailAddress: {
    display: 'inline-block',
    backgroundColor: '#FFFFFF',
    border: '1px solid #D0D0D0',
    borderRadius: '3px',
    padding: '0 6px',
    marginRight: '6px',
    whiteSpace: 'nowrap',
  },
  emailBase: {
    maxWidth: '180px',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    display: 'inline-block',
    marginBottom: '-2%',
  },
  emailAddressRemove: {
    display: 'inline-block',
    marginLeft: '5px',
  },
};

export class EmailListItem extends React.Component {
  remove = () => {
    this.props.removeEmail(this.props.index, this.props.listName);
  };

  render() {
    const email =
      this.props.email.name &&
      this.props.email.name !== this.props.email.address
        ? `${this.props.email.name} [${this.props.email.address}]`
        : this.props.email.address;
    return (
      <div
        key={`${this.props.index}-${this.props.email.address}`} // eslint-disable-line
        id={`${this.props.index}-${this.props.email.address}`}
        style={styles.emailAddress}
      >
        <div style={styles.emailBase} title={email}>
          {email}
        </div>
        {this.props.canRemoveEmailFromList && (
          <span onClick={this.remove} style={styles.emailAddressRemove}>
            <IconSVG
              id="removeToAddressIcon"
              name="close"
              color="grey"
              width="12px"
            />
          </span>
        )}
      </div>
    );
  }
}

EmailListItem.propTypes = {
  index: PropTypes.number.isRequired,
  email: PropTypes.object.isRequired,
  listName: PropTypes.string.isRequired,
  canRemoveEmailFromList: PropTypes.bool.isRequired,
  removeEmail: PropTypes.func.isRequired,
};

const makeMapStateToProps = () => {
  const canRemoveEmailFromList = makeCanRemoveEmailFromList();
  const mapStateToProps = (state, props) => ({
    canRemoveEmailFromList: canRemoveEmailFromList(state, props),
  });
  return mapStateToProps;
};

function mapDispatchToProps(dispatch) {
  return {
    removeEmail: (listName, index) => dispatch(removeEmail(listName, index)),
    dispatch,
  };
}

export default connect(
  makeMapStateToProps,
  mapDispatchToProps
)(Radium(EmailListItem));
