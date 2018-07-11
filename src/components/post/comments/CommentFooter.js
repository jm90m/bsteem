import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import styled from 'styled-components/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import PrimaryText from 'components/common/text/PrimaryText';
import { ICON_SIZES, MATERIAL_COMMUNITY_ICONS } from 'constants/styles';
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

const Payout = styled(PrimaryText)`
  color: ${props => props.customTheme.tertiaryColor};
  margin-right: 10px;
  ${props => (props.payoutIsDeclined ? 'text-decoration-line: line-through' : '')};
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
    customTheme: PropTypes.shape().isRequired,
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
    const { payout, handlePayout, customTheme } = this.props;
    const cashoutInTime = _.get(payout, 'cashoutInTime', false);
    const displayedPayout = cashoutInTime
      ? _.get(payout, 'potentialPayout')
      : _.get(payout, 'pastPayouts');
    const formattedDisplayedPayout = _.isUndefined(displayedPayout)
      ? '0.00'
      : parseFloat(displayedPayout).toFixed(2);
    const payoutIsDeclined = _.get(payout, 'isPayoutDeclined', false);
    return (
      <TouchablePayout onPress={handlePayout}>
        <Payout customTheme={customTheme} payoutIsDeclined={payoutIsDeclined}>
          ${formattedDisplayedPayout}
        </Payout>
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
      customTheme,
    } = this.props;

    return (
      <Container>
        {loadingLike ? (
          <Loader />
        ) : (
          <TouchableOpacity onPress={handleLike}>
            <MaterialCommunityIcons
              name={MATERIAL_COMMUNITY_ICONS.voteFill}
              size={ICON_SIZES.footerActionIcon}
              color={liked ? customTheme.primaryColor : customTheme.tertiaryColor}
            />
          </TouchableOpacity>
        )}
        {loadingDislike ? (
          <Loader />
        ) : (
          <TouchableOpacity onPress={handleDislike}>
            <MaterialCommunityIcons
              name={MATERIAL_COMMUNITY_ICONS.unvoteFill}
              size={ICON_SIZES.footerActionIcon}
              color={disliked ? customTheme.primaryColor : customTheme.tertiaryColor}
            />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={handleReply}>
          <MaterialCommunityIcons
            name={MATERIAL_COMMUNITY_ICONS.reply}
            size={ICON_SIZES.footerActionIcon}
            color={customTheme.tertiaryColor}
          />
        </TouchableOpacity>
        {editable && (
          <TouchableOpacity onPress={handleEdit}>
            <MaterialCommunityIcons
              name={MATERIAL_COMMUNITY_ICONS.pencil}
              size={ICON_SIZES.footerActionIcon}
              color={customTheme.tertiaryColor}
            />
          </TouchableOpacity>
        )}
        {this.renderPayout()}
      </Container>
    );
  }
}

export default CommentFooter;
