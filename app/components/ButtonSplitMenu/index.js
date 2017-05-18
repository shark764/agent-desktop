/**
*
* ButtonSplitMenu
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';

import Button from 'components/Button';

const styles = {
  mainButton: {
    borderRadius: '3px 0 0 3px',
  },
  dropdownButton: {
    padding: '9px 3px',
    borderRadius: '0 3px 3px 0',
    borderLeft: '1px #FFFFFF solid',
  },
};

export class ButtonSplitMenu extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showMenu: false,
    };
  }

  render() {
    return (
      <div id={this.props.id} style={this.props.style}>
        <div>
          <Button
            id={`${this.props.id}-main-button`}
            type={this.props.type}
            text={this.props.text}
            disabled={this.props.disabled}
            onClick={this.props.onClick}
            style={styles.mainButton}
          />
          <Button
            id={`${this.props.id}-dropdown-button`}
            type={this.props.type}
            text="&#9660;"
            disabled={this.props.disabled}
            onClick={() => this.setState({ showMenu: !this.state.showMenu })}
            style={styles.dropdownButton}
          />
        </div>
        {
          this.state.showMenu && !this.props.disabled
          ? <div id={`${this.props.id}-dropdown-menu`} onClick={() => this.setState({ showMenu: false })}>
            { /* TODO put stuff here. props.children? Make a new component for menu items? */ }
            TODO
          </div>
          : undefined
        }
      </div>
    );
  }
}

ButtonSplitMenu.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  text: PropTypes.any,
  style: PropTypes.object,
};

export default Radium(ButtonSplitMenu);
