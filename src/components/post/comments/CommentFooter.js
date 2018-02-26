import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import styled from 'styled-components/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, ICON_SIZES, MATERIAL_COMMUNITY_ICONS } from 'constants/styles';
import SmallLoading from '../../common/SmallLoading';

const Container = styled.View`
  flex-direction: row;
  padding-left: 60px;
`;

const TouchableOpacity = styled.TouchableOpacity`
  padding-right: 10px;
`;

const LoadingContainer = styled.View`
  padding-right: 10px;
`;

const Payout = styled.Text`
  color: ${COLORS.TERTIARY_COLOR};
  margin-right: 10px;
`;

const TouchablePayout = styled.TouchableOpacity`
  margin-left: auto;
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
    editable: PropTypes.bool,
    handleLike: PropTypes.func,
    handleDislike: PropTypes.func,
    handleReply: PropTypes.func,
    handleEdit: PropTypes.func,
    handlePayout: PropTypes.func,
    payout: PropTypes.shape(),
  };

  static defaultProps = {
    liked: false,
    loadingLike: false,
    disliked: false,
    loadingDislike: false,
    editable: false,
    handleLike: () => {},
    handleDislike: () => {},
    handleReply: () => {},
    handleEdit: () => {},
    handlePayout: () => {},
    payout: {},
  };

  renderPayout() {
    const { payout, handlePayout } = this.props;
    const cashoutInTime = _.get(payout, 'cashoutInTime', false);
    const displayedPayout = cashoutInTime
      ? _.get(payout, 'potentialPayout')
      : _.get(payout, 'pastPayouts');
    const formattedDisplayedPayout = _.isUndefined(displayedPayout)
      ? '0.00'
      : parseFloat(displayedPayout).toFixed(2);
    return (
      <TouchablePayout onPress={handlePayout}>
        <Payout>${formattedDisplayedPayout}</Payout>
      </TouchablePayout>
    );
  }

  render() {
    const {
      liked,
      loadingLike,
      disliked,
      loadingDislike,
      editable,
      handleLike,
      handleDislike,
      handleReply,
      handleEdit,
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
        {editable && (
          <TouchableOpacity onPress={handleEdit}>
            <MaterialCommunityIcons
              name={MATERIAL_COMMUNITY_ICONS.pencil}
              size={ICON_SIZES.menuIcon}
              color={COLORS.TERTIARY_COLOR}
            />
          </TouchableOpacity>
        )}
        {this.renderPayout()}
      </Container>
    );
  }
}

export default CommentFooter;
