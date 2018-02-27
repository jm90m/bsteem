import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import styled from 'styled-components/native';
import { COLORS } from 'constants/styles';
import TimeAgo from 'components/common/TimeAgo';
import UserActionIcon from './UserActionIcon';
import UserActionMessage from './UserActionMessage';

const Container = styled.View`
  flex-direction: row;
  background-color: ${COLORS.WHITE.WHITE};
  margin-top: 2px;
  margin-bottom: 2px;
  border-color: ${COLORS.WHITE.WHITE_SMOKE};
  border-width: 1px;
  padding: 5px;
`;

const MessageContainer = styled.View``;

const UserAction = ({
  action,
  totalVestingShares,
  totalVestingFundSteem,
  currentUsername,
  navigation,
}) => {
  const actionType = _.get(action.op, 0, '');
  const actionDetails = _.get(action.op, 1, {});

  return (
    <Container>
      <UserActionIcon
        actionType={actionType}
        actionDetails={actionDetails}
        currentUsername={currentUsername}
      />
      <MessageContainer>
        <UserActionMessage
          actionType={actionType}
          actionDetails={actionDetails}
          currentUsername={currentUsername}
          navigation={navigation}
        />
        <TimeAgo created={action.timestamp} style={{ marginLeft: 10 }} />
      </MessageContainer>
    </Container>
  );
};

UserAction.propTypes = {
  action: PropTypes.shape().isRequired,
  currentUsername: PropTypes.string.isRequired,
  navigation: PropTypes.shape().isRequired,
};

export default UserAction;
