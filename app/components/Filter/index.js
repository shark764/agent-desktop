/**
*
* Filter
*
*/

import React from 'react';
import Radium from 'radium';
import { injectIntl } from 'react-intl';

import Icon from 'components/Icon';

class Filter extends React.PureComponent {
  styles = {
    base: {
      background: '#DEF8FE',
      paddingLeft: '10px',
      height: '28px',
      display: 'flex',
      flexWrap: 'nowrap',
      alignItems: 'center',
    },
    filterName: {
      fontWeight: 'bold',
    },
    deleteFilterIcon: {
      margin: '0 10px',
      cursor: 'pointer',
    },
    valueText: {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxWidth: '200px',
    },
  };
  render() {
    return (
      <div key={this.props.name} style={[this.styles.base, this.props.style]}>
        <span style={this.styles.filterName}>{`${this.props.name}:`}&nbsp;</span>
        <span style={this.styles.valueText}>{this.props.value}</span>
        <Icon name="close" onclick={this.props.remove} style={this.styles.deleteFilterIcon}></Icon>
      </div>
    );
  }
}

Filter.propTypes = {
  name: React.PropTypes.string.isRequired,
  value: React.PropTypes.string.isRequired,
  remove: React.PropTypes.func.isRequired,
  style: React.PropTypes.object,
};

export default injectIntl(Radium(Filter));
