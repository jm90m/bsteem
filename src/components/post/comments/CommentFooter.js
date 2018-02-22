import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, ICON_SIZES, MATERIAL_COMMUNITY_ICONS } from 'constants/styles';
import SmallLoading from '../../common/SmallLoading';

const Container = styled.View`
  flex-direction: row;
  padding-left: 50px;
`;

const TouchableOpacity = styled.TouchableOpacity`
  padding-right: 10px;
`;

const LoadingContainer = styled.View`
  padding-right: 10px;
`;

const Loader = () => (
  <LoadingContainer>
    <SmallLoading />
  </LoadingContainer>
);

class CommentFooter extends Component {
  static propTypes = {
    liked: PropTypes.bool,
    loadingLike: PropTypes.bool,
    disliked: PropTypes.bool,
    loadingDislike: PropTypes.bool,
    handleLike: PropTypes.func,
    handleDislike: PropTypes.func,
    handleReply: PropTypes.func,
  };

  static defaultProps = {
    liked: false,
    loadingLike: false,
    disliked: false,
    loadingDislike: false,
    handleLike: () => {},
    handleDislike: () => {},
    handleReply: () => {},
  };

  render() {
    const {
      liked,
      loadingLike,
      disliked,
      loadingDislike,
      handleLike,
      handleDislike,
      handleReply,
    } = this.props;
    return (
      <Container>
        {loadingLike ? (
          <Loader />
        ) : (
          <TouchableOpacity onPress={handleLike}>
            <MaterialCommunityIcons
              name={MATERIAL_COMMUNITY_ICONS.voteFill}
              size={ICON_SIZES.menuIcon}
              color={liked ? COLORS.PRIMARY_COLOR : COLORS.TERTIARY_COLOR}
            />
          </TouchableOpacity>
        )}
        {loadingDislike ? (
          <Loader />
        ) : (
          <TouchableOpacity onPress={handleDislike}>
            <MaterialCommunityIcons
              name={MATERIAL_COMMUNITY_ICONS.unvoteFill}
              size={ICON_SIZES.menuIcon}
              color={disliked ? COLORS.PRIMARY_COLOR : COLORS.TERTIARY_COLOR}
            />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={handleReply}>
          <MaterialCommunityIcons
            name={MATERIAL_COMMUNITY_ICONS.reply}
            size={ICON_SIZES.menuIcon}
            color={COLORS.TERTIARY_COLOR}
          />
        </TouchableOpacity>
      </Container>
    );
  }
}

export default CommentFooter;
