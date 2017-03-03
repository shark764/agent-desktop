/*
 *
 * AgentScript
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import selectAgentScript from './selectors';
import Radium from 'radium';

import CheckBoxGroup from 'components/CheckboxGroup';
import Image from 'components/Image';
import TextLink from 'components/TextLink';
import Scale from 'components/Scale';
import TextBlob from 'components/TextBlob';
import TextInput from 'components/TextInput';
import Select from 'components/Select';

import { script } from './assets/agentScript';

export class AgentScript extends React.Component { // eslint-disable-line react/prefer-stateless-function
  styles = {
    base: {
      // styles
    },
  }

  getScript() {
    const scriptElements = [];
    for (const element of script.elements) {
      switch (element.type) {
        case 'text':
          scriptElements.push(<TextBlob />);
          break;
        case 'freeform':
          scriptElements.push(<TextInput />);
          break;
        case 'dropdown':
          scriptElements.push(<Select />);
          break;
        case 'scale':
          scriptElements.push(<Scale />);
          break;
        case 'image':
          scriptElements.push(<Image />);
          break;
        case 'checkbox':
          scriptElements.push(<CheckBoxGroup />);
          break;
        case 'link':
          scriptElements.push(<TextLink />);
          break;
        default:
          break;
      }
    }
    return scriptElements;
  }

  render() {
    return (
      <div style={this.styles.base}>
        {this.getScript()}
      </div>
    );
  }
}

const mapStateToProps = selectAgentScript();

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Radium(AgentScript));
