import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { COLORS } from 'constants/styles';
import { abbreviateLargeNumber } from 'util/numberFormatter';
import PrimaryText from 'components/common/text/PrimaryText';
import tinycolor from 'tinycolor2';

const Container = styled.View`
  flex-direction: row;
  justify-content: space-between;
  background: ${props => props.customTheme.primaryBackgroundColor};
  padding: 5px 16px;
`;

const ValueLabelContainer = styled.View`
  align-items: center;
`;

const Value = styled(PrimaryText)`
  color: ${props =>
    tinycolor(props.customTheme.primaryBackgroundColor).isDark()
      ? COLORS.LIGHT_TEXT_COLOR
      : COLORS.DARK_TEXT_COLOR};
`;

const Label = styled(PrimaryText)`
  font-size: 12px;
  color: ${props =>
    tinycolor(props.customTheme.primaryBackgroundColor).isDark()
      ? COLORS.LIGHT_TEXT_COLOR
      : COLORS.DARK_TEXT_COLOR};
`;

const TouchableOpacity = styled.TouchableOpacity`
  align-items: center;
`;

class UserStats extends Component {
  static propTypes = {
    followerCount: PropTypes.number,
    followingCount: PropTypes.number,
    postCount: PropTypes.number,
    onPressFollowers: PropTypes.func,
    onPressFollowing: PropTypes.func,
    customTheme: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
  };

  static defaultProps = {
    followerCount: 0,
    followingCount: 0,
    postCount: 0,
    onPressFollowers: () => {},
    onPressFollowing: () => {},
  };

  render() {
    const {
      followerCount,
      followingCount,
      postCount,
      onPressFollowers,
      onPressFollowing,
      customTheme,
      intl,
    } = this.props;
    return (
      <Container customTheme={customTheme}>
        <ValueLabelContainer>
          <Value customTheme={customTheme}>{abbreviateLargeNumber(postCount)}</Value>
          <Label customTheme={customTheme}>{intl.posts}</Label>
        </ValueLabelContainer>
        <TouchableOpacity onPress={onPressFollowers}>
          <Value customTheme={customTheme}>{abbreviateLargeNumber(followerCount)}</Value>
          <Label customTheme={customTheme}>{intl.followers}</Label>
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressFollowing}>
          <Value customTheme={customTheme}>{abbreviateLargeNumber(followingCount)}</Value>
          <Label customTheme={customTheme}>{intl.following}</Label>
        </TouchableOpacity>
      </Container>
    );
  }
}

export default UserStats;
