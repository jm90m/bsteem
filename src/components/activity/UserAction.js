import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import styled from 'styled-components/native';
import moment from 'moment';
import { COLORS } from 'constants/styles';
import UserActionIcon from './UserActionIcon';
import UserActionMessage from './UserActionMessage';

const Container = styled.View`
  flex-direction: row;
  background-color: ${COLORS.WHITE.WHITE};
  margin-top: 2px;
  margin-bottom: 2px;
  border-color: ${COLORS.WHITE.WHITE_SMOKE};
  border-width: 2px;
  padding: 5px;
`;

const MessageContainer = styled.View`
  
`;

const TimeStamp = styled.Text`
  color: ${COLORS.BLUE.BOTICELLI};
  font-size: 14px;
  padding-left: 10px;
`;

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
        <TimeStamp>
          {`${moment(action.timestamp).fromNow(true)} ago`}
        </TimeStamp>
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
