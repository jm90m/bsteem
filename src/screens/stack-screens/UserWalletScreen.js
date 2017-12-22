import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { ListView } from 'react-native';
import _ from 'lodash';
import { connect } from 'react-redux';
import { getUsersTransactions } from 'state/rootReducer';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, MATERIAL_ICONS, MATERIAL_COMMUNITY_ICONS } from 'constants/styles';
import {
  fetchMoreUserAccountHistory,
  fetchUserAccountHistory,
} from 'state/actions/userActivityActions';
import HeaderContainer from 'components/common/HeaderContainer';
import UserAction from 'components/activity/UserAction';

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

const Container = styled.View``;

const StyledListView = styled.ListView``;

const ActivityContainer = styled.View`
  padding: 5px;
  border-bottom-width: 1px ;
  border-top-width: 1px;
`;

const BackTouchable = styled.TouchableOpacity`
  justify-content: center;
  padding: 10px;
`;

const TitleText = styled.Text`
  font-weight: bold;
  color: ${COLORS.BLUE.MARINER}
`;

const ActivityText = styled.Text``;

const FilterTouchable = styled.TouchableOpacity`
  padding: 10px;
`;

const mapStateToProps = state => ({
  usersTransactions: getUsersTransactions(state),
});

const mapDispatchToProps = dispatch => ({
  fetchUserAccountHistory: username => dispatch(fetchUserAccountHistory.action({ username })),
  fetchMoreUserAccountHistory: username =>
    dispatch(fetchMoreUserAccountHistory.action({ username })),
});

@connect(mapStateToProps, mapDispatchToProps)
class UserWalletScreen extends Component {
  static propTypes = {
    navigation: PropTypes.shape().isRequired,
    usersTransactions: PropTypes.shape().isRequired,
    fetchUserAccountHistory: PropTypes.func.isRequired,
    fetchMoreUserAccountHistory: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.renderUserWalletRow = this.renderUserWalletRow.bind(this);
    this.navigateBack = this.navigateBack.bind(this);
  }

  componentDidMount() {
    const { usersTransactions } = this.props;
    const { username } = this.props.navigation.state.params;
    const userAccountHistory = _.get(usersTransactions, username, []);

    if (_.isEmpty(userAccountHistory)) {
      this.props.fetchUserAccountHistory(username);
    }
  }

  navigateBack() {
    this.props.navigation.goBack();
  }

  renderUserWalletRow(rowData) {
    const { username } = this.props.navigation.state.params;
    return (
      <UserAction currentUsername={username} action={rowData} navigation={this.props.navigation} />
    );
  }

  render() {
    const { usersTransactions } = this.props;
    const { username } = this.props.navigation.state.params;
    const userTransactionsDataSource = _.get(usersTransactions, username, []);

    return (
      <Container>
        <HeaderContainer>
          <BackTouchable onPress={this.navigateBack}>
            <MaterialIcons size={24} name={MATERIAL_ICONS.back} />
          </BackTouchable>
          <TitleText>{`${username} wallet`}</TitleText>
          <FilterTouchable>
            <MaterialCommunityIcons
              size={24}
              name={MATERIAL_COMMUNITY_ICONS.filter}
              color={COLORS.BLUE.MARINER}
            />
          </FilterTouchable>
        </HeaderContainer>
        <StyledListView
          dataSource={ds.cloneWithRows(userTransactionsDataSource)}
          renderRow={this.renderUserWalletRow}
          enableEmptySections
          onEndReached={this.props.fetchMoreUserAccountHistory}
        />
      </Container>
    );
  }
}

export default UserWalletScreen;
