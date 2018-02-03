import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image, TouchableOpacity } from 'react-native';
import _ from 'lodash';
import uuidv4 from 'uuid/v4';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import { ImagePicker } from 'expo';
import * as navigationConstants from 'constants/navigation';
import i18n from 'i18n/i18n';
import { FormLabel, FormInput, Icon } from 'react-native-elements';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, MATERIAL_ICONS, MATERIAL_COMMUNITY_ICONS, ICON_SIZES } from 'constants/styles';
import { getAuthUsername } from 'state/rootReducer';
import { createPost, uploadImage } from 'state/actions/editorActions';
import Header from 'components/common/Header';
import TagsInput from 'components/editor/TagsInput';
import SmallLoading from 'components/common/SmallLoading';
import PrimaryButton from '/components/common/PrimaryButton';

const Container = styled.View`
  flex: 1;
`;

const StyledScrollView = styled.ScrollView``;

const TouchableMenu = styled.TouchableOpacity``;

const TouchableMenuContainer = styled.View`
  padding: 5px;
`;

const EmptyView = styled.View`
  width: 5px;
`;

const CreatePostText = styled.Text`
  color: ${COLORS.PRIMARY_COLOR};
  font-weight: bold;
`;

const ImageContainer = styled.View`
  flex-direction: row;
  margin-top: 10px;
  padding: 0px 20px;
  flex-wrap: wrap;
`;

const ImageOption = styled.View`
  flex-direction: row;
  padding: 5px 0;
  margin-right: 10px;
`;

const ImagePickerTouchable = styled.TouchableOpacity`
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
  margin-top; 10px;
  justify-content: space-between;
`;

const mapStateToProps = state => ({
  authUsername: getAuthUsername(state),
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
    menuVisibile: false,
    tagError: '',
  };

  constructor(props) {
    super(props);
    this.state = PostCreationScreen.INITIAL_STATE;

    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeTags = this.onChangeTags.bind(this);
    this.onChangeBody = this.onChangeBody.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.pickImage = this.pickImage.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.removeTag = this.removeTag.bind(this);
    this.handleCreatePostSuccess = this.handleCreatePostSuccess.bind(this);
  }

  onChangeTitle(value) {
    this.setState({
      titleInput: value,
    });
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
      aspect: [4, 4],
    });

    console.log('IMAGE PICKER', result);

    if (!result.cancelled) {
      this.setState({ imageLoading: true });
      this.props.uploadImage(
        result.uri,
        (url, name) => {
          console.log('IMAGE SUCCESS', url, name);
          this.insertImage(url, name);
        },
        () => {
          console.log('ERROR');
        },
      );
    }
  }

  insertImage = (image, imageName = 'image') => {
    const newImage = {
      src: image,
      name: imageName,
      id: uuidv4(),
    };
    this.setState({
      currentImages: _.concat(this.state.currentImages, newImage),
      imageLoading: false,
    });
  };

  getPostData() {
    const tags = _.compact([...this.state.tags, 'bsteem', 'busy']);
    const images = _.map(this.state.currentImages, image => image.src);
    let postBody = this.state.bodyInput;
    let postImages = _.reduce(
      this.state.currentImages,
      (str, image) => {
        const imageText = `![${image.name}](${image.src})\n`;
        return `${str}${imageText}`;
      },
      ' ',
    );
    postBody += postImages;
    const postTitle = this.state.titleInput;
    const data = {
      body: postBody,
      title: postTitle,
      reward: '50',
      author: this.props.authUsername,
      parentAuthor: '',
      lastUpdated: Date.now(),
      upvote: true,
    };

    const metaData = {
      community: 'bsteem',
      app: 'bsteem v0.0',
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

  toggleMenu() {
    this.setState({
      menuVisible: !this.state.menuVisibile,
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

  removeImage(image) {
    const { currentImages } = this.state;
    const newImages = [...currentImages];
    const index = newImages.indexOf(image);

    if (index > -1) {
      newImages.splice(index, 1);
    }
    this.setState({
      currentImages: newImages,
    });
  }

  handleCreatePostSuccess(postData) {
    const { title, category, author, json_metadata, body, permlink, id } = postData;
    const parsedJsonMetadata = _.attempt(JSON.parse, json_metadata);
    this.setState(PostCreationScreen.INITIAL_STATE);
    this.props.navigation.navigate(navigationConstants.POST, {
      title,
      body,
      permlink,
      author,
      parsedJsonMetadata: _.isError(parsedJsonMetadata) ? {} : parsedJsonMetadata,
      category,
      postId: id,
      postData,
    });
  }

  handleSubmit() {
    const postData = this.getPostData();
    this.props.createPost(postData, this.handleCreatePostSuccess);
  }

  render() {
    const {
      titleInput,
      tagsInput,
      tags,
      bodyInput,
      tagError,
      currentImages,
      imageLoading,
    } = this.state;
    return (
      <Container>
        <Header>
          <EmptyView />
          <CreatePostText>{i18n.titles.createPost}</CreatePostText>
          <TouchableMenu onPress={this.toggleMenu}>
            <TouchableMenuContainer>
              <MaterialCommunityIcons
                size={ICON_SIZES.menuIcon}
                name={MATERIAL_COMMUNITY_ICONS.menuVertical}
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
          />
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
          <ImageContainer>
            {_.map(currentImages, (image, index) => (
              <ImageOption key={`${image.src}/${index}`}>
                <Image
                  source={{ uri: image.src }}
                  style={{ width: 100, height: 100, borderRadius: 4, marginRight: 3 }}
                  resizeMode={Image.resizeMode.contain}
                />
                <TouchableOpacity onPress={() => this.removeImage(image.src)}>
                  <MaterialIcons name={MATERIAL_ICONS.close} size={ICON_SIZES.actionIcon} />
                </TouchableOpacity>
              </ImageOption>
            ))}
            {imageLoading && <SmallLoading />}
          </ImageContainer>
          <ActionButtonsContainer>
            <PrimaryButton
              onPress={this.handleSubmit}
              title="Create Post"
              backgroundColor={COLORS.PRIMARY_COLOR}
              rounded
            />
            <ImagePickerTouchable onPress={this.pickImage}>
              <Icon
                name="add-a-photo"
                backgroundColor={COLORS.GREY.NERO}
                size={ICON_SIZES.actionIcon}
                color={COLORS.WHITE.WHITE}
              />
            </ImagePickerTouchable>
          </ActionButtonsContainer>
        </StyledScrollView>
      </Container>
    );
  }
}

export default PostCreationScreen;
