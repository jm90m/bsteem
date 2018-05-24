import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import Avatar from 'components/common/Avatar';
import { getCustomTheme } from 'state/rootReducer';
import { connect } from 'react-redux';

const Container = styled.View`
  padding: 5px 10px;
  margin: 5px 0;
  background-color: ${props => props.customTheme.primaryBackgroundColor};
`;

const Username = styled.Text`
  margin: 0 5px;
  color: ${props => props.customTheme.primaryColor};
  font-size: 18px;
  font-weight: bold;
`;

const TouchableOpacity = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

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
  };

  static defaultProps = {
    username: '',
    handleNavigateToUserScreen: () => {},
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
    const { username, customTheme } = this.props;

    return (
      <Container customTheme={customTheme}>
        <TouchableOpacity onPress={this.handleNavigateToUserScreen}>
          <Avatar username={username} size={40} />
          <Username customTheme={customTheme}>{`@${username}`}</Username>
        </TouchableOpacity>
      </Container>
    );
  }
}

export default connect(mapStateToProps)(SearchUserPreview);
