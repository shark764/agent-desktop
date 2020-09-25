import React from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';

const Wrapper = styled.div`
  height: 10px;
  width: 30px;
  display: inline-block;
`;

const blink = keyframes`
  50% {
      opacity: 1;
  }
`;

const Dot = styled.span`
  height: calc(100% - 2px);
  width: calc(33% - 2px);
  float: left;
  margin: 0 1px;
  background-color: rgb(35, 205, 244);
  display: block;
  border-radius: 50%;
  opacity: 0.4;
  animation: 1s ${blink} infinite ${props => props.blinkTime}s;
`;

const TypingIndicator = props => (
  <Wrapper {...props}>
    <Dot blinkTime={0.3333} />
    <Dot blinkTime={0.6667} />
    <Dot blinkTime={1} />
  </Wrapper>
)

TypingIndicator.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
};

export default TypingIndicator;