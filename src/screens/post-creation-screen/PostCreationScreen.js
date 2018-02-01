import React, { Component } from 'react';
import { Image, TouchableOpacity, Text } from 'react-native';
import _ from 'lodash';
import styled from 'styled-components/native';
import { ImagePicker } from 'expo';
import Tag from 'components/post/Tag';
import { FormLabel, FormInput, Button, FormValidationMessage } from 'react-native-elements';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, MATERIAL_ICONS, MATERIAL_COMMUNITY_ICONS, ICON_SIZES } from 'constants/styles';

const Container = styled.View`
  flex: 1;
`;

const StyledScrollView = styled.ScrollView``;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${COLORS.WHITE.WHITE};
  border-bottom-color: ${COLORS.WHITE.GAINSBORO};
  border-bottom-width: 1px;
  width: 100%;
  padding-top: 20px;
  min-height: 45px;
`;

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

class PostCreationScreen extends Component {
  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => (
      <MaterialIcons name={MATERIAL_ICONS.create} size={ICON_SIZES.tabBarIcon} color={tintColor} />
    ),
  };

  constructor(props) {
    super(props);
    this.state = {
      titleInput: '',
      tagsInput: '',
      tags: [],
      image: null,
      menuVisibile: false,
      tagError: false,
    };

    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeTags = this.onChangeTags.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.pickImage = this.pickImage.bind(this);
  }

  onChangeTitle(value) {
    this.setState({
      titleInput: value,
    });
  }

  onChangeTags(value) {
    if (_.isEmpty(value)) return;
    if (_.size(this.state.tags) >= 5) return;

    if (_.includes(value, ' ') || _.includes(value, ',')) {
      const newTag = _.replace(_.replace(value, ' ', ''), ',', '');
      if (_.includes(this.state.tags, newTag)) {
        this.setState({ tagsInput: true });
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

  async pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 4],
    });

    console.log(result);

    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
  }

  toggleMenu() {
    this.setState({
      menuVisible: !this.state.menuVisibile,
    });
  }

  renderTagErrors() {
    const { tagError } = this.state;
    const emptyErrorMessage = 'Please enter tags';

    if (tagError) {
      return <FormValidationMessage>{emptyErrorMessage}</FormValidationMessage>;
    }
  }

  render() {
    const { titleInput, tagsInput, tags } = this.state;
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
          <FormInput onChange={this.onChangeTitle} placeholder="Enter title" value={titleInput} />
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
          />
          <TagsContainer>{_.map(tags, tag => <Tag key={tag} tag={tag} />)}</TagsContainer>
          <FormLabel>Post Body</FormLabel>
          <FormInput
            onChangeText={this.onChangeTitle}
            placeholder="Write your story..."
            multiline
          />
          {this.state.image && (
            <Image source={{ uri: this.state.image }} style={{ width: 200, height: 200 }} />
          )}
          <Button
            raised
            onPress={this.pickImage}
            icon={{ name: 'add-a-photo' }}
            title="Add Images"
            backgroundColor={COLORS.BLUE.MARINER}
            borderRadius={10}
          />
        </StyledScrollView>
      </Container>
    );
  }
}

export default PostCreationScreen;
