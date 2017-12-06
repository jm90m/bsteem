import React from 'react';
import PropTypes from 'propTypes';
import { View } from 'react-native';
import styled from 'styled-components/native';

const Container = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const FollowContainer = styled.View`
`;

const Value = styled.Text`
  font-weight: bold;
`;

const Label = styled.Text`
  font-size: 12px;
`;

class UserStats extends Component {
  static propTypes = {
    followerCount: PropTypes.number,
    followingCount: PropTypes.number,
    postCount: PropTypes.number,
  };

  static defaultProps = {
    followerCount: 0,
    followingCount: 0,
    postCount: 0,
  };

  render() {
    const { followerCount, followingCount, postCount } = this.props;
    return (
      <Container>
        <View>
          <Value>
            {postCount}
          </Value>
          <Label>
            {'posts'}
          </Label>
        </View>
        <View>
          <Value>
            {followingCount}
          </Value>
          <Label>
            {'Following'}
          </Label>
        </View>
        <View>
          <Value>
            {followerCount}
          </Value>
          <Label>
            {'followers'}
          </Label>
        </View>
      </Container>
    );
  }
}

export default UserStats;
