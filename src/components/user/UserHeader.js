import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { MaterialIcons } from '@expo/vector-icons';
import Avatar from 'components/common/Avatar';
import { getUserBackgroundCoverUrl } from 'util/busyImageUtils';
import { COLORS, MATERIAL_ICONS } from 'constants/styles';
import ReputationScore from 'components/post/ReputationScore';

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
`;

const UsernameText = styled.Text`
  font-size: 20px;
  color: ${COLORS.WHITE.WHITE};
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
  color: ${COLORS.WHITE.WHITE};
 `;

const FollowButton = styled.TouchableOpacity`
  background-color: ${COLORS.BLUE.MARINER};
  border-radius: 4px;
  margin-left: auto;
  padding: 5px;
  margin-right: 16px;
`;

class UserHeader extends Component {
  static propTypes = {
    username: PropTypes.string,
  };

  static defaultProps = {
    username: '',
  };

  render() {
    const { username } = this.props;
    return (
      <Container>
        <BackgroundImage
          resizeMode="cover"
          source={{ uri: getUserBackgroundCoverUrl(username) }}
          style={{ width: null, height: null }}
        />
        <UserHeaderContents>
          <Avatar username={username} size={50} />
          <View>
            <UsernameContainer>
              <UsernameText>{username}</UsernameText>
              <ReputationScore reputation={10} />
            </UsernameContainer>
            <HandleContainer>
              <Handle>
                {`@${username}`}
              </Handle>
            </HandleContainer>
          </View>
          <FollowButton>
            <MaterialIcons size={24} name={MATERIAL_ICONS.follow} color={COLORS.WHITE.WHITE} />
          </FollowButton>
        </UserHeaderContents>
      </Container>
    );
  }
}

export default UserHeader;
