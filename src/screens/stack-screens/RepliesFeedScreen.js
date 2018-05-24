import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { RefreshControl } from 'react-native';
import styled from 'styled-components/native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import API from 'api/api';
import { ICON_SIZES, MATERIAL_COMMUNITY_ICONS, MATERIAL_ICONS } from 'constants/styles';
import TitleText from 'components/common/TitleText';
import Header from 'components/common/Header';
import { connect } from 'react-redux';
import { getCurrentUserFollowList, getCustomTheme, getIntl } from 'state/rootReducer';
import StyledFlatList from 'components/common/StyledFlatList';
import StyledViewPrimaryBackground from 'components/common/StyledViewPrimaryBackground';
import StyledTextByBackground from 'components/common/StyledTextByBackground';
import LargeLoading from 'components/common/LargeLoading';
import BackButton from 'components/common/BackButton';
import CommentsPreview from 'components/user/user-comments/CommentsPreview';

const Container = styled.View`
  flex: 1;
`;

const EmptyFeedView = styled(StyledViewPrimaryBackground)`
  padding: 20px;
`;

const EmptyFeedText = styled(StyledTextByBackground)`
  font-size: 18px;
`;

const MenuIconContainer = styled.View`
  padding: 5px;
`;

const TitleContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
  currentUserFollowList: getCurrentUserFollowList(state),
  intl: getIntl(state),
});

class RepliesFeedScreen extends Component {
  static navigationOptions = {
    headerMode: 'none',
    tabBarVisible: false,
    drawerLockMode: 'locked-closed',
  };

  static propTypes = {
    customTheme: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    navigation: PropTypes.shape().isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      posts: [],
    };

    this.fetchInitialReplies = this.fetchInitialReplies.bind(this);
    this.navigateBack = this.navigateBack.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.renderLoadingOrEmptyText = this.renderLoadingOrEmptyText.bind(this);
  }

  componentDidMount() {
    try {
      this.fetchInitialReplies();
    } catch (error) {
      console.log(error);
      this.setState({
        loading: false,
      });
    }
  }

  fetchInitialReplies() {
    const { username } = this.props.navigation.state.params;
    API.getReplies(username).then(response => {
      if (response.result) {
        this.setState({
          loading: false,
          posts: Object.values(response.result.content).sort((a, b) => b.id - a.id),
        });
      }
    });
  }

  navigateBack() {
    this.props.navigation.goBack();
  }

  renderRow(rowData) {
    const { username } = this.props.navigation.state.params;
    return (
      <CommentsPreview
        commentData={rowData.item}
        navigation={this.props.navigation}
        currentUsername={username}
      />
    );
  }

  renderLoadingOrEmptyText() {
    const { posts, loading } = this.state;
    const { intl } = this.props;
    if (loading) {
      return <LargeLoading style={{ paddingTop: 10, paddingBottom: 10 }} />;
    } else if (_.isEmpty(posts)) {
      return (
        <EmptyFeedView>
          <EmptyFeedText>{intl.feed_empty}</EmptyFeedText>
        </EmptyFeedView>
      );
    }
    return null;
  }

  render() {
    const { customTheme, intl } = this.props;
    const { posts, loading } = this.state;
    const displayListView = _.size(posts) > 0;

    return (
      <Container>
        <Header>
          <BackButton navigateBack={this.navigateBack} />
          <TitleContainer>
            <MaterialIcons
              size={ICON_SIZES.menuIcon}
              name={MATERIAL_ICONS.replyAll}
              color={customTheme.primaryColor}
            />
            <TitleText style={{ marginLeft: 3 }}>{intl.replies}</TitleText>
          </TitleContainer>
          <MenuIconContainer>
            <MaterialCommunityIcons
              size={ICON_SIZES.menuIcon}
              name={MATERIAL_COMMUNITY_ICONS.menuVertical}
              color="transparent"
            />
          </MenuIconContainer>
        </Header>
        {this.renderLoadingOrEmptyText()}
        {displayListView && (
          <StyledFlatList
            data={posts}
            renderItem={this.renderRow}
            enableEmptySections
            initialNumToRender={4}
            keyExtractor={(item, index) => `${_.get(item, 'item.id', '')}${index}`}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={this.fetchInitialReplies}
                tintColor={customTheme.primaryColor}
                colors={[customTheme.primaryColor]}
              />
            }
          />
        )}
      </Container>
    );
  }
}

export default connect(mapStateToProps)(RepliesFeedScreen);
