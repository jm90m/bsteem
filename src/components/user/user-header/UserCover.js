import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Dimensions, Image, StyleSheet, Text } from 'react-native';
import _ from 'lodash';
import Avatar from 'components/common/Avatar';
import { getUserBackgroundCoverUrl } from 'util/busyImageUtils';
import { connect } from 'react-redux';
import { getCustomTheme } from 'state/rootReducer';
import { COLORS, FONTS } from 'constants/styles';
import tinycolor from 'tinycolor2';
import ReputationScore from 'components/post/ReputationScore';

const { width: deviceWidth } = Dimensions.get('screen');

const styles = StyleSheet.create({
  container: {
    height: 150,
    width: '100%',
  },
  userHeaderContents: {
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    flexWrap: 'wrap',
    paddingTop: 10,
    paddingBottom: 5,
    height: '100%',
  },
  backgroundImage: {
    flex: 1,
    position: 'absolute',
    width: deviceWidth,
    height: 75,
  },
  usernameText: {
    fontSize: 20,
    backgroundColor: 'transparent',
    marginRight: 5,
    fontFamily: FONTS.PRIMARY,
  },
  usernameContainer: {
    marginLeft: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  handleContainer: {
    marginLeft: 5,
  },
  handle: {
    fontSize: 14,
    backgroundColor: 'transparent',
    fontFamily: FONTS.PRIMARY,
  },
  avatarContainer: {
    marginTop: 30,
  },
});

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
});

class UserCover extends Component {
  static propTypes = {
    customTheme: PropTypes.shape().isRequired,
    username: PropTypes.string,
    userReputation: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    userProfile: PropTypes.shape(),
  };

  static defaultProps = {
    username: '',
    userReputation: '0',
    userProfile: {},
  };

  constructor(props) {
    super(props);

    this.getTextColor = this.getTextColor.bind(this);
  }

  getTextColor() {
    const { customTheme } = this.props;

    return tinycolor(customTheme.primaryBackgroundColor).isDark()
      ? COLORS.LIGHT_TEXT_COLOR
      : COLORS.DARK_TEXT_COLOR;
  }

  render() {
    const { username, userReputation, userProfile, customTheme } = this.props;
    const name = _.get(userProfile, 'name', username);
    const coverImage = _.get(userProfile, 'cover_image', '');
    const displayName = _.isEmpty(_.trim(name)) ? username : name;
    const textColor = this.getTextColor();
    const containerStyles = [
      styles.container,
      {
        backgroundColor: customTheme.primaryBackgroundColor,
      },
    ];
    const usernameTextStyles = [
      styles.usernameText,
      {
        color: textColor,
      },
    ];
    const handleStyles = [
      styles.handle,
      {
        color: textColor,
      },
    ];

    return (
      <View style={containerStyles}>
        <Image
          resizeMode="cover"
          source={{ uri: getUserBackgroundCoverUrl(coverImage) }}
          onError={this.handleBackgroundCoverError}
          style={styles.backgroundImage}
        />
        <View style={styles.userHeaderContents}>
          <View style={styles.avatarContainer}>
            <Avatar username={username} size={60} />
          </View>
          <View>
            <View style={styles.usernameContainer}>
              <Text style={usernameTextStyles}>{displayName}</Text>
              <ReputationScore reputation={userReputation} />
            </View>
            <View style={styles.handleContainer}>
              <Text style={handleStyles}>{`@${username}`}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default connect(mapStateToProps)(UserCover);
