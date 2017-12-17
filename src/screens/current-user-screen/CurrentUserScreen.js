import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { connect } from 'react-redux';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, MATERIAL_COMMUNITY_ICONS } from 'constants/styles';
import { getAuthUsername } from 'state/rootReducer';
import CurrentUserFeed from './CurrentUserFeed';

const Container = styled.View`
  flex: 1;
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex-wrap: nowrap;
  padding-top: 20px;
`;

const Touchable = styled.TouchableOpacity`
`;

const Menu = styled.View`
  justify-content: center;
  padding: 10px;
`;

const Username = styled.Text`
  color: ${COLORS.BLUE.MARINER};
  font-weight: bold;
  padding-left: 10px;
`;

const mapStateToProps = state => ({
  username: getAuthUsername(state),
});

@connect(mapStateToProps)
class CurrentUserScreen extends Component {
  static propTypes = {
    navigation: PropTypes.shape().isRequired,
    username: PropTypes.string.isRequired,
  };

  render() {
    const { navigation, username } = this.props;
    return (
      <Container>
        <Header>
          <Username>
            {username}
          </Username>
          <Menu>
            <Touchable onPress={() => {}}>
              <MaterialCommunityIcons size={24} name={MATERIAL_COMMUNITY_ICONS.menuVertical} />
            </Touchable>
          </Menu>
        </Header>
        <CurrentUserFeed navigation={navigation} />
      </Container>
    );
  }
}

export default CurrentUserScreen;
