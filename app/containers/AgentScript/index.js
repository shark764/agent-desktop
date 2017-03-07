/*
 *
 * AgentScript
 *
 */

import React from 'react';
import Radium from 'radium';

import Button from 'components/Button';
import CheckBox from 'components/Checkbox';
import Image from 'components/Image';
import TextLink from 'components/TextLink';
import Scale from 'components/Scale';
import TextBlob from 'components/TextBlob';
import TextInput from 'components/TextInput';
import Select from 'components/Select';

import script from './assets/agentScript';
import messages from './messages';

export class AgentScript extends React.Component {
  constructor(props) {
    super(props);
    this.getScriptValueMap = this.getScriptValueMap.bind(this);

    const state = {};
    for (const element of script.elements) {
      switch (element.type) {
        case 'freeform':
          state[element.name] = '';
          break;
        case 'dropdown':
        case 'scale':
          state[element.name] = null;
          break;
        case 'checkbox': {
          element.options.forEach((option) =>
            (state[option.value] = false)
          );
          break;
        }
        default:
          break;
      }
    }
    this.state = state;
  }

  styles = {
    base: {
      // styles
    },
    element: {
      marginBottom: '12px',
    },
  }

  getScriptValueMap() {
    const scriptValueMap = {};
    for (const element of script.elements) {
      switch (element.type) {
        case 'freeform':
        case 'dropdown':
        case 'scale':
          scriptValueMap[element.name] = this.state[element.name];
          break;
        case 'checkbox': {
          element.options.forEach((option) =>
            (scriptValueMap[option.value] = this.state[option.value])
          );
          break;
        }
        default:
          break;
      }
    }
    return scriptValueMap;
  }

  getScript() {
    const scriptElements = [];
    for (const element of script.elements) {
      switch (element.type) {
        case 'text':
          scriptElements.push(<TextBlob id={element.name} key={element.name} text={element.text} style={this.styles.element} />);
          break;
        case 'freeform':
          scriptElements.push(
            <div id={element.name} key={element.name} style={this.styles.element} >
              <div>
                { element.text }
              </div>
              <TextInput
                id={`${element.name}-textInput`}
                value={this.state[element.name]}
                cb={(value) => this.setState({ [element.name]: value })}
              />
            </div>
          );
          break;
        case 'dropdown': {
          const dropdownOptions = element.options.map((option) =>
            ({ value: option.value, label: option.name })
          );
          scriptElements.push(
            <div key={element.name} style={this.styles.element} >
              <div>
                { element.text }
              </div>
              <Select
                id={element.name}
                options={dropdownOptions}
                value={this.state[element.name]}
                onChange={(option) => this.setState({ [element.name]: option !== null ? option.value : null })}
              />
            </div>
          );
          break;
        }
        case 'scale':
          scriptElements.push(
            <Scale
              id={element.name}
              key={element.name}
              lowerBound={element.lowerBound}
              lowerBoundLabel={element.lowerBoundLabel}
              upperBound={element.upperBound}
              upperBoundLabel={element.upperBoundLabel}
              value={this.state[element.name]}
              onChange={(value) => this.setState({ [element.name]: value })}
              placeholder={element.text}
              style={this.styles.element}
            />
          );
          break;
        case 'image':
          scriptElements.push(<Image id={element.name} key={element.name} src={element.value} placeholder={element.text} style={this.styles.element} />);
          break;
        case 'checkbox': {
          const checkboxes = element.options.map((option) =>
            <CheckBox id={option.value} key={option.value} text={option.name} checked={this.state[option.value]} cb={(checked) => this.setState({ [option.value]: checked })} />
          );
          scriptElements.push(
            <div key={element.text} style={this.styles.element}>
              <div>
                { element.text }
              </div>
              { checkboxes }
            </div>
          );
          break;
        }
        case 'link':
          scriptElements.push(<TextLink id={element.name} key={element.name} link={element.href} text={element.text} style={this.styles.element} />);
          break;
        default:
          throw new Error('Unknown script element type');
      }
    }
    return scriptElements;
  }

  render() {
    return (
      <div style={this.styles.base}>
        {this.getScript()}
        <Button id="submitScriptButton" type="primaryBlue" text={messages.submit} onClick={() => console.log('TODO send this to SDK', this.getScriptValueMap())} />
      </div>
    );
  }
}

export default (Radium(AgentScript));
