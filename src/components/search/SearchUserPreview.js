import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { COLORS } from 'constants/styles';
import Avatar from 'components/common/Avatar';

const Container = styled.View`
  padding: 5px 10px;
  margin: 5px 0;
  background-color: ${COLORS.WHITE.WHITE};
`;

const Username = styled.Text`
  margin: 0 5px;
  color: ${COLORS.BLUE.MARINER};
  font-size: 18px;
`;

const TouchableOpacity = styled.TouchableOpacity`
  flex-direction: row;
  padding: 0 16px;
  align-items: center;
`;

class SearchUserPreview extends Component {
  static propTypes = {
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
    const { username, handleNavigateToUserScreen } = this.props;

    handleNavigateToUserScreen(username);
  }

  render() {
    const { username } = this.props;

    return (
      <Container>
        <TouchableOpacity onPress={this.handleNavigateToUserScreen}>
          <Avatar username={username} />
          <Username>{`@${username}`}</Username>
        </TouchableOpacity>
      </Container>
    );
  }
}

export default SearchUserPreview;
