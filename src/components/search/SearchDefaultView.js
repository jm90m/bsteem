import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import _ from 'lodash';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import Tag from 'components/post/Tag';
import { COLORS } from 'constants/styles';

const Container = styled.View`
  flex: 1;
  flex-wrap: wrap;
  flex-direction: row;
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
    return (
      <ScrollView>
        <Container>
          <TrendingTagsTitle>{'Trending Tags'}</TrendingTagsTitle>
          {this.renderTags()}
        </Container>
      </ScrollView>
    );
  }
}

export default SearchDefaultView;
