import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { connect } from 'react-redux';
import BSteemModal from 'components/common/BSteemModal';
import FeedSort from 'components/feed-sort/FeedSort';
import _ from 'lodash';
import { EvilIcons } from '@expo/vector-icons';
import { TRENDING } from 'constants/feedFilters';
import StyledViewPrimaryBackground from 'components/common/StyledViewPrimaryBackground';
import { OCTICONS_ICONS } from 'constants/styles';
import StyledTextByBackground from 'components/common/StyledTextByBackground';
import { getIntl, getSavedTags, getCustomTheme } from 'state/rootReducer';

const Container = styled.View``;

const HeaderContainer = styled(StyledViewPrimaryBackground)`
  flex-direction: row;
  justify-content: space-between;
  padding: 20px 15px;
`;

const TouchableMenu = styled.TouchableOpacity`
  flex-direction: row;
`;

const ScrollView = styled.ScrollView`
  background-color: ${props => props.customTheme.primaryBackgroundColor};
  border-top-width: 1px;
  border-top-color: ${props => props.customTheme.primaryBorderColor};
`;

const HeaderText = styled(StyledTextByBackground)`
  font-size: 20px;
`;

const TagText = styled(StyledTextByBackground)`
  padding: 10px;
  font-size: 14px;
  font-weight: ${props => (props.selected ? 'bold' : '400')};
`;

const mapStateToProps = state => ({
  intl: getIntl(state),
  savedTags: getSavedTags(state),
  customTheme: getCustomTheme(state),
});

class FeedHeader extends Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    savedTags: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      menuVisible: false,
      currentFilter: TRENDING,
    };

    this.handleSortPost = this.handleSortPost.bind(this);
  }

  handleSortPost(filter) {
    this.setState(
      {
        currentFilter: filter,
        menuVisible: false,
      },
      () => this.props.fetchDiscussions(filter),
    );
  }

  handleSetMenuVisible = menuVisible => () =>
    this.setState({
      menuVisible,
    });

  render() {
    const {
      filterFeedByFollowers,
      intl,
      handleFilterFeedByFollowers,
      savedTags,
      customTheme,
      selectedTag,
    } = this.props;
    const { menuVisible, currentFilter } = this.state;
    const handleHideMenu = this.handleSetMenuVisible(false);
    const allSelected = selectedTag === 'All';

    return (
      <Container>
        <HeaderContainer>
          <HeaderText>{'News'}</HeaderText>
          <TouchableMenu onPress={this.handleSetMenuVisible(!menuVisible)}>
            <HeaderText>{intl[currentFilter.label]}</HeaderText>
            <EvilIcons name={OCTICONS_ICONS.chevronDown} size={32} />
          </TouchableMenu>
        </HeaderContainer>

        <ScrollView horizontal customTheme={customTheme}>
          <TagText selected={allSelected}>{'All'}</TagText>
          {_.map(savedTags, tag => (
            <TagText key={tag} selected={selectedTag === tag}>
              {tag}
            </TagText>
          ))}
        </ScrollView>

        {menuVisible && (
          <BSteemModal visible={menuVisible} handleOnClose={handleHideMenu}>
            <FeedSort
              hideMenu={handleHideMenu}
              handleSortPost={this.handleSortPost}
              handleFilterFeedByFollowers={handleFilterFeedByFollowers}
              filterFeedByFollowers={filterFeedByFollowers}
            />
          </BSteemModal>
        )}
      </Container>
    );
  }
}

export default connect(mapStateToProps)(FeedHeader);
