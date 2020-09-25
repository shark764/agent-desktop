import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import SimpleCaretIconSVG from 'components/SimpleCaretIconSVG';
import styled from 'styled-components';

import messages from './messages';

const Title = styled.div`
  font-size: 18px;
  color: #4b4b4b;
  font-weight: bold;
  margin-bottom: 10px;
  border-bottom: solid 1px #e4e4e4;
  padding: 0 0 5px 0;
`;

const OptionTitle = styled(Title)`
  padding: 5px 0;
  cursor: pointer;
  text-overflow: ellipsis;
  &:not([disabled]):hover {
    background-color: #def8fe;
  }
`;

const BackCaretIcon = styled(SimpleCaretIconSVG)`
  vertical-align: top;
  margin-right: 5px;
`;

export const PreferenceTitle = (props) => {
  if (props.preference) {
    return (
      <OptionTitle
        id="preferenceTitleBack"
        onClick={() => props.setPreferenceSelected(undefined)}
      >
        <BackCaretIcon size={10} direction="left" />
        <FormattedMessage {...messages.preferences} />
        {` - `}
        <FormattedMessage {...messages[props.preference]} />
      </OptionTitle>
    );
  } else {
    return (
      <Title id="preferenceTitle">
        <FormattedMessage {...messages.preferences} />
      </Title>
    );
  }
};

PreferenceTitle.propTypes = {
  preference: PropTypes.string,
  setPreferenceSelected: PropTypes.func.isRequired,
};

export default PreferenceTitle;
