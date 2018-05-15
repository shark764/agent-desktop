import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';

import PopupDialog from 'components/PopupDialog';
import AgentStatsMenu from 'containers/AgentStatsMenu';

import PreferenceTitle from './PreferenceTitle';
import PreferenceOption from './PreferenceOption';

const styles = {
  menu: {
    position: 'absolute',
    width: '230px',
    right: '2px',
    bottom: '56px',
    margin: '10px',
    color: '#4b4b4b',
    padding: '10px 13px',
  },
};

export class AgentPreferencesMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      preferenceSelected: undefined,
    };
  }

  setPreferenceSelected = (preferenceSelected) => {
    this.setState({ preferenceSelected });
  };

  render() {
    let content;
    switch (this.state.preferenceSelected) {
      case 'metrics':
        content = <AgentStatsMenu />;
        break;
      default:
        content = (
          <Fragment>
            <PreferenceOption
              preference="metrics"
              setPreferenceSelected={this.setPreferenceSelected}
            />
          </Fragment>
        );
    }

    return (
      <PopupDialog
        id="preferencesMenu"
        style={styles.menu}
        widthPx={230}
        arrowLeftOffsetPx={198}
        isVisible={this.props.isVisible}
        hide={this.props.hideMenu}
      >
        <PreferenceTitle
          preference={this.state.preferenceSelected}
          setPreferenceSelected={this.setPreferenceSelected}
        />
        {content}
      </PopupDialog>
    );
  }
}

AgentPreferencesMenu.propTypes = {
  isVisible: PropTypes.bool,
  hideMenu: PropTypes.func.isRequired,
};

export default Radium(AgentPreferencesMenu);
