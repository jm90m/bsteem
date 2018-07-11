import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { getReputation } from 'util/steemitFormatters';
import styled from 'styled-components/native';
import Avatar from 'components/common/Avatar';
import { COLORS } from 'constants/styles';
import USDValue from 'components/common/USDValue';
import TimeAgo from 'components/common/TimeAgo';
import ReputationScore from 'components/post/ReputationScore';
import { connect } from 'react-redux';
import { getCustomTheme } from 'state/rootReducer';
import tinycolor from 'tinycolor2';
import PrimaryText from 'components/common/text/PrimaryText';
import FollowButton from '../common/FollowButton';

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 5px 10px;
  background: ${props => props.customTheme.primaryBackgroundColor};
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.customTheme.primaryBorderColor};
`;

const Username = styled(PrimaryText)`
  color: ${props => props.customTheme.primaryColor};
`;

const UserTouchable = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

const InlineContainer = styled.View`
  flex-direction: row;
`;

const FollowButtonContainer = styled.View`
  margin-left: auto;
`;

const VotePercent = styled(PrimaryText)`
  margin: 0 5px;
  font-size: 12px;
  color: ${props =>
    tinycolor(props.customTheme.primaryBackgroundColor).isDark()
      ? COLORS.LIGHT_TEXT_COLOR
      : COLORS.DARK_TEXT_COLOR};
`;

const UsernameContainer = styled.View`
  margin: 0 5px;
`;

class Voter extends React.PureComponent {
  static propTypes = {
    customTheme: PropTypes.shape().isRequired,
    voter: PropTypes.string,
    voteValue: PropTypes.number,
    handleNavigateToUser: PropTypes.func,
    votePercent: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    time: PropTypes.string,
    reputation: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  };
  static defaultProps = {
    voter: '',
    time: '',
    voteValue: 0,
    votePercent: 0,
    reputation: '',
    handleNavigateToUser: () => {},
  };

  render() {
    const {
      voter,
      voteValue,
      votePercent,
      handleNavigateToUser,
      time,
      reputation,
      customTheme,
    } = this.props;
    const formattedReputation = getReputation(reputation);
    const usdValueStyles = { marginLeft: 5 };

    return (
      <Container customTheme={customTheme}>
        <UserTouchable onPress={handleNavigateToUser}>
          <Avatar username={voter} />
          <UsernameContainer>
            <InlineContainer>
              <Username customTheme={customTheme}>{voter}</Username>
              <ReputationScore reputation={formattedReputation} />
              <USDValue value={voteValue} style={usdValueStyles} />
              <VotePercent customTheme={customTheme}>{votePercent}%</VotePercent>
            </InlineContainer>
            {!_.isEmpty(time) && <TimeAgo created={time} />}
          </UsernameContainer>
        </UserTouchable>
        <FollowButtonContainer>
          <FollowButton username={voter} useIcon />
        </FollowButtonContainer>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
});

export default connect(mapStateToProps)(Voter);
