import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image, TouchableOpacity, Text, Dimensions } from 'react-native';
import _ from 'lodash';
import uuidv4 from 'uuid/v4';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import { ImagePicker } from 'expo';
import * as navigationConstants from 'constants/navigation';
import { FormLabel, FormInput, Button, FormValidationMessage } from 'react-native-elements';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, MATERIAL_ICONS, MATERIAL_COMMUNITY_ICONS, ICON_SIZES } from 'constants/styles';
import { getAuthUsername } from 'state/rootReducer';
import { createPost, uploadImage } from 'state/actions/editorActions';
import Tag from 'components/post/Tag';
import Header from 'components/common/Header';

const { width: deviceWidth } = Dimensions.get('screen');

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

const StyledText = styled.Text`
  padding: 0px 20px;
`;

const CreatePostText = styled.Text`
  color: ${COLORS.BLUE.MARINER};
  font-weight: bold;
`;

const TagsContainer = styled.View`
  flex-direction: row;
  padding: 5px 20px;
  flex-wrap: wrap;
`;

const ImageContainer = styled.View`
  justify-content: center;
  align-items: center;
  margin-top: 10px;
`;

const TagOption = styled.View`
  flex-direction: row;
  padding: 5px 0;
`;

const ButtonContainer = styled.View`
  margin: 10px 0;
`;

const PostPreviewButton = () => (
  <TouchableOpacity onPress={() => {}}>
    <MaterialCommunityIcons
      name={MATERIAL_COMMUNITY_ICONS.magnify}
      size={ICON_SIZES.tabBarIcon}
      color={COLORS.WHITE.WHITE}
    />
  </TouchableOpacity>
);

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
    tagError: false,
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

    if (_.size(this.state.tags) >= 5) return;

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
      this.setState({ image: result.uri });
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

  renderTagErrors() {
    const { tagError } = this.state;
    const emptyErrorMessage = 'Please enter tags';

    if (tagError) {
      return <FormValidationMessage>{emptyErrorMessage}</FormValidationMessage>;
    }
  }

  render() {
    const { titleInput, tagsInput, tags, bodyInput } = this.state;
    return (
      <Container>
        <Header>
          <EmptyView />
          <CreatePostText>Create Post</CreatePostText>
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
          <FormLabel>Title</FormLabel>
          <FormInput
            onChangeText={this.onChangeTitle}
            placeholder="Enter title"
            value={titleInput}
          />
          <FormLabel>Post Tags</FormLabel>
          <StyledText>
            Separate topics with commas or spaces. Only lowercase letters, numbers and hyphen
            character is permitted.
          </StyledText>
          {this.renderTagErrors()}
          <FormInput
            onChangeText={this.onChangeTags}
            placeholder="Please enter tags"
            value={tagsInput}
            autoCapitalize="none"
          />
          <TagsContainer>
            {_.map(tags, tag => (
              <TagOption key={tag}>
                <Tag tag={tag} />
                <TouchableOpacity onPress={() => this.removeTag(tag)}>
                  <MaterialIcons name="close" size={24} />
                </TouchableOpacity>
              </TagOption>
            ))}
          </TagsContainer>
          <FormLabel>Post Body</FormLabel>
          <FormInput
            onChangeText={this.onChangeBody}
            placeholder="Write your story..."
            multiline
            value={bodyInput}
          />
          <ImageContainer>
            {_.map(this.state.currentImages, (image, index) => (
              <Image
                key={`${image.src}/${index}`}
                source={{ uri: image.src }}
                style={{ width: deviceWidth, height: deviceWidth }}
                resizeMode={Image.resizeMode.contain}
              />
            ))}
          </ImageContainer>
          <ButtonContainer>
            <Button
              raised
              onPress={() => {}}
              icon={{ name: 'add-a-photo' }}
              title="Add Text"
              backgroundColor={COLORS.GREY.NERO}
              borderRadius={10}
            />
            <Button
              onPress={this.pickImage}
              icon={{ name: 'add-a-photo' }}
              title="Add Images"
              backgroundColor={COLORS.GREY.NERO}
              borderRadius={10}
            />
          </ButtonContainer>
          <Button
            raised
            onPress={this.handleSubmit}
            title="Create Post"
            backgroundColor={COLORS.BLUE.MARINER}
            borderRadius={10}
          />
        </StyledScrollView>
      </Container>
    );
  }
}

export default PostCreationScreen;
