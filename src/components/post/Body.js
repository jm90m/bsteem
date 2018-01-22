import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { getHtml } from 'util/postUtils';

const Container = styled.View``;

class Body extends Component {
  render() {
    const parsedHtmlBody = getHtml(body, parsedJsonMetadata);
    return (
      <HTMLView
        value={parsedHtmlBody}
        renderNode={renderNode}
        onLinkPress={this.handlePostLinkPress}
        addLineBreaks={false}
        handleImagePress={this.handleImagePress}
      />
    );
  }
}

export default Body;
