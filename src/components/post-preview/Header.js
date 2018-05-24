import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { View, TouchableWithoutFeedback } from 'react-native';
import { getReputation } from 'util/steemitFormatters';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import _ from 'lodash';
import APPS from 'constants/apps';
import { MATERIAL_COMMUNITY_ICONS, ICON_SIZES } from 'constants/styles';
import Tag from 'components/post/Tag';
import * as navigationConstants from 'constants/navigation';
import ReputationScore from 'components/post/ReputationScore';
import Avatar from 'components/common/Avatar';
import { getCustomTheme, getIntl } from 'state/rootReducer';
import { connect } from 'react-redux';
import TimeAgo from 'components/common/TimeAgo';

const Container = styled.View`
  padding: 16px 5px;
  padding-bottom: 0;
`;

const UserHeaderContainer = styled.View`
  flex-direction: row;
`;

const Author = styled.View`
  flex-direction: row;
`;
const AuthorText = styled.Text`
  font-weight: 700;
  font-size: 18px;
  color: ${props => props.customTheme.primaryColor};
`;
const HeaderContents = styled.View`
  margin: 0 12px;
`;

const RebloggedUsername = styled.Text`
  color: ${props => props.customTheme.primaryColor};
`;
const RebloggedText = styled.Text`
  color: ${props => props.customTheme.tertiaryColor};
`;

const Reblogged = styled.View`
  flex-direction: row;
  padding: 10px 0;
`;

const Touchable = styled.TouchableOpacity``;

const TagContainer = styled.View`
  padding: 5px 0;
  flex-direction: row;
  align-items: center;
`;

const PostedFrom = styled.Text`
  color: ${props => props.customTheme.tertiaryColor};
  font-size: 12px;
`;

const Seperator = styled.Text`
  color: ${props => props.customTheme.tertiaryColor};
  margin-left: 5px;
  margin-right: 5px;
`;

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
  intl: getIntl(state),
});

class Header extends Component {
  static propTypes = {
    navigation: PropTypes.shape().isRequired,
    postData: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    customTheme: PropTypes.shape().isRequired,
    currentUsername: PropTypes.string,
    displayMenu: PropTypes.func,
    hideMenuButton: PropTypes.bool,
  };

  static defaultProps = {
    hideMenuButton: false,
    currentUsername: '',
    displayMenu: () => {},
  };

  constructor(props) {
    super(props);

    this.handleUserNavigation = this.handleUserNavigation.bind(this);
    this.handleFeedNavigation = this.handleFeedNavigation.bind(this);
    this.handleReblogUserNavigation = this.handleReblogUserNavigation.bind(this);
    this.handleNavigateToBeneficiaries = this.handleNavigateToBeneficiaries.bind(this);
  }

  handleUserNavigation() {
    const { navigation, postData } = this.props;
    const { author } = postData;
    navigation.navigate(navigationConstants.USER, { username: author });
  }

  handleReblogUserNavigation() {
    const { navigation, postData } = this.props;
    const { first_reblogged_by } = postData;
    navigation.navigate(navigationConstants.USER, { username: first_reblogged_by });
  }

  handleFeedNavigation() {
    const { navigation, postData } = this.props;
    const { category } = postData;

    navigation.navigate(navigationConstants.FEED, { tag: category });
  }

  handleNavigateToBeneficiaries() {
    const { postData, navigation } = this.props;
    const beneficiaries = _.get(postData, 'beneficiaries', []);
    if (!_.isEmpty(beneficiaries)) {
      navigation.navigate(navigationConstants.POST_BENEFICIARIES, { postData });
    }
  }

  renderReblogged() {
    const { postData, customTheme, intl } = this.props;
    const firstRebloggedBy = _.get(postData, 'first_reblogged_by');
    const firstRebloggedOn = _.get(postData, 'first_reblogged_on');

    if (firstRebloggedBy) {
      return (
        <Reblogged>
          <MaterialCommunityIcons
            name={MATERIAL_COMMUNITY_ICONS.reblog}
            size={ICON_SIZES.contentTitleBlockIcon}
            color={customTheme.tertiaryColor}
            style={{ marginRight: 5 }}
          />
          <Touchable onPress={this.handleReblogUserNavigation}>
            <RebloggedUsername customTheme={customTheme}>
              {postData.first_reblogged_by}
            </RebloggedUsername>
          </Touchable>
          <RebloggedText customTheme={customTheme}>{` ${intl.reblogged}`}</RebloggedText>
        </Reblogged>
      );
    } else if (firstRebloggedOn) {
      return (
        <Reblogged>
          <MaterialCommunityIcons
            name={MATERIAL_COMMUNITY_ICONS.reblog}
            size={ICON_SIZES.contentTitleBlockIcon}
            color={customTheme.tertiaryColor}
            style={{ marginRight: 5 }}
          />
          <RebloggedText customTheme={customTheme}>{intl.reblogged}</RebloggedText>
        </Reblogged>
      );
    }
    return null;
  }

  renderAuthor() {
    const { currentUsername, postData, customTheme } = this.props;
    const { author } = postData;
    if (currentUsername === author) {
      return <AuthorText customTheme={customTheme}>{author}</AuthorText>;
    }
    return (
      <Touchable onPress={this.handleUserNavigation}>
        <AuthorText customTheme={customTheme}>{author}</AuthorText>
      </Touchable>
    );
  }

  renderPostedFrom() {
    try {
      const { postData, customTheme } = this.props;
      const jsonMetadata = _.attempt(JSON.parse, postData.json_metadata);
      const app = _.isError(jsonMetadata) ? [] : _.split(jsonMetadata.app, '/');
      const from = _.get(APPS, _.get(app, 0, ''), '');
      const beneficiaries = _.get(postData, 'beneficiaries', []);
      const hasBeneficiaries = !_.isEmpty(beneficiaries);

      if (_.isEmpty(from)) {
        return <View />;
      }

      return (
        <TouchableWithoutFeedback onPress={this.handleNavigateToBeneficiaries}>
          <PostedFrom customTheme={customTheme} hasBeneficiaries={hasBeneficiaries}>
            {from}
          </PostedFrom>
        </TouchableWithoutFeedback>
      );
    } catch (e) {
      return <View />;
    }
  }

  render() {
    const { postData, displayMenu, hideMenuButton, customTheme } = this.props;
    const { category, author, author_reputation, created } = postData;

    return (
      <Container>
        {this.renderReblogged()}
        <UserHeaderContainer>
          <Avatar username={author} size={40} />
          <HeaderContents>
            <View>
              <Author>
                {this.renderAuthor()}
                <ReputationScore reputation={getReputation(author_reputation)} />
              </Author>
              <Author>
                <TimeAgo created={created} style={{ fontSize: 12 }} />
                <Seperator customTheme={customTheme}>•</Seperator>
                {this.renderPostedFrom()}
              </Author>
            </View>
          </HeaderContents>
          {!hideMenuButton && (
            <Touchable
              onPress={displayMenu}
              style={{ marginLeft: 'auto', paddingLeft: 10, paddingRight: 10, paddingBottom: 10 }}
            >
              <MaterialCommunityIcons
                name={MATERIAL_COMMUNITY_ICONS.menuHorizontal}
                size={ICON_SIZES.menuIcon}
                color={customTheme.primaryColor}
              />
            </Touchable>
          )}
        </UserHeaderContainer>
        <TagContainer>
          <Touchable onPress={this.handleFeedNavigation}>
            <Tag tag={category} />
          </Touchable>
        </TagContainer>
      </Container>
    );
  }
}

export default connect(mapStateToProps)(Header);
