import React, { Component } from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, MATERIAL_ICONS, MATERIAL_COMMUNITY_ICONS, ICON_SIZES } from 'constants/styles';
import { FormLabel, FormInput, Button } from 'react-native-elements';
import styled from 'styled-components/native';
import { ImagePicker } from 'expo';

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

const TouchableMenu = styled.TouchableOpacity`
`;

const TouchableMenuContainer = styled.View`
  padding: 5px;
`;

const EmptyView = styled.View`
  width: 5px;
`;

const CreatePostText = styled.Text`
  color: ${COLORS.BLUE.MARINER};
  font-weight: bold;
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
      text: '',
      image: null,
      menuVisibile: false,
    };

    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
  }

  toggleMenu() {
    this.setState({
      menuVisible: !this.state.menuVisibile,
    });
  }

  onChangeTitle(value) {}

  render() {
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
          <FormInput onChangeText={this.onChangeTitle()} placeholder="Enter title" />
          <FormLabel>Post Body</FormLabel>
          <FormInput
            onChangeText={this.onChangeTitle()}
            placeholder="Write your story..."
            multiline
          />
          {this.state.image &&
            <Image source={{ uri: this.state.image }} style={{ width: 200, height: 200 }} />}
        </StyledScrollView>
        <Button
          raised
          onPress={this._pickImage}
          icon={{ name: 'add-a-photo' }}
          title="Add Images"
          backgroundColor={COLORS.BLUE.MARINER}
          borderRadius={10}
        />
      </Container>
    );
  }

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    console.log(result);

    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
  };
}

export default PostCreationScreen;
