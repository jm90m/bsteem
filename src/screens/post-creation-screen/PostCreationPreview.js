import React, { Component } from 'react';
import { Dimensions, ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import _ from 'lodash';
import styled from 'styled-components/native';
import Header from 'components/common/Header';
import { COLORS, MATERIAL_ICONS } from 'constants/styles';
import i18n from 'i18n/i18n';
import Expo from 'expo';
import HTML from 'react-native-render-html';
import HeaderEmptyView from 'components/common/HeaderEmptyView';
import BackButton from 'components/common/BackButton';
import { getHtml } from 'util/postUtils';
import * as postConstants from 'constants/postConstants';

const { width: deviceWidth } = Dimensions.get('screen');

const Container = styled.View``;

const TitleText = styled.Text`
  color: ${COLORS.PRIMARY_COLOR};
  font-weight: bold;
`;

class PostCreationPreview extends Component {
  static propTypes = {
    handleHidePreview: PropTypes.func.isRequired,
    postData: PropTypes.shape().isRequired,
  };

  constructor(props) {
    super(props);

    this.handlePostLinkPress = this.handlePostLinkPress.bind(this);
  }

  handlePostLinkPress(e, url) {
    const isTag = _.includes(url, postConstants.POST_HTML_BODY_TAG);
    const isUser = _.includes(url, postConstants.POST_HTML_BODY_USER);
    const isLink = !(isTag || isUser);
    if (isLink) {
      try {
        Expo.WebBrowser.openBrowserAsync(url).catch(error => {
          console.log('invalid url', error, url);
        });
      } catch (error) {
        console.log('unable to open url', error, url);
      }
    }
  }

  render() {
    const { handleHidePreview, postData } = this.props;
    const { body, json_metadata } = postData;
    const jsonParse = _.attempt(JSON.parse, json_metadata);
    const parsedJsonMetadata = _.isError(jsonParse) ? {} : jsonParse;
    const parsedHtmlBody = getHtml(body, parsedJsonMetadata);
    const widthOffset = 20;
    return (
      <Container>
        <Header>
          <BackButton navigateBack={handleHidePreview} iconName={MATERIAL_ICONS.close} />
          <TitleText>{i18n.titles.postPreview}</TitleText>
          <HeaderEmptyView />
        </Header>
        <ScrollView style={{ padding: 10, backgroundColor: COLORS.WHITE.WHITE }}>
          <HTML
            html={parsedHtmlBody}
            imagesMaxWidth={deviceWidth - widthOffset}
            onLinkPress={this.handlePostLinkPress}
          />
        </ScrollView>
      </Container>
    );
  }
}

export default PostCreationPreview;
