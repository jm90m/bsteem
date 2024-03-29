import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
  Image,
  TouchableOpacity,
  View,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import styled from 'styled-components/native';
import { FormInput, FormLabel, Icon, FormValidationMessage } from 'react-native-elements';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { COLORS, ICON_SIZES, MATERIAL_COMMUNITY_ICONS, MATERIAL_ICONS } from 'constants/styles';
import { connect } from 'react-redux';
import Header from 'components/common/Header';
import BackButton from 'components/common/BackButton';
import {
  getAuthUsername,
  getIsAuthenticated,
  getPostLoading,
  getPostsDetails,
  getCreatePostLoading,
  getCustomTheme,
  getIntl,
} from 'state/rootReducer';
import { ImagePicker } from 'expo';
import { fetchPostDetails } from 'state/actions/postsActions';
import PrimaryButton from 'components/common/PrimaryButton';
import TagsInput from 'components/editor/TagsInput';
import LargeLoading from 'components/common/LargeLoading';
import SmallLoading from 'components/common/SmallLoading';
import uuidv4 from 'uuid/v4';
import { createPost, uploadImage } from 'state/actions/editorActions';
import TitleText from 'components/common/TitleText';
import tinycolor from 'tinycolor2';
import PostCreationPreviewModal from './PostCreationPreviewModal';
import * as navigationConstants from '../../constants/navigation';

const { width: deviceWidth } = Dimensions.get('screen');

const Container = styled.View``;

const Title = styled(TitleText)`
  margin-left: 3px;
`;

const TitleContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const StyledScrollView = styled.ScrollView`
  padding-bottom: 200px;
  background-color: ${props => props.customTheme.primaryBackgroundColor};
`;

const ActionButtonTouchable = styled.TouchableOpacity`
  width: 50px;
  height: 50px;
  justify-content: center;
  background-color: ${props => props.customTheme.secondaryColor};
  border-radius: 25px;
  align-items: center;
  margin-right: 20px;
`;

const ActionButtonsContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 20px;
  justify-content: space-between;
  padding-bottom: 100px;
`;

const ActionButtons = styled.View`
  flex-direction: row;
`;

const TouchableMenu = styled.TouchableOpacity``;

const TouchableMenuContainer = styled.View`
  padding: 5px;
`;

const LoadingContainer = styled.View`
  margin-top: 20px;
`;

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
  postsDetails: getPostsDetails(state),
  postLoading: getPostLoading(state),
  authenticated: getIsAuthenticated(state),
  authUsername: getAuthUsername(state),
  createPostLoading: getCreatePostLoading(state),
  intl: getIntl(state),
});

const mapDispatchToProps = dispatch => ({
  fetchPostDetails: (author, permlink) => dispatch(fetchPostDetails.action({ author, permlink })),
  createPost: (postData, callback) => dispatch(createPost.action({ postData, callback })),
  uploadImage: (imageData, callback, errorCallback) =>
    dispatch(uploadImage.action({ imageData, callback, errorCallback })),
});

class EditPostScreen extends Component {
  static propTypes = {
    customTheme: PropTypes.shape().isRequired,
    postsDetails: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    postLoading: PropTypes.bool.isRequired,
    authenticated: PropTypes.bool.isRequired,
    authUsername: PropTypes.string.isRequired,
    createPostLoading: PropTypes.bool.isRequired,
    fetchPostDetails: PropTypes.func.isRequired,
    createPost: PropTypes.func.isRequired,
    uploadImage: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.additionalContents = {};

    this.state = {
      bodyInput: '',
      titleInput: '',
      tags: [],
      currentImages: [],
      tagError: '',
      tagsInput: '',
      titleError: '',
      rewards: '',
      previewVisible: false,
      currentPostData: { body: '' },
      imageLoading: false,
      errorImageUploading: false,
      additionalPostContents: [],
      additionalInputCounter: 0,
      keyboardDisplayed: false,
      inputWidth: '99%',
    };

    this.navigateBack = this.navigateBack.bind(this);

    this.onChangeBody = this.onChangeBody.bind(this);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeTags = this.onChangeTags.bind(this);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.removeTag = this.removeTag.bind(this);

    this.showPreview = this.showPreview.bind(this);
    this.hidePreview = this.hidePreview.bind(this);
    this.getPostData = this.getPostData.bind(this);
    this.pickImage = this.pickImage.bind(this);

    this.insertImage = this.insertImage.bind(this);
    this.handleErrorImageUpload = this.handleErrorImageUpload.bind(this);
    this.addTextInput = this.addTextInput.bind(this);
    this.renderAdditionalContents = this.renderAdditionalContents.bind(this);
    this.removeAdditionalContent = this.removeAdditionalContent.bind(this);

    this.getCurrentPostDetails = this.getCurrentPostDetails.bind(this);
    this.handleCreatePostSuccess = this.handleCreatePostSuccess.bind(this);
  }

  componentWillMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this.handleSetKeyboardDisplay(true),
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this.handleSetKeyboardDisplay(false),
    );
  }

  componentDidMount() {
    const { postData } = this.props.navigation.state.params;
    const { author, permlink } = postData;
    this.props.fetchPostDetails(author, permlink);

    setTimeout(() => {
      this.setState({ inputWidth: '100%' });
    }, 100);
  }

  componentWillReceiveProps(nextProps) {
    const { postData } = this.props.navigation.state.params;
    const { author, permlink } = postData;
    const { postsDetails } = nextProps;
    const postKey = `${author}/${permlink}`;
    const oldPostData = _.get(this.props.postsDetails, postKey, {});
    const currentPostData = _.get(postsDetails, postKey, {});
    const diffPostData = !_.isEqual(JSON.stringify(oldPostData), JSON.stringify(currentPostData));
    const diffPostLoading = this.props.postLoading !== nextProps.postLoading;

    if (diffPostData || diffPostLoading) {
      const postJSONMetaData = _.attempt(JSON.parse, currentPostData.json_metadata);
      const jsonMetaData = _.isError(postJSONMetaData) ? {} : postJSONMetaData;
      const tags = _.uniq(_.get(jsonMetaData, 'tags', []));

      this.setState({
        bodyInput: currentPostData.body,
        titleInput: currentPostData.title,
        tags,
      });
    }
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  getCurrentPostDetails() {
    const { postData } = this.props.navigation.state.params;
    const { postsDetails } = this.props;
    const { author, permlink } = postData;
    const postKey = `${author}/${permlink}`;
    return _.get(postsDetails, postKey, {});
  }

  onChangeBody(value) {
    this.setState({
      bodyInput: value,
    });
  }

  onChangeTitle(value) {
    if (!_.isEmpty(value)) {
      this.setState({
        titleInput: value,
        titleError: '',
      });
    } else {
      this.setState({
        titleInput: value,
      });
    }
  }

  onChangeTags(value) {
    if (_.isEmpty(value)) {
      this.setState({ tagsInput: value });
      return;
    }

    if (_.size(this.state.tags) >= 5) {
      this.setState({ tagsInput: value, tagError: 'Can only add up to 5 tags.' });
      return;
    }

    if (_.includes(value, ',')) {
      const newTags = _.split(value, ',');
      const tags = _.chain(newTags)
        .map(tag => _.replace(_.trim(tag), new RegExp(' ', 'g'), ''))
        .compact()
        .uniq();
      const mergedTags = _.union(tags, this.state.tags);
      this.setState({
        tagsInput: '',
        tagError: '',
        tags: mergedTags,
      });
    } else if (_.includes(value, ' ')) {
      const newTag = _.replace(_.replace(value, ' ', ''), ',', '');
      if (_.includes(this.state.tags, newTag)) {
        this.setState({ tagsInput: '' });
        return;
      }
      const tags = _.compact([...this.state.tags, newTag]);
      this.setState({
        tagsInput: '',
        tagError: '',
        tags,
      });
    } else {
      this.setState({ tagsInput: value });
    }
  }

  getPostBody() {
    const { bodyInput, additionalPostContents } = this.state;
    let body = _.isEmpty(bodyInput) ? '' : `${bodyInput}\n`;

    _.each(additionalPostContents, content => {
      if (content.type === 'text') {
        const inputField = this.additionalContents[content.ref];
        if (inputField) {
          body += _.get(inputField, 'input._lastNativeText', '');
        }
      } else if (content.type === 'image') {
        body += `![${content.name}](${content.src})\n`;
      }
    });
    return body;
  }

  removeAdditionalContent(index, type, imgID) {
    const additionalPostContents = [...this.state.additionalPostContents];
    additionalPostContents.splice(index, 1);

    if (type === 'image') {
      const currentImages = [...this.state.currentImages];
      _.remove(currentImages, { id: imgID });
      this.setState({
        currentImages,
        additionalPostContents,
      });
    } else if (type === 'text') {
      this.setState({
        additionalPostContents,
      });
    }
  }

  addTextInput() {
    const key = `text-${this.state.additionalInputCounter}`;
    const additionalInput = {
      key,
      type: 'text',
      ref: key,
    };
    this.setState({
      additionalPostContents: _.concat(this.state.additionalPostContents, additionalInput),
      additionalInputCounter: this.state.additionalInputCounter + 1,
    });
  }

  handleSetKeyboardDisplay = keyboardDisplayed => () => this.setState({ keyboardDisplayed });

  renderAdditionalContents() {
    const closeButtonStyles = {
      position: 'absolute',
      top: 5,
      right: 0,
      backgroundColor: 'transparent',
    };
    const { customTheme, intl } = this.props;
    return _.map(this.state.additionalPostContents, (content, index) => {
      const { type, key, ref } = content;
      if (type === 'text') {
        const color = tinycolor(customTheme.primaryBackgroundColor).isDark()
          ? COLORS.LIGHT_TEXT_COLOR
          : COLORS.DARK_TEXT_COLOR;
        return (
          <View key={key}>
            <FormInput
              ref={input => (this.additionalContents[ref] = input)}
              placeholder={intl.story_placeholder}
              multiline
              inputStyle={{ width: '100%', color }}
              placeholderTextColor={color}
            />
            <TouchableOpacity
              onPress={() => this.removeAdditionalContent(index, type)}
              style={closeButtonStyles}
            >
              <MaterialCommunityIcons
                name={MATERIAL_COMMUNITY_ICONS.closeCircle}
                size={ICON_SIZES.editorCloseIcon}
                color={customTheme.primaryColor}
              />
            </TouchableOpacity>
          </View>
        );
      } else if (type === 'image') {
        return (
          <View key={`${content.src}/${index}`}>
            <Image
              ref={img => (this.additionalContents[ref] = img)}
              source={{ uri: content.src }}
              style={{ width: deviceWidth, height: deviceWidth }}
              resizeMode={Image.resizeMode.contain}
            />
            <TouchableOpacity
              onPress={() => this.removeAdditionalContent(index, type, content.id)}
              style={closeButtonStyles}
            >
              <MaterialCommunityIcons
                name={MATERIAL_COMMUNITY_ICONS.closeCircle}
                size={ICON_SIZES.editorCloseIcon}
                color={customTheme.primaryColor}
              />
            </TouchableOpacity>
          </View>
        );
      }
    });
  }

  getPostData() {
    const bsteemTag = 'bsteem';
    const tags = _.uniq([...this.state.tags, bsteemTag]);
    const oldPostData = this.getCurrentPostDetails();
    const postJSONMetaData = _.attempt(JSON.parse, oldPostData.json_metadata);
    const jsonMetaData = _.isError(postJSONMetaData) ? {} : postJSONMetaData;
    const oldImages = _.get(jsonMetaData, 'images', []);
    const images = _.uniq(
      _.compact(_.concat(oldImages, _.map(this.state.currentImages, image => image.src))),
    );
    const postBody = this.getPostBody();
    const body = _.isEmpty(postBody) ? ' ' : postBody;

    const postTitle = this.state.titleInput;
    const data = {
      ...oldPostData,
      originalBody: oldPostData.body,
      body,
      title: postTitle,
      parentAuthor: '',
      lastUpdated: Date.now(),
      upvote: true,
      isUpdating: true,
      parentPermlink: oldPostData.parent_permlink,
      parentAuthor: oldPostData.parent_author,
    };

    const metaData = {
      community: 'bsteem',
      app: 'bsteem',
      format: 'markdown',
    };

    if (images.length) {
      metaData.image = images;
    }

    metaData.tags = tags;

    data.jsonMetadata = {
      ...jsonMetaData,
      ...metaData,
    };

    return data;
  }

  showPreview() {
    this.setState({
      previewVisible: true,
      currentPostData: this.getPostData(),
    });
  }

  hidePreview() {
    this.setState({
      previewVisible: false,
    });
  }

  navigateBack() {
    this.props.navigation.goBack();
  }

  handleCreatePostSuccess(author, permlink) {
    this.props.navigation.navigate(navigationConstants.POST, {
      permlink,
      author,
    });
  }

  removeTag(tag) {
    const { tags } = this.state;
    const newTags = [...tags];
    const index = newTags.indexOf(tag);

    if (index > -1) {
      newTags.splice(index, 1);
    }

    this.setState({
      tags: newTags,
      tagsInput: '',
    });
  }

  insertImage(image, imageName = 'image') {
    const id = uuidv4();
    const newImage = {
      src: image,
      name: imageName,
      type: 'image',
      ref: `image-${id}`,
      id,
    };
    this.setState({
      currentImages: _.concat(this.state.currentImages, newImage),
      imageLoading: false,
      additionalPostContents: _.concat(this.state.additionalPostContents, newImage),
    });
  }

  handleErrorImageUpload() {
    this.setState({
      imageLoading: false,
      errorImageUploading: true,
    });
  }

  async pickImage() {
    const allowsEditing = Platform.OS !== 'ios';
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'Images',
      allowsEditing,
    });

    console.log('IMAGE PICKER', result);

    if (!result.cancelled) {
      this.setState({ imageLoading: true });
      this.props.uploadImage(result, this.insertImage, this.handleErrorImageUpload);
    }
  }

  handleSubmit() {
    // validate form
    const { intl } = this.props;
    const { tags, titleInput } = this.state;
    const errorState = {};

    if (_.isEmpty(tags)) errorState.tagError = intl.editor_error_empty_tags;
    if (_.isEmpty(titleInput)) errorState.titleError = intl.editor_error_empty_title;

    if (_.isEmpty(errorState)) {
      this.setState(errorState, () => {
        const postData = this.getPostData();
        this.props.createPost(postData, this.handleCreatePostSuccess);
      });
    } else {
      this.setState(errorState);
    }
  }

  render() {
    const {
      bodyInput,
      tagsInput,
      titleInput,
      tags,
      tagError,
      titleError,
      previewVisible,
      currentPostData,
      imageLoading,
      keyboardDisplayed,
      inputWidth,
    } = this.state;
    const { createPostLoading, postLoading, customTheme, intl } = this.props;
    const displayTitleError = !_.isEmpty(titleError);
    const color = tinycolor(customTheme.primaryBackgroundColor).isDark()
      ? COLORS.LIGHT_TEXT_COLOR
      : COLORS.DARK_TEXT_COLOR;

    return (
      <Container>
        <Header>
          <BackButton navigateBack={this.navigateBack} />
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <TitleContainer>
              <Title>{intl.edit_post}</Title>
              <MaterialIcons
                size={ICON_SIZES.menuIcon}
                name={MATERIAL_ICONS.keyboardHide}
                color={keyboardDisplayed ? customTheme.primaryColor : 'transparent'}
              />
            </TitleContainer>
          </TouchableWithoutFeedback>
          <TouchableMenu onPress={this.showPreview}>
            <TouchableMenuContainer>
              <MaterialCommunityIcons
                size={ICON_SIZES.menuIcon}
                name={MATERIAL_COMMUNITY_ICONS.magnify}
                color={customTheme.primaryColor}
              />
            </TouchableMenuContainer>
          </TouchableMenu>
        </Header>
        {postLoading ? (
          <LoadingContainer>
            <LargeLoading />
          </LoadingContainer>
        ) : (
          <StyledScrollView customTheme={customTheme} removeClippedSubviews={Platform.OS === 'ios'}>
            <FormLabel>{intl.title}</FormLabel>
            <FormInput
              onChangeText={this.onChangeTitle}
              placeholder={intl.title_placeholder}
              value={titleInput}
              maxLength={255}
              inputStyle={{ width: inputWidth, color }}
              placeholderTextColor={color}
            />
            {displayTitleError && <FormValidationMessage>{titleError}</FormValidationMessage>}
            <TagsInput
              tags={tags}
              tagsInput={tagsInput}
              onChangeTags={this.onChangeTags}
              removeTag={this.removeTag}
              tagError={tagError}
              tagsInputWidth={inputWidth}
            />
            <FormLabel>{intl.body}</FormLabel>
            <FormInput
              onChangeText={this.onChangeBody}
              placeholder=""
              multiline
              value={bodyInput}
              inputStyle={{ width: inputWidth, color }}
              placeholderTextColor={color}
            />
            {this.renderAdditionalContents()}
            {imageLoading && <SmallLoading style={{ marginTop: 20, alignSelf: 'center' }} />}
            <ActionButtonsContainer>
              <PrimaryButton
                onPress={this.handleSubmit}
                title={intl.edit_post}
                disabled={createPostLoading}
                loading={createPostLoading}
              />
              <ActionButtons>
                <ActionButtonTouchable
                  onPress={this.addTextInput}
                  disabled={createPostLoading}
                  customTheme={customTheme}
                >
                  <Icon
                    name="note-add"
                    backgroundColor={customTheme.secondaryColor}
                    size={ICON_SIZES.actionIcon}
                    color={
                      tinycolor(customTheme.secondaryColor).isDark()
                        ? COLORS.LIGHT_TEXT_COLOR
                        : COLORS.DARK_TEXT_COLOR
                    }
                  />
                </ActionButtonTouchable>
                <ActionButtonTouchable
                  onPress={this.pickImage}
                  disabled={createPostLoading}
                  customTheme={customTheme}
                >
                  <Icon
                    name="add-a-photo"
                    backgroundColor={customTheme.secondaryColor}
                    size={ICON_SIZES.actionIcon}
                    color={
                      tinycolor(customTheme.secondaryColor).isDark()
                        ? COLORS.LIGHT_TEXT_COLOR
                        : COLORS.DARK_TEXT_COLOR
                    }
                  />
                </ActionButtonTouchable>
              </ActionButtons>
            </ActionButtonsContainer>
          </StyledScrollView>
        )}
        <PostCreationPreviewModal
          handleHidePreview={this.hidePreview}
          previewVisible={previewVisible}
          postData={currentPostData}
        />
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditPostScreen);
