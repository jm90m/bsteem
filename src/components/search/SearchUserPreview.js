import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import PropTypes from 'prop-types';
import Avatar from 'components/common/Avatar';
import { getCustomTheme } from 'state/rootReducer';
import Touchable from 'components/common/Touchable';
import commonStyles from 'styles/common';
import { connect } from 'react-redux';
import { FONTS } from '../../constants/styles';

const styles = StyleSheet.create({
  userPreviewContainer: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
  },
  username: {
    fontSize: 18,
    fontFamily: FONTS.PRIMARY,
    marginLeft: 5,
  },
});

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
});

class SearchUserPreview extends Component {
  static navigationOptions = {
    headerMode: 'none',
    tabBarVisible: false,
  };

  static propTypes = {
    customTheme: PropTypes.shape().isRequired,
    username: PropTypes.string,
    handleNavigateToUserScreen: PropTypes.func,
    isFirstElement: PropTypes.bool,
  };

  static defaultProps = {
    username: '',
    handleNavigateToUserScreen: () => {},
    isFirstElement: false,
  };

  constructor(props) {
    super(props);
    this.handleNavigateToUserScreen = this.handleNavigateToUserScreen.bind(this);
  }

  handleNavigateToUserScreen() {
    const { username } = this.props;
    this.props.handleNavigateToUserScreen(username);
  }

  render() {
    const { username, customTheme, isFirstElement } = this.props;
    const userPreviewContainerStyles = [
      styles.userPreviewContainer,
      {
        backgroundColor: customTheme.primaryBackgroundColor,
        borderColor: customTheme.primaryBorderColor,
        borderTopWidth: isFirstElement ? 1 : 0,
      },
    ];
    const usernameStyles = [
      styles.username,
      {
        color: customTheme.primaryColor,
      },
    ];

    return (
      <View style={userPreviewContainerStyles}>
        <Touchable onPress={this.handleNavigateToUserScreen}>
          <View style={commonStyles.rowAlignedCenterContainer}>
            <Avatar username={username} size={40} />
            <Text style={usernameStyles}>{username}</Text>
          </View>
        </Touchable>
      </View>
    );
  }
}

export default connect(mapStateToProps)(SearchUserPreview);
