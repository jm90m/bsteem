import React, { Component } from 'react';
import { Dimensions, ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import _ from 'lodash';
import styled from 'styled-components/native';
import Header from 'components/common/Header';
import { COLORS, MATERIAL_ICONS, ICON_SIZES, MATERIAL_COMMUNITY_ICONS } from 'constants/styles';
import Expo from 'expo';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import HTML from 'react-native-render-html';
import BackButton from 'components/common/BackButton';
import { getHtml } from 'util/postUtils';
import { connect } from 'react-redux';
import TitleText from 'components/common/TitleText';
import { getCustomTheme, getIntl, getCreatePostLoading } from 'state/rootReducer';
import tinycolor from 'tinycolor2';
import * as postConstants from 'constants/postConstants';
import StyledTextByBackground from 'components/common/StyledTextByBackground';
import PrimaryButton from 'components/common/PrimaryButton';
import SmallLoading from 'components/common/SmallLoading';
const { width: deviceWidth } = Dimensions.get('screen');

const Container = styled.View`
  flex: 1;
`;

const SubmitPostButtonContainer = styled.View`
  flex-direction: row;
  padding-top: 10px;
  padding-bottom: 10px;
`;

const PostTitle = styled(StyledTextByBackground)`
  font-weight: 700;
  font-size: 20px;
`;

const TouchableCreatePost = styled.TouchableOpacity``;

const TouchableCreatePostContainer = styled.View`
  padding: 5px;
`;

const EmptyView = styled.View`
  width: 100%;
  height: 100px;
`;

const ErrorText = styled.Text`
  padding: 10px;
  color: ${props => props.customTheme.negativeColor};
  font-weight: bold;
`;

class PostCreationPreview extends Component {
  static propTypes = {
    handleHidePreview: PropTypes.func.isRequired,
    postData: PropTypes.shape().isRequired,
    customTheme: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    createPostLoading: PropTypes.bool.isRequired,
    handlePostPreviewSubmit: PropTypes.func.isRequired,
    createPostDisplayInPreview: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      errorMessage: '',
    };

    this.handlePostLinkPress = this.handlePostLinkPress.bind(this);
    this.handleHidePreview = this.handleHidePreview.bind(this);
    this.handlePostCreation = this.handlePostCreation.bind(this);
    this.handlePostCreationFail = this.handlePostCreationFail.bind(this);
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

  handleHidePreview() {
    this.props.handleHidePreview();
  }

  handlePostCreation() {
    this.setState({
      errorMessage: '',
    });
    this.props.handlePostPreviewSubmit(this.handlePostCreationFail);
  }

  handlePostCreationFail(title, errorMessage) {
    this.setState({
      errorMessage: errorMessage,
    });
  }

  render() {
    const {
      postData,
      customTheme,
      intl,
      createPostLoading,
      createPostDisplayInPreview,
    } = this.props;
    const { errorMessage } = this.state;
    const { body, json_metadata, title } = postData;
    const jsonParse = _.attempt(JSON.parse, json_metadata);
    const parsedJsonMetadata = _.isError(jsonParse) ? {} : jsonParse;
    const parsedHtmlBody = getHtml(body, parsedJsonMetadata);
    const widthOffset = 20;
    return (
      <Container>
        <Header>
          <BackButton navigateBack={this.handleHidePreview} iconName={MATERIAL_ICONS.close} />
          <TitleText>{intl.post_preview}</TitleText>
          {createPostLoading ? (
            <TouchableCreatePostContainer>
              <SmallLoading />
            </TouchableCreatePostContainer>
          ) : (
            <TouchableCreatePost onPress={this.handlePostCreation}>
              <TouchableCreatePostContainer>
                <MaterialCommunityIcons
                  size={ICON_SIZES.menuIcon}
                  name={MATERIAL_COMMUNITY_ICONS.publish}
                  color={createPostDisplayInPreview ? customTheme.primaryColor : 'transparent'}
                />
              </TouchableCreatePostContainer>
            </TouchableCreatePost>
          )}
        </Header>
        <ScrollView style={{ padding: 10, backgroundColor: customTheme.primaryBackgroundColor }}>
          <PostTitle>{title}</PostTitle>
          <HTML
            html={parsedHtmlBody}
            imagesMaxWidth={deviceWidth - widthOffset}
            onLinkPress={this.handlePostLinkPress}
            staticContentMaxWidth={deviceWidth - widthOffset}
            baseFontStyle={{
              color: tinycolor(customTheme.primaryBackgroundColor).isDark()
                ? COLORS.LIGHT_TEXT_COLOR
                : COLORS.DARK_TEXT_COLOR,
            }}
          />
          {!_.isEmpty(errorMessage) && (
            <ErrorText customTheme={customTheme}>{errorMessage}</ErrorText>
          )}
          {createPostDisplayInPreview && (
            <SubmitPostButtonContainer>
              <PrimaryButton
                title={intl.create_post}
                onPress={this.handlePostCreation}
                disabled={createPostLoading}
                loading={createPostLoading}
              />
            </SubmitPostButtonContainer>
          )}
          <EmptyView />
        </ScrollView>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
  intl: getIntl(state),
  createPostLoading: getCreatePostLoading(state),
});

export default connect(mapStateToProps)(PostCreationPreview);
