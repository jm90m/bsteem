import React, { Component } from 'react';
import styled from 'styled-components/native';
import { fetchTags } from '../state/actions/homeActions';
import { MaterialIcons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import * as screens from 'constants/screens';

const Container = styled.ScrollView`
  flex: 1;
`;

const TagText = styled.Text`
`;

const Tag = styled.Text`

`;

const TouchableTag = styled.TouchableOpacity`
  padding: 5px;
`;

const mapStateToProps = state => ({
  tags: state.home.tags,
});

const mapDispatchToProps = dispatch => ({
  fetchTags: () => dispatch(fetchTags()),
});

class TagsScreen extends Component {
  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => <MaterialIcons name={'public'} size={20} color={tintColor} />,
  };

  componentDidMount() {
    this.props.fetchTags();
  }

  handleNavigateToFeed = tag => {
    this.props.navigation.navigate(screens.FEED, { tag });
  };

  render() {
    const { tags } = this.props;
    console.log('TAGS', tags);
    return (
      <Container>
        {tags.map((tag, index) => (
          <TouchableTag onPress={() => this.handleNavigateToFeed(tag.name)} key={index}>
            <Tag>{`#${tag.name}`}</Tag>
          </TouchableTag>
        ))}
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TagsScreen);
