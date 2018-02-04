import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { connect } from 'react-redux';
import { getAuthUsername } from 'state/rootReducer';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import Header from 'components/common/Header';
import { ICON_SIZES, COLORS, MATERIAL_ICONS } from 'constants/styles';
import * as navigationConstants from 'constants/navigation';
import CurrentUserFeed from './CurrentUserFeed';

const Container = styled.View`
  flex: 1;
`;

const Touchable = styled.TouchableOpacity``;

const BackTouchable = styled.TouchableOpacity`
  justify-content: center;
  padding: 10px;
`;

const mapStateToProps = state => ({
  username: getAuthUsername(state),
});

@connect(mapStateToProps)
class CurrentUserScreen extends Component {
  static propTypes = {
    navigation: PropTypes.shape().isRequired,
  };

  constructor(props) {
    super(props);
    this.handleNavigateToSavedTags = this.handleNavigateToSavedTags.bind(this);
  }

  handleNavigateToSavedTags() {
    this.props.navigation.navigate(navigationConstants.SAVED_TAGS);
  }

  render() {
    const { navigation } = this.props;
    return (
      <Container>
        <Header style={{ justifyContent: 'flex-end' }}>
          <Touchable onPress={this.handleNavigateToSavedTags}>
            <MaterialCommunityIcons
              name="star"
              size={ICON_SIZES.menuIcon}
              style={{ padding: 5 }}
              color={COLORS.PRIMARY_COLOR}
            />
          </Touchable>
        </Header>
        <CurrentUserFeed navigation={navigation} />
      </Container>
    );
  }
}

export default CurrentUserScreen;
