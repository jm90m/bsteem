import React, { Component } from 'react';
import { Dimensions, Image, View } from 'react-native';
import styled from 'styled-components/native';
import _ from 'lodash';
import Remarkable from 'remarkable';

const { width, height } = Dimensions.get('screen');
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import Footer from './Footer';
import Header from './Header';
import { striptags } from '../../util/stripTags';

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

const Body = styled.Text`
  padding: 5px;
`;

const Touchable = styled.TouchableOpacity``;

const decodeEntities = body => {
  return body.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
};

const BodyShort = props => {
  const remarkable = new Remarkable({ html: true });
  let body = striptags(remarkable.render(striptags(decodeEntities(props.body))));
  body = body.replace(/(?:https?|ftp):\/\/[\S]+/g, '');
  body = body.replace(/&quot;|&amp;/g, '');
  body = body.replace(/(?:\r\n|\r|\n)/g, ' ');
  // If body consists of whitespace characters only skip it.
  if (!body.replace(/\s/g, '').length) {
    return null;
  }

  return (
    <Body numberOfLines={4} ellipsizeMode="tail">
      {body}
    </Body>
  );
};

class PostPreview extends Component {
  static defaultProps = {
    postData: {},
  };

  render() {
    const { postData, navigation } = this.props;

    const { title, category, author, json_metadata, body, permlink, id } = postData;
    const parsedJsonMetadata = JSON.parse(json_metadata);
    const images = parsedJsonMetadata.image || [];

    return (
      <Container>
        <Header postData={postData} navigation={navigation} />
        <Content>
          <Touchable
            onPress={() =>
              navigation.navigate('POST', {
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
            {images.length > 0 &&
              <PreviewImage
                style={{ height: null, width }}
                source={{ uri: _.head(images) }}
                resizeMode={Image.resizeMode.contain}
              />}
            <BodyShort body={body} />
          </Touchable>
        </Content>
        <Footer postData={postData} />
      </Container>
    );
  }
}

export default PostPreview;
