import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import _ from 'lodash';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import Header from 'components/common/Header';
import BackButton from 'components/common/BackButton';
import * as navigationConstants from 'constants/navigation';
import { MATERIAL_COMMUNITY_ICONS, ICON_SIZES, MATERIAL_ICONS } from 'constants/styles';
import { getCustomTheme, getIntl } from 'state/rootReducer';
import StyledViewPrimaryBackground from 'components/common/StyledViewPrimaryBackground';
import StyledTextByBackground from 'components/common/StyledTextByBackground';
import TitleText from 'components/common/TitleText';
import Avatar from 'components/common/Avatar';

const Container = styled(StyledViewPrimaryBackground)`
  flex: 1;
`;

const RightMenuIconContainer = styled.View`
  padding: 5px;
  flex-direction: row;
`;

const StyledScrollView = styled.ScrollView``;

const TitleContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const DescriptionText = styled(StyledTextByBackground)``;

const ValueContainer = styled.View`
  padding: 10px;
  border-bottom-color: ${props => props.customTheme.primaryBorderColor};
  border-bottom-width: 1px;
`;

const UserContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: ${props => props.customTheme.primaryBackgroundColor};
  border-bottom-color: ${props => props.customTheme.primaryBorderColor};
  border-bottom-width: 1px;
`;

const UserText = styled(StyledTextByBackground)`
  margin-left: 5px;
`;

const UserTouchable = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
  intl: getIntl(state),
});

const getBeneficiaries = user => {
  try {
    const weight = parseFloat(_.get(user, 'weight', 0)) / 10000;
    return `${parseFloat(weight * 100).toFixed(2)}%`;
  } catch (error) {
    return '0%';
  }
};

class BeneficiariesScreen extends Component {
  static navigationOptions = {
    tabBarVisible: false,
    drawerLockMode: 'locked-closed',
  };

  static propTypes = {
    navigation: PropTypes.shape().isRequired,
    customTheme: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
  };

  constructor(props) {
    super(props);

    this.navigateBack = this.navigateBack.bind(this);
    this.renderBeneficiaries = this.renderBeneficiaries.bind(this);
  }

  navigateBack() {
    this.props.navigation.goBack();
  }

  handleNavigateToUser = username => () => {
    this.props.navigation.push(navigationConstants.USER, { username });
  };

  renderBeneficiaries() {
    const { customTheme } = this.props;
    const { beneficiaries } = this.props.navigation.state.params;

    return _.map(beneficiaries, (user, i) => (
      <UserContainer key={`${user.account}${i}`} customTheme={customTheme}>
        <UserTouchable onPress={this.handleNavigateToUser(user.account)}>
          <Avatar username={user.account} />
          <UserText>{`${user.account} - `}</UserText>
          <TitleText>{getBeneficiaries(user)}</TitleText>
        </UserTouchable>
      </UserContainer>
    ));
  }

  render() {
    const { customTheme, intl } = this.props;

    return (
      <Container>
        <Header>
          <BackButton navigateBack={this.navigateBack} />
          <TitleContainer>
            <MaterialIcons
              size={ICON_SIZES.menuIcon}
              name={MATERIAL_ICONS.moneyOff}
              color={customTheme.primaryColor}
            />
            <TitleText style={{ marginLeft: 3 }}>{intl.beneficiaries}</TitleText>
          </TitleContainer>
          <RightMenuIconContainer>
            <MaterialCommunityIcons
              name={MATERIAL_COMMUNITY_ICONS.menuVertical}
              size={ICON_SIZES.menuIcon}
              color="transparent"
            />
          </RightMenuIconContainer>
        </Header>
        <StyledScrollView>
          <ValueContainer customTheme={customTheme}>
            <DescriptionText>{intl.beneficiaries_description}</DescriptionText>
          </ValueContainer>
          {this.renderBeneficiaries()}
        </StyledScrollView>
      </Container>
    );
  }
}

export default connect(mapStateToProps)(BeneficiariesScreen);
