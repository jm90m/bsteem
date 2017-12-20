import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Dimensions } from 'react-native';
import styled from 'styled-components/native';
import { MaterialIcons } from '@expo/vector-icons';
import Avatar from 'components/common/Avatar';
import { getUserBackgroundCoverUrl } from 'util/busyImageUtils';
import { COLORS, MATERIAL_ICONS } from 'constants/styles';
import ReputationScore from 'components/post/ReputationScore';

const { width } = Dimensions.get('screen');

const Container = styled.View`
  height: 75px;
  width: 100%;
`;

const UserHeaderContents = styled.View`
  padding-top: 10px;
  align-items: center;
  padding-left: 16px;
  flex-direction: row;
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

const FollowButton = styled.TouchableOpacity`
  background-color: ${COLORS.BLUE.MARINER};
  border-radius: 4px;
  margin-left: auto;
  padding: 5px;
  margin-right: 16px;
`;

const FollowingButton = styled.TouchableOpacity`
  background-color: ${COLORS.BLUE.MARINER};
  border-radius: 4px;
  margin-left: auto;
  padding: 5px;
  margin-right: 16px;
`;

const LoadingFollowing = styled.ActivityIndicator`
  margin-left: auto;
`;

class UserCover extends Component {
  static propTypes = {
    username: PropTypes.string,
    userReputation: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    hasCover: PropTypes.bool,
    displayFollowButton: PropTypes.bool,
    hideFollowButton: PropTypes.bool,
    loadingIsFollowing: PropTypes.bool,
    handleFollow: PropTypes.func,
    handleUnfollow: PropTypes.func,
  };

  static defaultProps = {
    username: '',
    userReputation: '0',
    hasCover: false,
    displayFollowButton: true,
    hideFollowButton: false,
    loadingIsFollowing: false,
    handleFollow: () => {},
    handleUnfollow: () => {},
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

  renderFollowButton() {
    const {
      displayFollowButton,
      hideFollowButton,
      handleFollow,
      handleUnfollow,
      loadingIsFollowing,
    } = this.props;

    if (hideFollowButton) return null;

    if (loadingIsFollowing) {
      return <LoadingFollowing color={COLORS.BLUE.MARINER} size="small" />;
    }

    if (displayFollowButton) {
      return (
        <FollowButton onPress={handleFollow}>
          <MaterialIcons size={24} name={MATERIAL_ICONS.follow} color={COLORS.WHITE.WHITE} />
        </FollowButton>
      );
    }
    return (
      <FollowingButton onPress={handleUnfollow}>
        <MaterialIcons size={24} name={MATERIAL_ICONS.followed} color={COLORS.WHITE.WHITE} />
      </FollowingButton>
    );
  }

  render() {
    const { username, userReputation } = this.props;
    const { hasCover } = this.state;

    return (
      <Container>
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
              <UsernameText hasCover={hasCover}>{username}</UsernameText>
              <ReputationScore reputation={userReputation} />
            </UsernameContainer>
            <HandleContainer>
              <Handle hasCover={hasCover}>
                {`@${username}`}
              </Handle>
            </HandleContainer>
          </View>
          {this.renderFollowButton()}
        </UserHeaderContents>
      </Container>
    );
  }
}

export default UserCover;
