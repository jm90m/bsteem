import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { connect } from 'react-redux';
import { getAuthUsername } from 'state/rootReducer';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Header from 'components/common/Header';
import { ICON_SIZES, COLORS, MATERIAL_COMMUNITY_ICONS } from 'constants/styles';
import { displayPriceModal } from 'state/actions/appActions';
import * as navigationConstants from 'constants/navigation';
import CurrentUserFeed from './CurrentUserFeed';

const Container = styled.View`
  flex: 1;
`;

const Touchable = styled.TouchableOpacity``;

const HeaderText = styled.Text`
  color: ${COLORS.PRIMARY_COLOR};
  align-self: center;
  font-weight: bold;
`;

const mapStateToProps = state => ({
  username: getAuthUsername(state),
});

const mapDispatchToProps = dispatch => ({
  displayPriceModal: symbols => dispatch(displayPriceModal(symbols)),
});

class CurrentUserScreen extends Component {
  static propTypes = {
    navigation: PropTypes.shape().isRequired,
    displayPriceModal: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.handleNavigateToSavedTags = this.handleNavigateToSavedTags.bind(this);
    this.handleDisplayPriceModal = this.handleDisplayPriceModal.bind(this);
  }

  handleDisplayPriceModal() {
    this.props.displayPriceModal(['STEEM', 'SBD']);
  }

  handleNavigateToSavedTags() {
    this.props.navigation.navigate(navigationConstants.SAVED_CONTENT);
  }

  render() {
    const { navigation } = this.props;
    return (
      <Container>
        <Header>
          <Touchable onPress={this.handleDisplayPriceModal}>
            <MaterialCommunityIcons
              name={MATERIAL_COMMUNITY_ICONS.lineChart}
              size={ICON_SIZES.menuIcon}
              color={COLORS.PRIMARY_COLOR}
              style={{ padding: 5 }}
            />
          </Touchable>
          <HeaderText>bSteem</HeaderText>
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

export default connect(mapStateToProps, mapDispatchToProps)(CurrentUserScreen);
