import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  TouchableOpacity,
  View,
  Dimensions,
  Picker,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import _ from 'lodash';
import uuidv4 from 'uuid/v4';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import { ImagePicker } from 'expo';
import * as navigationConstants from 'constants/navigation';
import { FormLabel, FormInput, Icon, FormValidationMessage } from 'react-native-elements';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import {
  COLORS,
  MATERIAL_ICONS,
  ICON_SIZES,
  MATERIAL_COMMUNITY_ICONS,
  FONTS,
} from 'constants/styles';
import {
  getAuthUsername,
  getCreatePostLoading,
  getLoadingSavingDraft,
  getCustomTheme,
  getIntl,
  getSignature,
  getEnableSignature,
} from 'state/rootReducer';
import { createPost, uploadImage } from 'state/actions/editorActions';
import { saveDraft } from 'state/actions/firebaseActions';
import Header from 'components/common/Header';
import TagsInput from 'components/editor/TagsInput';
import SmallLoading from 'components/common/SmallLoading';
import PrimaryButton from 'components/common/PrimaryButton';
import StyledViewPrimaryBackground from 'components/common/StyledViewPrimaryBackground';
import tinycolor from 'tinycolor2';
import * as postConstants from 'constants/postConstants';
import TitleText from 'components/common/TitleText';
import PrimaryText from 'components/common/text/PrimaryText';
import PostCreationPreviewModal from './PostCreationPreviewModal';
import DisclaimerText from './DisclaimerText';

let PostCreationMenu = null;
let DraftsModal = null;

const { width: deviceWidth } = Dimensions.get('screen');

const Container = styled(StyledViewPrimaryBackground)`
  flex: 1;
`;

const StyledScrollView = styled.ScrollView`
  padding-bottom: 200px;
`;

const CreatePostText = styled(TitleText)`
  margin-left: 3px;
`;

const TouchableMenu = styled.TouchableOpacity``;

const TouchableMenuContainer = styled.View`
  padding: 5px;
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

const PickerContainer = styled.View`
  padding: 0 10px;
`;

const StatusContent = styled.View`
  padding: 10px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const StatusText = styled(PrimaryText)`
  color: ${props => props.customTheme.primaryColor};
`;

const TitleTextContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
  authUsername: getAuthUsername(state),
  createPostLoading: getCreatePostLoading(state),
  loadingSavingDraft: getLoadingSavingDraft(state),
  signature: getSignature(state),
  enableSignature: getEnableSignature(state),
  intl: getIntl(state),
});

const mapDispatchToProps = dispatch => ({
  createPost: (postData, callback, failCallback) =>
    dispatch(createPost.action({ postData, callback, failCallback })),
  uploadImage: (imageData, callback, errorCallback) =>
    dispatch(uploadImage.action({ imageData, callback, errorCallback })),
  saveDraft: (postData, draftID, successCallback) =>
    dispatch(saveDraft.action({ postData, draftID, successCallback })),
});

@connect(mapStateToProps, mapDispatchToProps)
class PostCreationScreen extends Component {
  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => (
      <MaterialIcons name={MATERIAL_ICONS.create} size={ICON_SIZES.tabBarIcon} color={tintColor} />
    ),
  };

  static propTypes = {
    customTheme: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    authUsername: PropTypes.string.isRequired,
    createPostLoading: PropTypes.bool.isRequired,
    loadingSavingDraft: PropTypes.bool.isRequired,
    enableSignature: PropTypes.bool.isRequired,
    signature: PropTypes.string,
    saveDraft: PropTypes.func.isRequired,
    uploadImage: PropTypes.func.isRequired,
    createPost: PropTypes.func.isRequired,
  };

  static defaultProps = {
    signature: '',
  };

  static INITIAL_STATE = {
    titleInput: '',
    tagsInput: '',
    bodyInput: '',
    tags: [],
    currentImages: [],
    tagError: '',
    titleError: '',
    bodyError: '',
    additionalPostContents: [],
    additionalInputCounter: 0,
    previewVisible: false,
    createPostDisplayInPreview: false,
    errorImageUploading: false,
    imageLoading: false,
    currentPostData: { body: '' },
    rewards: postConstants.REWARDS.HALF,
    draftsVisible: false,
    menuVisible: false,
    savePostError: false,
    savePostSuccess: false,
    keyboardDisplayed: false,
    draftID: null,
    inputWidth: '99%',
  };

  constructor(props) {
    super(props);
    this.state = PostCreationScreen.INITIAL_STATE;

    this.additionalContents = {};

    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeTags = this.onChangeTags.bind(this);
    this.onChangeBody = this.onChangeBody.bind(this);
    this.onChangeRewards = this.onChangeRewards.bind(this);

    this.pickImage = this.pickImage.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.removeTag = this.removeTag.bind(this);
    this.handleCreatePostSuccess = this.handleCreatePostSuccess.bind(this);
    this.handleSuccessImageUpload = this.handleSuccessImageUpload.bind(this);
    this.handleErrorImageUpload = this.handleErrorImageUpload.bind(this);
    this.insertImage = this.insertImage.bind(this);
    this.addTextInput = this.addTextInput.bind(this);
    this.renderAdditionalContents = this.renderAdditionalContents.bind(this);
    this.removeAdditionalContent = this.removeAdditionalContent.bind(this);

    this.hidePreview = this.hidePreview.bind(this);
    this.showPreview = this.showPreview.bind(this);

    this.handleSavePost = this.handleSavePost.bind(this);
    this.handleSuccessSaveDraft = this.handleSuccessSaveDraft.bind(this);
    this.handlePostPreviewSubmit = this.handlePostPreviewSubmit.bind(this);
    this.handleEditSignature = this.handleEditSignature.bind(this);
    this.handleErasePost = this.handleErasePost.bind(this);
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
    setTimeout(() => {
      this.setState({ inputWidth: '100%' });
    }, 100);
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  onChangeRewards(rewards) {
    this.setState({
      rewards,
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
        .uniq()
        .value();
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

  onChangeBody(value) {
    this.setState({
      bodyInput: value,
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
      this.props.uploadImage(result, this.handleSuccessImageUpload, this.handleErrorImageUpload);
    }
  }

  handleSetKeyboardDisplay = keyboardDisplayed => () => this.setState({ keyboardDisplayed });

  handleSuccessImageUpload(url, name) {
    this.insertImage(url, name);
  }

  handleErrorImageUpload() {
    this.setState({
      imageLoading: false,
      errorImageUploading: true,
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

  getPostData() {
    const bsteemTag = 'bsteem';
    const tags = _.uniq([...this.state.tags, bsteemTag]);
    const images = _.map(this.state.currentImages, image => image.src);
    const postBody = this.getPostBody();
    let body = _.isEmpty(postBody) ? ' ' : postBody;

    if (this.props.enableSignature) {
      body += _.isEmpty(this.props.signature) ? '' : `\n${this.props.signature}`;
    }

    const postTitle = this.state.titleInput;
    const data = {
      body,
      title: postTitle,
      reward: this.state.rewards,
      author: this.props.authUsername,
      parentAuthor: '',
      lastUpdated: Date.now(),
      upvote: true,
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

    data.parentPermlink = _.first(tags);
    data.permlink = _.kebabCase(postTitle);
    data.jsonMetadata = metaData;

    return data;
  }

  hidePreview() {
    this.setState({
      previewVisible: false,
    });
  }

  showPreview() {
    this.setState({
      previewVisible: true,
      currentPostData: this.getPostData(),
      menuVisible: false,
    });
  }

  toggleMenu = menuVisible => () => {
    if (menuVisible && PostCreationMenu === null) {
      PostCreationMenu = require('./PostCreationMenu').default;
    }

    this.setState({ menuVisible });
  };

  toggleDrafts = draftsVisible => () => {
    if (draftsVisible && DraftsModal === null) {
      DraftsModal = require('./DraftsModal').default;
    }

    this.setState({ draftsVisible });
  };

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

  handleEditSignature() {
    this.setState({
      menuVisible: false,
    });
    this.props.navigation.navigate(navigationConstants.SIGNATURE_EDITOR);
  }

  handleCreatePostSuccess(author, permlink) {
    // reset form state
    this.setState(PostCreationScreen.INITIAL_STATE);
    this.additionalContents = {};

    this.props.navigation.navigate(navigationConstants.POST, {
      permlink,
      author,
    });
  }

  handleSuccessSaveDraft() {
    this.setState({
      savePostError: false,
      savePostSuccess: true,
    });
  }

  handleSavePost() {
    this.setState({
      savePostError: false,
      savePostSuccess: false,
    });

    const postData = this.getPostData();
    let { draftID } = this.state;

    if (_.isNull(draftID)) {
      draftID = new Date().getTime();
    }

    const title = _.get(postData, 'title');
    const body = _.get(postData, 'body');

    if (_.isEmpty(title) || _.isEmpty(body)) {
      this.setState({
        savePostError: true,
        savePostSuccess: false,
      });
    } else {
      this.setState(
        {
          savePostError: false,
          draftID,
        },
        () => this.props.saveDraft(postData, draftID, this.handleSuccessSaveDraft),
      );
    }
  }

  handleErasePost() {
    // reset form state
    this.setState(PostCreationScreen.INITIAL_STATE);
    this.additionalContents = {};
  }

  handleSubmit() {
    // validate form
    const { intl } = this.props;
    const { tags, titleInput } = this.state;
    const errorState = {};

    if (_.isEmpty(tags)) errorState.tagError = intl.editor_error_empty_tags;
    if (_.isEmpty(titleInput)) errorState.titleError = intl.editor_error_empty_title;

    if (_.isEmpty(errorState)) {
      this.setState({
        previewVisible: true,
        createPostDisplayInPreview: true,
        currentPostData: this.getPostData(),
        menuVisible: false,
      });
    } else {
      this.setState(errorState);
    }
  }

  handlePostPreviewSubmit(postPreviewFailCallback) {
    const postData = this.getPostData();
    this.props.createPost(postData, this.handleCreatePostSuccess, postPreviewFailCallback);
  }

  handleSelectDraft = postData => () => {
    const titleInput = _.get(postData, 'title', '');
    const bodyInput = _.get(postData, 'body', '');
    const draftID = _.get(postData, 'draftID', null);
    const tags = _.filter(_.get(postData, 'jsonMetadata.tags', []), tag => tag !== 'bsteem');

    this.setState({
      titleInput,
      bodyInput,
      tags,
      draftsVisible: false,
      draftID,
    });
  };

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
        const inputTextColor = tinycolor(customTheme.primaryBackgroundColor).isDark()
          ? COLORS.LIGHT_TEXT_COLOR
          : COLORS.DARK_TEXT_COLOR;
        return (
          <View key={key}>
            <FormInput
              ref={input => (this.additionalContents[ref] = input)}
              placeholder={intl.body_placeholder}
              multiline
              inputStyle={{
                width: '100%',
                color: inputTextColor,
                fontFamily: FONTS.PRIMARY,
              }}
              placeholderTextColor={inputTextColor}
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

  renderPostStatusMessages() {
    const { loadingSavingDraft, customTheme, intl } = this.props;
    const { savePostError, savePostSuccess } = this.state;

    if (loadingSavingDraft) {
      return (
        <StatusContent>
          <SmallLoading />
          <StatusText customTheme={customTheme} style={{ color: customTheme.primaryColor }}>
            {intl.saving}
          </StatusText>
        </StatusContent>
      );
    } else if (savePostError) {
      return (
        <StatusContent>
          <MaterialIcons
            size={ICON_SIZES.menuModalOptionIcon}
            color={customTheme.negativeColor}
            name={MATERIAL_ICONS.warning}
          />
          <StatusText customTheme={customTheme} style={{ color: customTheme.negativeColor }}>
            {intl.error_saving_empty_title_or_body}
          </StatusText>
        </StatusContent>
      );
    } else if (savePostSuccess) {
      return (
        <StatusContent>
          <MaterialIcons
            size={ICON_SIZES.menuModalOptionIcon}
            color={customTheme.positiveColor}
            name={MATERIAL_ICONS.checkCircle}
          />
          <StatusText customTheme={customTheme} style={{ color: customTheme.positiveColor }}>
            {intl.post_saved_to_drafts}
          </StatusText>
        </StatusContent>
      );
    }
    return null;
  }

  render() {
    const { createPostLoading, loadingSavingDraft, customTheme, intl } = this.props;
    const {
      titleInput,
      tagsInput,
      tags,
      bodyInput,
      tagError,
      imageLoading,
      titleError,
      previewVisible,
      currentPostData,
      rewards,
      draftsVisible,
      menuVisible,
      savePostError,
      savePostSuccess,
      keyboardDisplayed,
      createPostDisplayInPreview,
      inputWidth,
    } = this.state;
    const displayTitleError = !_.isEmpty(titleError);
    const inputTextColor = tinycolor(customTheme.primaryBackgroundColor).isDark()
      ? COLORS.LIGHT_TEXT_COLOR
      : COLORS.DARK_TEXT_COLOR;

    return (
      <Container>
        <Header>
          <TouchableMenu onPress={this.toggleDrafts(true)}>
            <TouchableMenuContainer>
              <MaterialCommunityIcons
                size={ICON_SIZES.menuIcon}
                name={MATERIAL_COMMUNITY_ICONS.noteMultipleOutline}
                color={customTheme.primaryColor}
              />
            </TouchableMenuContainer>
          </TouchableMenu>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <TitleTextContainer>
              <CreatePostText>{intl.create_post}</CreatePostText>
              <MaterialIcons
                size={ICON_SIZES.menuIcon}
                color={keyboardDisplayed ? customTheme.primaryColor : 'transparent'}
                name={MATERIAL_ICONS.keyboardHide}
              />
            </TitleTextContainer>
          </TouchableWithoutFeedback>
          <TouchableMenu onPress={this.toggleMenu(true)}>
            <TouchableMenuContainer>
              <MaterialCommunityIcons
                size={ICON_SIZES.menuIcon}
                name={MATERIAL_COMMUNITY_ICONS.menuVertical}
                color={customTheme.primaryColor}
              />
            </TouchableMenuContainer>
          </TouchableMenu>
        </Header>
        <StyledScrollView>
          <FormLabel>{intl.title}</FormLabel>
          <FormInput
            onChangeText={this.onChangeTitle}
            placeholder={intl.title_placeholder}
            value={titleInput}
            maxLength={255}
            inputStyle={{
              width: inputWidth,
              color: inputTextColor,
              fontFamily: FONTS.PRIMARY,
            }}
            placeholderTextColor={inputTextColor}
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
            placeholder={intl.body_placeholder}
            multiline
            value={bodyInput}
            inputStyle={{
              width: inputWidth,
              color: inputTextColor,
              fontFamily: FONTS.PRIMARY,
            }}
            placeholderTextColor={inputTextColor}
          />
          {this.renderAdditionalContents()}
          {imageLoading && <SmallLoading style={{ marginTop: 20, alignSelf: 'center' }} />}
          <FormLabel>{intl.rewards}</FormLabel>
          <PickerContainer>
            <Picker
              selectedValue={rewards}
              onValueChange={this.onChangeRewards}
              itemStyle={{ color: inputTextColor, fontFamily: FONTS.PRIMARY }}
            >
              <Picker.Item label={intl.reward_option_50} value={postConstants.REWARDS.HALF} />
              <Picker.Item label={intl.reward_option_100} value={postConstants.REWARDS.ALL} />
              <Picker.Item label={intl.reward_option_0} value={postConstants.REWARDS.NONE} />
            </Picker>
          </PickerContainer>
          <DisclaimerText />
          {this.renderPostStatusMessages()}
          <ActionButtonsContainer>
            <PrimaryButton
              onPress={this.handleSubmit}
              title="Create Post"
              disabled={createPostLoading}
              loading={createPostLoading}
            />
            <ActionButtons>
              <ActionButtonTouchable
                customTheme={customTheme}
                onPress={this.handleSavePost}
                disabled={createPostLoading}
              >
                <Icon
                  name={MATERIAL_ICONS.save}
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
                customTheme={customTheme}
                onPress={this.addTextInput}
                disabled={createPostLoading}
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
                customTheme={customTheme}
                onPress={this.pickImage}
                disabled={createPostLoading}
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
        <PostCreationPreviewModal
          handleHidePreview={this.hidePreview}
          previewVisible={previewVisible}
          postData={currentPostData}
          createPostDisplayInPreview={createPostDisplayInPreview}
          handlePostPreviewSubmit={this.handlePostPreviewSubmit}
        />
        {draftsVisible && (
          <DraftsModal
            handleHideDrafts={this.toggleDrafts(false)}
            draftsVisible={draftsVisible}
            handleSelectDraft={this.handleSelectDraft}
          />
        )}
        {menuVisible && (
          <PostCreationMenu
            hideMenu={this.toggleMenu(false)}
            menuVisible={menuVisible}
            handleShowPreview={this.showPreview}
            handleSavePost={this.handleSavePost}
            loadingSavingDraft={loadingSavingDraft}
            savePostError={savePostError}
            savePostSuccess={savePostSuccess}
            handleEditSignature={this.handleEditSignature}
            handleErasePost={this.handleErasePost}
          />
        )}
      </Container>
    );
  }
}

export default PostCreationScreen;
