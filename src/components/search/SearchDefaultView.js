import React, { Component } from 'react';
import { ScrollView, RefreshControl } from 'react-native';
import _ from 'lodash';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import Tag from 'components/post/Tag';
import { COLORS } from 'constants/styles';
import i18n from 'i18n/i18n';

const Container = styled.View`
  flex: 1;
  flex-wrap: wrap;
  flex-direction: row;
  padding-bottom: 100px;
`;

const TouchableTag = styled.TouchableOpacity`
  margin: 10px;
`;

const TrendingTagsTitle = styled.Text`
  font-weight: bold;
  font-size: 20px;
  width: 100%;
  color: ${COLORS.BLUE.BOTICELLI};
  padding: 10px;
`;

class SearchDefaultView extends Component {
  static propTypes = {
    tagsLoading: PropTypes.bool.isRequired,
    fetchTags: PropTypes.func.isRequired,
    tags: PropTypes.arrayOf(PropTypes.shape()),
    handleNavigateToFeed: PropTypes.func,
  };

  static defaultProps = {
    tags: [],
    handleNavigateToFeed: () => {},
  };

  renderTags() {
    const { tags, handleNavigateToFeed } = this.props;
    return _.map(tags, (tag, index) => (
      <TouchableTag onPress={() => handleNavigateToFeed(tag.name)} key={index}>
        <Tag tag={tag.name} />
      </TouchableTag>
    ));
  }
  render() {
    const { tagsLoading, fetchTags } = this.props;
    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={tagsLoading}
            onRefresh={fetchTags}
            tintColor={COLORS.PRIMARY_COLOR}
            colors={[COLORS.PRIMARY_COLOR]}
          />
        }
      >
        <Container>
          <TrendingTagsTitle>{i18n.titles.trendingTags}</TrendingTagsTitle>
          {this.renderTags()}
        </Container>
      </ScrollView>
    );
  }
}

export default SearchDefaultView;
