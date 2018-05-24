import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Dimensions } from 'react-native';
import styled from 'styled-components/native';
import _ from 'lodash';
import Avatar from 'components/common/Avatar';
import { getUserBackgroundCoverUrl } from 'util/busyImageUtils';
import { connect } from 'react-redux';
import { getCustomTheme } from 'state/rootReducer';
import { COLORS } from 'constants/styles';
import tinycolor from 'tinycolor2';
import ReputationScore from 'components/post/ReputationScore';

const { width } = Dimensions.get('screen');

const Container = styled.View`
  height: 75px;
  width: 100%;
  background-color: ${props => props.customTheme.primaryBackgroundColor};
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
  color: ${props => props.textColor}};
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
  color: ${props => props.textColor};
  font-weight: 500;
`;

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
});

class UserCover extends Component {
  static propTypes = {
    customTheme: PropTypes.shape().isRequired,
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
    this.getTextColor = this.getTextColor.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      hasCover: nextProps.hasCover,
    });
  }
  getTextColor() {
    const { hasCover } = this.state;
    const { customTheme } = this.props;

    if (hasCover) {
      return COLORS.LIGHT_TEXT_COLOR;
    }

    return tinycolor(customTheme.primaryBackgroundColor).isDark()
      ? COLORS.LIGHT_TEXT_COLOR
      : COLORS.DARK_TEXT_COLOR;
  }

  handleBackgroundCoverError() {
    this.setState({
      hasCover: false,
    });
  }

  render() {
    const { username, userReputation, userProfile, customTheme } = this.props;
    const name = _.get(userProfile, 'name', username);
    const coverImage = _.get(userProfile, 'cover_image', '');
    const displayName = _.isEmpty(_.trim(name)) ? username : name;
    const textColor = this.getTextColor();

    return (
      <Container customTheme={customTheme}>
        <BackgroundImage
          resizeMode="cover"
          source={{ uri: getUserBackgroundCoverUrl(coverImage) }}
          onError={this.handleBackgroundCoverError}
          style={{ width, height: 75 }}
        />
        <UserHeaderContents>
          <Avatar username={username} size={50} />
          <View>
            <UsernameContainer>
              <UsernameText textColor={textColor}>{displayName}</UsernameText>
              <ReputationScore reputation={userReputation} />
            </UsernameContainer>
            <HandleContainer>
              <Handle textColor={textColor}>{`@${username}`}</Handle>
            </HandleContainer>
          </View>
        </UserHeaderContents>
      </Container>
    );
  }
}

export default connect(mapStateToProps)(UserCover);
