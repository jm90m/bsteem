import React, { Component } from 'react';
import { Dimensions, Image } from 'react-native';
import styled from 'styled-components/native';
import _ from 'lodash';
import * as navigationConstants from 'constants/navigation';
import Footer from './Footer';
import Header from './Header';
import BodyShort from './BodyShort';

const { width } = Dimensions.get('screen');

const Container = styled.View`
  background-color: #fff;
  margin-top: 5px;
  margin-bottom: 5px;
  border-color: #eee;
  border-width: 2px;
`;

const Content = styled.View`
  padding: 10px;
  padding-left: 0;
  padding-right: 0;
`;

const Title = styled.Text`
  padding-bottom: 10px;
  font-weight: 700;
  font-size: 20px;
  margin: 0 16px 8px;
`;

const PreviewImage = styled.Image`
  min-height: 200px;
  max-height: 400px;
`;

const Touchable = styled.TouchableOpacity``;

class PostPreview extends Component {
  static defaultProps = {
    postData: {},
  };

  render() {
    const { postData, navigation } = this.props;

    const { title, category, author, json_metadata, body, permlink, id } = postData;
    const parsedJsonMetadata = JSON.parse(json_metadata);
    const images = parsedJsonMetadata.image || [];
    const previewImage = _.head(images);
    const hasPreviewImage = images.length > 0 && !_.isEmpty(previewImage);
    return (
      <Container>
        <Header postData={postData} navigation={navigation} />
        <Content>
          <Touchable
            onPress={() =>
              navigation.navigate(navigationConstants.POST, {
                title,
                body,
                permlink,
                author,
                parsedJsonMetadata,
                category,
                postId: id,
                postData,
              })}
          >
            <Title>{title}</Title>
            {hasPreviewImage &&
              <PreviewImage
                style={{ height: null, width }}
                source={{ uri: previewImage }}
                resizeMode={Image.resizeMode.cover}
              />}
            <BodyShort content={body} />
          </Touchable>
        </Content>
        <Footer postData={postData} />
      </Container>
    );
  }
}

export default PostPreview;
