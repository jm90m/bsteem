import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { WebView, Dimensions } from 'react-native';
import { getHtml } from 'util/postUtils';
import HTMLView from 'components/html-view/HTMLView';

const { width } = Dimensions.get('screen');

class Body extends Component {
  static propTypes = {
    body: PropTypes.string,
    parsedJsonMetaData: PropTypes.shape(),
    handlePostLinkPress: PropTypes.func,
    handleImagePress: PropTypes.func,
  };

  static defaultProps = {
    body: '',
    parsedJsonMetaData: {},
    handlePostLinkPress: () => {},
    handleImagePress: () => {},
  };

  renderNode(node, index, siblings, parent, defaultRenderer) {
    if (node.name === 'iframe') {
      return (
        <WebView
          key={`iframe-${node.attribs.src}`}
          source={{ uri: node.attribs.src }}
          style={{ height: 400, width: width - 20 }}
          height={400}
          width={width - 20}
        />
      );
    }

    return undefined;
  }

  render() {
    const { body, parsedJsonMetaData } = this.props;
    const parsedHtmlBody = getHtml(body, parsedJsonMetaData);
    return (
      <HTMLView
        value={parsedHtmlBody}
        renderNode={this.renderNode}
        onLinkPress={this.props.handlePostLinkPress}
        addLineBreaks={false}
        handleImagePress={this.props.handleImagePress}
      />
    );
  }
}

export default Body;
