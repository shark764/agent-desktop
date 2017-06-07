/**
*
* MenuDialogLink
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import A from 'components/A';
import PopupDialog from 'components/PopupDialog';
import Button from 'components/Button';

const styles = {
  base: {
    position: 'relative',
  },
  dialogPosition: {
    position: 'absolute',
    bottom: '20px',
    left: '-10px',
  },
  dialog: {
    borderRadius: 'none',
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  button: {
    borderTop: 'none',
    borderRight: 'none',
    borderBottom: 'none',
    borderLeft: 'none',
  },
  leftButtonBorder: {
    borderLeft: '1px solid #C5C5C5',
    borderRadius: 'none',
  },
};

class MenuDialogLink extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showDialog: false,
    };
  }

  toggleDialog = () => {
    this.setState({ showDialog: !this.state.showDialog });
  }

  handleButtonAction = (buttonAction) => {
    buttonAction();
    this.toggleDialog();
  }

  render() {
    const buttonWidthPx = 135;
    const numberOfOptions = this.props.options.length;
    return (
      <div style={styles.base}>
        <A id={this.props.id} disabled={this.props.disabled} onClick={this.toggleDialog} text={this.props.linkText} />
        <div style={styles.dialogPosition}>
          <PopupDialog
            isVisible={this.state.showDialog}
            hide={this.toggleDialog}
            style={styles.dialog}
            widthPx={numberOfOptions * buttonWidthPx}
            arrowLeftOffsetPx={(buttonWidthPx * 0.5) - 7}
            fadeContent
          >
            <div style={styles.container}>
              {
                this.props.options.map((option, index) =>
                  <Button
                    key={`menuOption-${index}`}
                    id={`menuOption-${index}`}
                    onClick={() => this.handleButtonAction(option.action)}
                    disabled={option.disabled}
                    type="secondary"
                    style={[
                      styles.button,
                      { width: `${100 / numberOfOptions}%` },
                      index > 0 ? styles.leftButtonBorder : {},
                    ]}
                  >
                    <FormattedMessage {...option.message} />
                  </Button>
                )
              }
            </div>
          </PopupDialog>
        </div>
      </div>
    );
  }
}

MenuDialogLink.propTypes = {
  id: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  linkText: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      message: PropTypes.object,
      action: PropTypes.func,
      disabled: PropTypes.bool,
    }),
  ).isRequired,
};

export default MenuDialogLink;
