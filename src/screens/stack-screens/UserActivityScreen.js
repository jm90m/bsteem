import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { ListView, RefreshControl } from 'react-native';
import _ from 'lodash';
import { connect } from 'react-redux';
import {
  getUsersAccountHistory,
  getLoadingFetchUserAccountHistory,
  getLoadingFetchMoreUserAccountHistory,
  getTotalVestingFundSteem,
  getTotalVestingShares,
  getCustomTheme,
} from 'state/rootReducer';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, ICON_SIZES, MATERIAL_COMMUNITY_ICONS } from 'constants/styles';
import {
  fetchMoreUserAccountHistory,
  fetchUserAccountHistory,
} from 'state/actions/userActivityActions';
import LargeLoading from 'components/common/LargeLoading';
import Header from 'components/common/Header';
import TitleText from 'components/common/TitleText';
import UserAction from 'components/activity/UserAction';
import BackButton from 'components/common/BackButton';

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

const Container = styled.View``;

const StyledListView = styled.ListView`
  background-color: ${props => props.customTheme.listBackgroundColor};
`;

const FilterTouchable = styled.TouchableOpacity`
  padding: 10px;
`;

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
  usersAccountHistory: getUsersAccountHistory(state),
  loadingFetchUserAccountHistory: getLoadingFetchUserAccountHistory(state),
  loadingFetchMoreUserAccountHistory: getLoadingFetchMoreUserAccountHistory(state),
  totalVestingFundSteem: getTotalVestingFundSteem(state),
  totalVestingShares: getTotalVestingShares(state),
});

const mapDispatchToProps = dispatch => ({
  fetchUserAccountHistory: username => dispatch(fetchUserAccountHistory.action({ username })),
  fetchMoreUserAccountHistory: username =>
    dispatch(fetchMoreUserAccountHistory.action({ username })),
});

@connect(mapStateToProps, mapDispatchToProps)
class UserActivityScreen extends Component {
  static navigationOptions = {
    tabBarVisible: false,
    drawerLockMode: 'locked-closed',
  };

  static propTypes = {
    customTheme: PropTypes.shape().isRequired,
    navigation: PropTypes.shape().isRequired,
    usersAccountHistory: PropTypes.shape().isRequired,
    fetchUserAccountHistory: PropTypes.func.isRequired,
    fetchMoreUserAccountHistory: PropTypes.func.isRequired,
    loadingFetchUserAccountHistory: PropTypes.bool.isRequired,
    loadingFetchMoreUserAccountHistory: PropTypes.bool.isRequired,
    totalVestingFundSteem: PropTypes.string.isRequired,
    totalVestingShares: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    this.onRefreshUserAccountHistory = this.onRefreshUserAccountHistory.bind(this);
    this.navigateBack = this.navigateBack.bind(this);
    this.renderUserActivityRow = this.renderUserActivityRow.bind(this);
    this.handleFetchMoreUserAccountHistory = this.handleFetchMoreUserAccountHistory.bind(this);
  }

  componentDidMount() {
    const { usersAccountHistory } = this.props;
    const { username } = this.props.navigation.state.params;
    const userAccountHistory = _.get(usersAccountHistory, username, []);

    if (_.isEmpty(userAccountHistory)) {
      this.props.fetchUserAccountHistory(username);
    }
  }

  onRefreshUserAccountHistory() {
    const { username } = this.props.navigation.state.params;
    this.props.fetchUserAccountHistory(username);
  }

  navigateBack() {
    this.props.navigation.goBack();
  }

  handleFetchMoreUserAccountHistory() {
    const { username } = this.props.navigation.state.params;
    this.props.fetchMoreUserAccountHistory(username);
  }

  renderUserActivityRow(rowData) {
    const { totalVestingFundSteem, totalVestingShares } = this.props;
    const { username } = this.props.navigation.state.params;
    return (
      <UserAction
        currentUsername={username}
        action={rowData}
        navigation={this.props.navigation}
        totalVestingFundSteem={totalVestingFundSteem}
        totalVestingShares={totalVestingShares}
      />
    );
  }

  render() {
    const {
      usersAccountHistory,
      loadingFetchUserAccountHistory,
      loadingFetchMoreUserAccountHistory,
      customTheme,
    } = this.props;
    const { username } = this.props.navigation.state.params;
    const userAccountHistoryDataSource = _.get(usersAccountHistory, username, []);

    return (
      <Container>
        <Header>
          <BackButton navigateBack={this.navigateBack} />
          <TitleText>{`${username} activity`}</TitleText>
          <FilterTouchable>
            <MaterialCommunityIcons
              size={ICON_SIZES.menuIcon}
              name={MATERIAL_COMMUNITY_ICONS.filter}
              color="transparent"
            />
          </FilterTouchable>
        </Header>
        <StyledListView
          customTheme={customTheme}
          dataSource={ds.cloneWithRows(userAccountHistoryDataSource)}
          renderRow={this.renderUserActivityRow}
          enableEmptySections
          onEndReached={this.handleFetchMoreUserAccountHistory}
          refreshControl={
            <RefreshControl
              refreshing={loadingFetchUserAccountHistory}
              onRefresh={this.onRefreshUserAccountHistory}
              colors={[COLORS.PRIMARY_COLOR]}
            />
          }
        />
        {loadingFetchMoreUserAccountHistory && <LargeLoading />}
      </Container>
    );
  }
}

export default UserActivityScreen;
