import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image, TouchableOpacity, View, Dimensions, Picker } from 'react-native';
import _ from 'lodash';
import uuidv4 from 'uuid/v4';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import { ImagePicker } from 'expo';
import * as navigationConstants from 'constants/navigation';
import i18n from 'i18n/i18n';
import { FormLabel, FormInput, Icon, FormValidationMessage } from 'react-native-elements';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, MATERIAL_ICONS, ICON_SIZES } from 'constants/styles';
import { getAuthUsername, getCreatePostLoading } from 'state/rootReducer';
import { createPost, uploadImage } from 'state/actions/editorActions';
import defaultPostData from 'constants/defaultPostData';
import Header from 'components/common/Header';
import TagsInput from 'components/editor/TagsInput';
import SmallLoading from 'components/common/SmallLoading';
import PrimaryButton from 'components/common/PrimaryButton';
import HeaderEmptyView from 'components/common/HeaderEmptyView';
import { MATERIAL_COMMUNITY_ICONS } from '../../constants/styles';
import * as postConstants from 'constants/postConstants';
import PostCreationPreviewModal from './PostCreationPreviewModal';

const { width: deviceWidth } = Dimensions.get('screen');

const Container = styled.View`
  flex: 1;
`;

const StyledScrollView = styled.ScrollView`
  padding-bottom: 200px;
`;

const CreatePostText = styled.Text`
  color: ${COLORS.PRIMARY_COLOR};
  font-weight: bold;
`;

const TouchableMenu = styled.TouchableOpacity``;

const TouchableMenuContainer = styled.View`
  padding: 5px;
`;

const ActionButtonTouchable = styled.TouchableOpacity`
  width: 50px;
  height: 50px;
  justify-content: center;
  background-color: ${COLORS.GREY.CHARCOAL};
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

const mapStateToProps = state => ({
  authUsername: getAuthUsername(state),
  createPostLoading: getCreatePostLoading(state),
});

const mapDispatchToProps = dispatch => ({
  createPost: (postData, callback) => dispatch(createPost.action({ postData, callback })),
  uploadImage: (uri, callback, errorCallback) =>
    dispatch(uploadImage.action({ uri, callback, errorCallback })),
});

@connect(mapStateToProps, mapDispatchToProps)
class PostCreationScreen extends Component {
  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => (
      <MaterialIcons name={MATERIAL_ICONS.create} size={ICON_SIZES.tabBarIcon} color={tintColor} />
    ),
  };

  static propTypes = {
    authUsername: PropTypes.string.isRequired,
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
    currentPostData: { body: '' },
    rewards: postConstants.REWARDS.HALF,
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
    this.insertImage = this.insertImage.bind(this);
    this.addTextInput = this.addTextInput.bind(this);
    this.renderAdditionalContents = this.renderAdditionalContents.bind(this);
    this.removeAdditionalContent = this.removeAdditionalContent.bind(this);

    this.hidePreview = this.hidePreview.bind(this);
    this.showPreview = this.showPreview.bind(this);
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

    if (_.includes(value, ' ') || _.includes(value, ',')) {
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
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
    });

    console.log('IMAGE PICKER', result);

    if (!result.cancelled) {
      this.setState({ imageLoading: true });
      this.props.uploadImage(result.uri, this.handleSuccessImageUpload, () => {
        console.log('ERROR');
      });
    }
  }

  handleSuccessImageUpload(url, name) {
    this.insertImage(url, name);
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
    const tags = _.compact([...this.state.tags, bsteemTag]);
    const images = _.map(this.state.currentImages, image => image.src);
    const postBody = this.getPostBody();
    const body = _.isEmpty(postBody) ? ' ' : postBody;

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

  handleCreatePostSuccess(postData) {
    const { title, category, author, json_metadata, body, permlink, id } = postData;
    const postDataWithDefaults = {
      ...defaultPostData,
      ...postData,
    };
    const parsedJsonMetadata = _.attempt(JSON.parse, json_metadata);

    // reset form state
    this.setState(PostCreationScreen.INITIAL_STATE);
    this.additionalContents = {};

    this.props.navigation.navigate(navigationConstants.POST, {
      title,
      body,
      permlink,
      author,
      parsedJsonMetadata: _.isError(parsedJsonMetadata) ? {} : parsedJsonMetadata,
      category,
      postId: id,
      postData: postDataWithDefaults,
    });
  }

  handleSubmit() {
    // validate form
    const { tags, titleInput } = this.state;
    const errorState = {};

    if (_.isEmpty(tags)) errorState.tagError = i18n.editor.errors.emptyTags;
    if (_.isEmpty(titleInput)) errorState.titleError = i18n.editor.errors.emptyTitle;

    if (_.isEmpty(errorState)) {
      this.setState(errorState, () => {
        const postData = this.getPostData();
        this.props.createPost(postData, this.handleCreatePostSuccess);
      });
    } else {
      this.setState(errorState);
    }
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

  renderAdditionalContents() {
    const closeButtonStyles = {
      position: 'absolute',
      top: 5,
      right: 0,
      backgroundColor: 'transparent',
    };
    return _.map(this.state.additionalPostContents, (content, index) => {
      const { type, key, ref } = content;
      if (type === 'text') {
        return (
          <View key={key}>
            <FormInput
              ref={input => (this.additionalContents[ref] = input)}
              placeholder={i18n.editor.bodyPlaceholder}
              multiline
            />
            <TouchableOpacity
              onPress={() => this.removeAdditionalContent(index, type)}
              style={closeButtonStyles}
            >
              <MaterialCommunityIcons
                name={MATERIAL_COMMUNITY_ICONS.closeCircle}
                size={ICON_SIZES.editorCloseIcon}
                color={COLORS.PRIMARY_COLOR}
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
                color={COLORS.PRIMARY_COLOR}
              />
            </TouchableOpacity>
          </View>
        );
      }
    });
  }

  render() {
    const { createPostLoading } = this.props;
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
    } = this.state;
    const displayTitleError = !_.isEmpty(titleError);

    return (
      <Container>
        <Header>
          <HeaderEmptyView />
          <CreatePostText>{i18n.titles.createPost}</CreatePostText>
          <TouchableMenu onPress={this.showPreview}>
            <TouchableMenuContainer>
              <MaterialCommunityIcons
                size={ICON_SIZES.menuIcon}
                name={MATERIAL_COMMUNITY_ICONS.magnify}
              />
            </TouchableMenuContainer>
          </TouchableMenu>
        </Header>
        <StyledScrollView>
          <FormLabel>{i18n.editor.title}</FormLabel>
          <FormInput
            onChangeText={this.onChangeTitle}
            placeholder={i18n.editor.titlePlaceholder}
            value={titleInput}
            maxLength={255}
          />
          {displayTitleError && <FormValidationMessage>{titleError}</FormValidationMessage>}
          <TagsInput
            tags={tags}
            tagsInput={tagsInput}
            onChangeTags={this.onChangeTags}
            removeTag={this.removeTag}
            tagError={tagError}
          />
          <FormLabel>{i18n.editor.body}</FormLabel>
          <FormInput
            onChangeText={this.onChangeBody}
            placeholder={i18n.editor.bodyPlaceholder}
            multiline
            value={bodyInput}
          />
          {this.renderAdditionalContents()}
          {imageLoading && <SmallLoading style={{ marginTop: 20, alignSelf: 'center' }} />}
          <FormLabel>{i18n.editor.rewards}</FormLabel>
          <Picker selectedValue={rewards} onValueChange={this.onChangeRewards}>
            <Picker.Item label={i18n.editor.halfRewards} value={postConstants.REWARDS.HALF} />
            <Picker.Item label={i18n.editor.allRewards} value={postConstants.REWARDS.ALL} />
            <Picker.Item label={i18n.editor.noRewards} value={postConstants.REWARDS.NONE} />
          </Picker>
          <ActionButtonsContainer>
            <PrimaryButton
              onPress={this.handleSubmit}
              title="Create Post"
              disabled={createPostLoading}
              loading={createPostLoading}
            />
            <ActionButtons>
              <ActionButtonTouchable onPress={this.addTextInput} disabled={createPostLoading}>
                <Icon
                  name="note-add"
                  backgroundColor={COLORS.GREY.NERO}
                  size={ICON_SIZES.actionIcon}
                  color={COLORS.WHITE.WHITE}
                />
              </ActionButtonTouchable>
              <ActionButtonTouchable onPress={this.pickImage} disabled={createPostLoading}>
                <Icon
                  name="add-a-photo"
                  backgroundColor={COLORS.GREY.NERO}
                  size={ICON_SIZES.actionIcon}
                  color={COLORS.WHITE.WHITE}
                />
              </ActionButtonTouchable>
            </ActionButtons>
          </ActionButtonsContainer>
        </StyledScrollView>
        <PostCreationPreviewModal
          handleHidePreview={this.hidePreview}
          previewVisible={previewVisible}
          postData={currentPostData}
        />
      </Container>
    );
  }
}

export default PostCreationScreen;
