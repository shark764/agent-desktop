import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { SimpleCaretIconSVG } from 'cx-ui-components';
import styled from 'styled-components';

const Preference = styled.div`
  padding: 5px;
  cursor: pointer;
  text-overflow: ellipsis;
  &:not([disabled]):hover {
    background-color: #def8fe;
  }
`;

const CaretIcon = styled(SimpleCaretIconSVG)`
  float: right;
  transform: ${({ open }) => (open ? 'rotate(180deg)' : 'rotate(0deg)')};
  transition: transform 0.5s;
`;

export const PreferenceOption = (props) => (
  <Preference
    id={`${props.preference}-preference`}
    onClick={() => props.setPreferenceSelected(props.preference)}
  >
    <FormattedMessage {...props.label} />
    <CaretIcon size={10} direction={props.caretDirection} open={props.open} />
  </Preference>
);

PreferenceOption.propTypes = {
  preference: PropTypes.string.isRequired,
  label: PropTypes.object,
  setPreferenceSelected: PropTypes.func.isRequired,
  caretDirection: PropTypes.string,
  open: PropTypes.bool,
};

PreferenceOption.defaultProps = {
  caretDirection: 'right',
  open: false,
};

export default PreferenceOption;
