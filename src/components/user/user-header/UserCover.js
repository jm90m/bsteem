import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Dimensions } from 'react-native';
import styled from 'styled-components/native';
import _ from 'lodash';
import Avatar from 'components/common/Avatar';
import { getUserBackgroundCoverUrl } from 'util/busyImageUtils';
import { COLORS } from 'constants/styles';
import ReputationScore from 'components/post/ReputationScore';

const { width } = Dimensions.get('screen');

const Container = styled.View`
  height: 75px;
  width: 100%;
  background-color: ${props => (props.hasCover ? COLORS.VIOLET.PAUA : 'transparent')};
`;

const UserHeaderContents = styled.View`
  align-items: center;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 5px;
  height: 100%;
`;

const BackgroundImage = styled.Image`
  flex: 1;
  position: absolute;
`;

const UsernameText = styled.Text`
  font-size: 20px;
  color: ${props => (props.hasCover ? COLORS.WHITE.WHITE : COLORS.GREY.GONDOLA)};
  background-color: transparent;
  margin-right: 5px;
  font-weight: bold;
`;

const UsernameContainer = styled.View`
  margin-left: 5px;
  flex-direction: row;
  align-items: center;
`;

const HandleContainer = styled.View`
  margin-left: 5px;
`;

const Handle = styled.Text`
  font-size: 14px;
  background-color: transparent;
  color: ${props => (props.hasCover ? COLORS.WHITE.WHITE : COLORS.BLUE.BOTICELLI)};
  font-weight: 500;
`;

class UserCover extends Component {
  static propTypes = {
    username: PropTypes.string,
    userReputation: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    hasCover: PropTypes.bool,
    userProfile: PropTypes.shape(),
  };

  static defaultProps = {
    username: '',
    userReputation: '0',
    hasCover: false,
    userProfile: {},
  };

  constructor(props) {
    super(props);

    this.state = {
      hasCover: props.hasCover,
    };

    this.handleBackgroundCoverError = this.handleBackgroundCoverError.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      hasCover: nextProps.hasCover,
    });
  }

  handleBackgroundCoverError() {
    this.setState({
      hasCover: false,
    });
  }

  render() {
    const { username, userReputation, userProfile } = this.props;
    const { hasCover } = this.state;
    const name = _.get(userProfile, 'name', username);
    const displayName = _.isEmpty(_.trim(name)) ? username : name;
    return (
      <Container hasCover={hasCover}>
        <BackgroundImage
          resizeMode="cover"
          source={{ uri: getUserBackgroundCoverUrl(username) }}
          onError={this.handleBackgroundCoverError}
          style={{ width, height: 75 }}
        />
        <UserHeaderContents>
          <Avatar username={username} size={50} />
          <View>
            <UsernameContainer>
              <UsernameText hasCover={hasCover}>{displayName}</UsernameText>
              <ReputationScore reputation={userReputation} />
            </UsernameContainer>
            <HandleContainer>
              <Handle hasCover={hasCover}>{`@${username}`}</Handle>
            </HandleContainer>
          </View>
        </UserHeaderContents>
      </Container>
    );
  }
}

export default UserCover;
