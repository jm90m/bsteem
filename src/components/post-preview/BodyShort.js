import React from 'react';
import PropTypes from 'prop-types';
import Remarkable from 'remarkable';
import styled from 'styled-components/native';
import { striptags } from 'util/stripTags';

const Body = styled.Text`
  padding: 5px;
`;

const decodeEntities = body => {
  return body.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
};

const BodyShort = ({ content }) => {
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
    <Body numberOfLines={4} ellipsizeMode="tail">
      {body}
    </Body>
  );
};

BodyShort.propTypes = {
  content: PropTypes.string,
};

BodyShort.defaultProps = {
  content: '',
};

export default BodyShort;
