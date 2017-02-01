/**
*
* Filter
*
*/

import React from 'react';

import Radium from 'radium';

import Icon from 'components/Icon';

class Filter extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
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
      <div key={this.props.filter.full} style={[this.styles.base, this.props.style]}>
        <span style={this.styles.filterName}>{`${this.props.filter.short}:`}&nbsp;</span>
        <span style={this.styles.valueText}>{this.props.filter.value}</span>
        <Icon name="close" onclick={() => this.props.remove(this.props.filter)} style={this.styles.deleteFilterIcon}></Icon>
      </div>
    );
  }
}

Filter.propTypes = {
  filter: React.PropTypes.object.isRequired,
  remove: React.PropTypes.func.isRequired,
  style: React.PropTypes.object,
};

export default Radium(Filter);
