import React from 'react';
import PropTypes from 'prop-types';
import Remarkable from 'remarkable';
import styled from 'styled-components/native';
import { striptags } from 'util/stripTags';
import { connect } from 'react-redux';
import tinycolor from 'tinycolor2';
import PrimaryText from 'components/common/text/PrimaryText';
import { COLORS } from 'constants/styles';
import { getCustomTheme } from 'state/rootReducer';

const Body = styled(PrimaryText)`
  padding: 5px;
  color: ${props =>
    tinycolor(props.customTheme.primaryBackgroundColor).isDark()
      ? COLORS.LIGHT_TEXT_COLOR
      : COLORS.DARK_TEXT_COLOR};
`;

const decodeEntities = body => {
  return body.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
};

const BodyShort = ({ content, customTheme }) => {
  const remarkable = new Remarkable({ html: true });
  let body = striptags(remarkable.render(striptags(decodeEntities(content))));
  body = body.replace(/(?:https?|ftp):\/\/[\S]+/g, '');
  body = body.replace(/&quot;|&amp;/g, '');
  body = body.replace(/(?:\r\n|\r|\n)/g, ' ');
  // If body consists of whitespace characters only skip it.
  if (!body.replace(/\s/g, '').length) {
    return null;
  }

  return (
    <Body numberOfLines={4} ellipsizeMode="tail" customTheme={customTheme}>
      {body}
    </Body>
  );
};

BodyShort.propTypes = {
  content: PropTypes.string,
  customTheme: PropTypes.shape().isRequired,
};

BodyShort.defaultProps = {
  content: '',
};

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
});

export default connect(mapStateToProps)(BodyShort);
