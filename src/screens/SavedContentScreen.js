import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import { ScrollView } from 'react-native';
import Header from 'components/common/Header';
import _ from 'lodash';
import HeaderEmptyView from 'components/common/HeaderEmptyView';
import Tag from 'components/post/Tag';
import { MaterialIcons } from '@expo/vector-icons';
import i18n from 'i18n/i18n';
import * as navigationConstants from 'constants/navigation';
import { fetchSavedTags, fetchSavedPosts } from 'state/actions/firebaseActions';
import { COLORS, MATERIAL_ICONS, ICON_SIZES } from '../constants/styles';
import { getLoadingSavedTags, getSavedPosts, getSavedTags } from '../state/rootReducer';
import SaveTagButton from '../components/common/SaveTagButton';

const BackTouchable = styled.TouchableOpacity`
  justify-content: center;
  padding: 10px;
`;

const Container = styled.View``;

const Title = styled.Text`
  margin-left: 5px;
  color: ${COLORS.PRIMARY_COLOR};
`;

const TitleContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const TagOption = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: 10px;
  margin: 5px 0;
  background-color: ${COLORS.PRIMARY_BACKGROUND_COLOR};
`;

const TagTouchble = styled.TouchableOpacity``;

@connect(
  state => ({
    loading: getLoadingSavedTags(state),
    savedTags: getSavedTags(state),
    savedPosts: getSavedPosts(state),
  }),
  dispatch => ({
    fetchSavedTags: () => dispatch(fetchSavedTags.action()),
    fetchSavedPosts: () => dispatch(fetchSavedPosts.action()),
  }),
)
class SavedContentScreen extends Component {
  static propTypes = {
    navigation: PropTypes.shape().isRequired,
    fetchSavedTags: PropTypes.func.isRequired,
    fetchSavedPosts: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      currentSavedTags: props.savedTags,
    };

    this.navigateBack = this.navigateBack.bind(this);
    this.handleNavigateTag = this.handleNavigateTag.bind(this);
  }

  componentDidMount() {
    this.props.fetchSavedTags();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      currentSavedTags: _.union(this.state.currentSavedTags, nextProps.savedTags),
    });
  }

  handleNavigateTag(tag) {
    this.props.navigation.navigate(navigationConstants.FEED, {
      tag,
    });
  }

  navigateBack() {
    this.props.navigation.goBack();
  }

  render() {
    return (
      <Container>
        <Header>
          <BackTouchable onPress={this.navigateBack}>
            <MaterialIcons size={ICON_SIZES.menuIcon} name={MATERIAL_ICONS.back} />
          </BackTouchable>
          <TitleContainer>
            <MaterialIcons
              size={ICON_SIZES.menuIcon}
              name={MATERIAL_ICONS.star}
              color={COLORS.PRIMARY_COLOR}
            />
            <Title>{i18n.titles.savedTags}</Title>
          </TitleContainer>
          <HeaderEmptyView />
        </Header>
        <ScrollView>
          {_.map(this.state.currentSavedTags, tag => (
            <TagOption key={tag}>
              <TagTouchble onPress={() => this.handleNavigateTag(tag)}>
                <Tag tag={tag} />
              </TagTouchble>
              <SaveTagButton tag={tag} />
            </TagOption>
          ))}
        </ScrollView>
      </Container>
    );
  }
}

export default SavedContentScreen;
