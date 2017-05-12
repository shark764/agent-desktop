/**
*
* ConfirmDialogLink
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';

import A from 'components/A';
import ConfirmDialog from 'components/ConfirmDialog';

export class ConfirmDialogLink extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showConfirmDialog: false,
    };
  }

  styles = {
    base: {
      position: 'relative',
    },
    confirmDialog: {
      position: 'absolute',
      bottom: '20px',
      left: '-10px',
    },
  };

  render() {
    return (
      <div style={this.styles.base}>
        <A id={this.props.id} disabled={this.props.disabled} onClick={() => this.setState({ showConfirmDialog: !this.state.showConfirmDialog })} text={this.props.linkText} />
        <ConfirmDialog
          leftAction={this.props.leftAction}
          rightAction={this.props.rightAction}
          leftMessage={this.props.leftMessage}
          rightMessage={this.props.rightMessage}
          leftDisabled={this.props.leftDisabled}
          rightDisabled={this.props.rightDisabled}
          isVisible={this.state.showConfirmDialog}
          hide={() => this.setState({ showConfirmDialog: false })}
          style={this.styles.confirmDialog}
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

export default Radium(ConfirmDialogLink);
