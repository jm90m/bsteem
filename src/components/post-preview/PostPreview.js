import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dimensions, Image } from 'react-native';
import styled from 'styled-components/native';
import { connect } from 'react-redux';
import _ from 'lodash';
import { COLORS } from 'constants/styles';
import { getIsAuthenticated } from 'state/reducers/authReducer';
import * as navigationConstants from 'constants/navigation';
import Footer from './Footer';
import Header from './Header';
import BodyShort from './BodyShort';
const { width } = Dimensions.get('screen');

const Container = styled.View`
  background-color: ${COLORS.WHITE.WHITE};
  margin-top: 5px;
  margin-bottom: 5px;
  border-color: ${COLORS.WHITE.WHITE_SMOKE};
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

const mapStateToProps = state => ({
  authenticated: getIsAuthenticated(state),
});

@connect(mapStateToProps)
class PostPreview extends Component {
  static propTypes = {
    navigation: PropTypes.shape().isRequired,
    authenticated: PropTypes.bool,
  };

  static defaultProps = {
    postData: {},
    authenticated: false,
  };

  constructor(props) {
    super(props);

    this.handleOnPressVote = this.handleOnPressVote.bind(this);
  }

  handleOnPressVote() {
    const { navigation, authenticated } = this.props;
    if (authenticated) {
      console.log('AUTH VOTE');
    } else {
      console.log('NOT AUTHENTICATED');
      navigation.navigate(navigationConstants.LOGIN);
    }
  }

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
        <Footer postData={postData} onPressVote={this.handleOnPressVote} />
      </Container>
    );
  }
}

export default PostPreview;
