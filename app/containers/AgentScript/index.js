/*
 *
 * AgentScript
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Radium from 'radium';

import { updateScriptValues } from 'containers/AgentDesktop/actions';

import Button from 'components/Button';
import CheckBox from 'components/Checkbox';
import Image from 'components/Image';
import TextLink from 'components/TextLink';
import Scale from 'components/Scale';
import TextBlob from 'components/TextBlob';
import TextInput from 'components/TextInput';
import Select from 'components/Select';

import messages from './messages';

export class AgentScript extends React.Component {
  constructor(props) {
    super(props);
    this.getScriptValueMap = this.getScriptValueMap.bind(this);

    const state = {};
    for (const element of props.script.elements) {
      switch (element.type) {
        case 'freeform':
          state[element.name] = props.script.values !== undefined && props.script.values[element.name] !== undefined ? props.script.values[element.name] : '';
          break;
        case 'dropdown':
        case 'scale':
          state[element.name] = props.script.values !== undefined && props.script.values[element.name] !== undefined ? props.script.values[element.name] : null;
          break;
        case 'checkbox': {
          element.options.forEach((option) => {
            state[option.value] = props.script.values !== undefined && props.script.values[option.value] !== undefined ? props.script.values[option.value] : false;
          });
          break;
        }
        default:
          break;
      }
    }
    this.state = state;
  }

  componentWillUnmount() {
    this.props.updateScriptValues(this.props.interactionId, this.getScriptValueMap());
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.interactionId !== nextProps.interactionId) {
      this.props.updateScriptValues(this.props.interactionId, this.getScriptValueMap());
      for (const element of nextProps.script.elements) {
        switch (element.type) {
          case 'freeform':
            this.setState({
              [element.name]: nextProps.script.values !== undefined && nextProps.script.values[element.name] !== undefined ? nextProps.script.values[element.name] : '',
            });
            break;
          case 'dropdown':
          case 'scale':
            this.setState({
              [element.name]: nextProps.script.values !== undefined && nextProps.script.values[element.name] !== undefined ? nextProps.script.values[element.name] : null,
            });
            break;
          case 'checkbox': {
            element.options.forEach((option) => {
              this.setState({
                [option.value]: nextProps.script.values !== undefined && nextProps.script.values[option.value] !== undefined ? nextProps.script.values[option.value] : false,
              });
            });
            break;
          }
          default:
            break;
        }
      }
    }
  }

  styles = {
    textInput: {
      width: '100%',
      maxWidth: '282px',
    },
    select: {
      maxWidth: '282px',
    },
    element: {
      marginBottom: '15px',
    },
  }

  getScriptValueMap() {
    const scriptValueMap = {};
    for (const element of this.props.script.elements) {
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
    for (const element of this.props.script.elements) {
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
                style={this.styles.textInput}
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
                style={this.styles.select}
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

AgentScript.propTypes = {
  script: PropTypes.object.isRequired,
  interactionId: PropTypes.string.isRequired,
  updateScriptValues: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    updateScriptValues: (interactionId, scriptValueMap) => dispatch(updateScriptValues(interactionId, scriptValueMap)),
    dispatch,
  };
}

export default connect(null, mapDispatchToProps)(Radium(AgentScript));
