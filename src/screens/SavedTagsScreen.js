import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import Header from 'components/common/Header';
import _ from 'lodash';
import HeaderEmptyView from 'components/common/HeaderEmptyView';
import Tag from 'components/post/Tag';
import { MaterialIcons } from '@expo/vector-icons';
import i18n from 'i18n/i18n';
import { fetchSavedTags } from 'state/actions/firebaseActions';
import { COLORS, MATERIAL_ICONS } from '../constants/styles';
import { getLoadingSavedTags, getPendingSavingTags, getSavedTags } from '../state/rootReducer';

const BackTouchable = styled.TouchableOpacity`
  justify-content: center;
  padding: 10px;
`;

const Container = styled.View``;

const Title = styled.Text`
  align-self: center;
  color: ${COLORS.PRIMARY_COLOR};
`;

@connect(
  state => ({
    loading: getLoadingSavedTags(state),
    savedTags: getSavedTags(state),
  }),
  dispatch => ({
    fetchSavedTags: () => dispatch(fetchSavedTags.action()),
  }),
)
class SavedTagsScreen extends Component {
  static propTypes = {
    navigation: PropTypes.shape().isRequired,
    fetchSavedTags: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.navigateBack = this.navigateBack.bind(this);
  }

  componentDidMount() {
    this.props.fetchSavedTags();
  }

  navigateBack() {
    this.props.navigation.goBack();
  }

  render() {
    return (
      <Container>
        <Header>
          <BackTouchable onPress={this.navigateBack}>
            <MaterialIcons size={24} name={MATERIAL_ICONS.back} />
          </BackTouchable>
          <Title>{i18n.titles.savedTags}</Title>
          <HeaderEmptyView />
        </Header>
        {_.map(this.props.savedTags, tag => <Tag tag={tag} />)}
      </Container>
    );
  }
}

export default SavedTagsScreen;
