import React, { Component } from 'react';
import { ScrollView, RefreshControl } from 'react-native';
import _ from 'lodash';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import Tag from 'components/post/Tag';
import { connect } from 'react-redux';
import { getCustomTheme, getIntl } from 'state/rootReducer';

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
  color: ${props => props.customTheme.tertiaryColor};
  padding: 10px;
`;

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
  intl: getIntl(state),
});

class SearchDefaultView extends Component {
  static propTypes = {
    tagsLoading: PropTypes.bool.isRequired,
    fetchTags: PropTypes.func.isRequired,
    tags: PropTypes.arrayOf(PropTypes.shape()),
    customTheme: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
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
    const { tagsLoading, fetchTags, customTheme, intl } = this.props;
    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={tagsLoading}
            onRefresh={fetchTags}
            tintColor={customTheme.primaryColor}
            colors={[customTheme.primaryColor]}
          />
        }
      >
        <Container>
          <TrendingTagsTitle customTheme={customTheme}>{intl.trending_topics}</TrendingTagsTitle>
          {this.renderTags()}
        </Container>
      </ScrollView>
    );
  }
}

export default connect(mapStateToProps)(SearchDefaultView);
