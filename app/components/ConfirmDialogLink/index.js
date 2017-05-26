/**
*
* ConfirmDialogLink
*
*/

import React from 'react';
import PropTypes from 'prop-types';

import A from 'components/A';
import ConfirmDialog from 'components/ConfirmDialog';

const styles = {
  base: {
    position: 'relative',
  },
  confirmDialog: {
    position: 'absolute',
    bottom: '20px',
    left: '-10px',
  },
};

class ConfirmDialogLink extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showConfirmDialog: false,
    };
  }

  toggleShowConfirmDialog = () => {
    this.setState({ showConfirmDialog: !this.state.showConfirmDialog });
  }

  leftAction = () => {
    this.props.leftAction();
    this.setState({ showConfirmDialog: false });
  }

  rightAction = () => {
    this.props.rightAction();
    this.setState({ showConfirmDialog: false });
  }

  render() {
    return (
      <div style={styles.base}>
        <A id={this.props.id} disabled={this.props.disabled} onClick={this.toggleShowConfirmDialog} text={this.props.linkText} />
        <ConfirmDialog
          leftAction={this.leftAction}
          rightAction={this.rightAction}
          leftMessage={this.props.leftMessage}
          rightMessage={this.props.rightMessage}
          leftDisabled={this.props.leftDisabled}
          rightDisabled={this.props.rightDisabled}
          isVisible={this.state.showConfirmDialog}
          hide={() => this.setState({ showConfirmDialog: false })}
          style={styles.confirmDialog}
        />
      </div>
    );
  }
}

ConfirmDialogLink.propTypes = {
  id: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  linkText: PropTypes.string.isRequired,
  leftMessage: PropTypes.object,
  rightMessage: PropTypes.object,
  leftAction: PropTypes.func.isRequired,
  rightAction: PropTypes.func.isRequired,
  leftDisabled: PropTypes.bool,
  rightDisabled: PropTypes.bool,
};

export default ConfirmDialogLink;
