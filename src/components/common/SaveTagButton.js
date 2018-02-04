import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MATERIAL_COMMUNITY_ICONS, COLORS, ICON_SIZES } from '../../constants/styles';
import { saveTag, unsaveTag } from '../../state/actions/firebaseActions';
import { getPendingSavingTags, getSavedTags } from '../../state/rootReducer';
import SmallLoading from './SmallLoading';

const Touchable = styled.TouchableOpacity``;

@connect(
  state => ({
    pendingSavingTags: getPendingSavingTags(state),
    savedTags: getSavedTags(state),
  }),
  dispatch => ({
    saveTag: tag => dispatch(saveTag.action({ tag })),
    unsaveTag: tag => dispatch(unsaveTag.action({ tag })),
  }),
)
class SaveTagButton extends Component {
  static propTypes = {
    tag: PropTypes.string.isRequired,
    saveTag: PropTypes.func.isRequired,
    unsaveTag: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.handleSaveTag = this.handleSaveTag.bind(this);
    this.handleUnsaveTag = this.handleUnsaveTag.bind(this);
  }

  handleSaveTag() {
    const { tag } = this.props;
    this.props.saveTag(tag);
  }

  handleUnsaveTag() {
    const { tag } = this.props;
    this.props.unsaveTag(tag);
  }

  render() {
    const { tag, savedTags, pendingSavingTags } = this.props;

    if (_.includes(pendingSavingTags, tag)) {
      return <SmallLoading style={{ marginLeft: 5 }} />;
    }

    const isSaved = _.includes(savedTags, tag);

    return isSaved ? (
      <Touchable onPress={this.handleUnsaveTag}>
        <MaterialCommunityIcons
          name={MATERIAL_COMMUNITY_ICONS.savedTag}
          size={ICON_SIZES.menuIcon}
          color={COLORS.PRIMARY_COLOR}
        />
      </Touchable>
    ) : (
      <Touchable onPress={this.handleSaveTag}>
        <MaterialCommunityIcons
          name={MATERIAL_COMMUNITY_ICONS.saveTag}
          size={ICON_SIZES.menuIcon}
          color={COLORS.PRIMARY_COLOR}
        />
      </Touchable>
    );
  }
}

export default SaveTagButton;
