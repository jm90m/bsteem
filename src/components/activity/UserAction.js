import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import styled from 'styled-components/native';
import TimeAgo from 'components/common/TimeAgo';
import WalletTransaction from 'components/wallet/WalletTransaction';
import { isWalletTransaction } from 'util/apiUtils';
import { getCustomTheme } from 'state/rootReducer';
import { connect } from 'react-redux';
import UserActionIcon from './UserActionIcon';
import UserActionMessage from './UserActionMessage';

const Container = styled.View`
  flex-direction: row;
  background-color: ${props => props.customTheme.primaryBackgroundColor};
  margin-top: 2px;
  margin-bottom: 2px;
  border-top-color: ${props => props.customTheme.primaryBorderColor};
  border-bottom-color: ${props => props.customTheme.primaryBorderColor};
  border-top-width: 1px;
  border-bottom-width: 1px;
  padding: 5px;
`;

const MessageContainer = styled.View``;

const UserAction = ({
  action,
  totalVestingShares,
  totalVestingFundSteem,
  currentUsername,
  navigation,
  customTheme,
}) => {
  const actionType = _.get(action.op, 0, '');
  const actionDetails = _.get(action.op, 1, {});

  if (isWalletTransaction(actionType)) {
    return (
      <WalletTransaction
        navigation={navigation}
        transaction={action}
        currentUsername={currentUsername}
        totalVestingShares={totalVestingShares}
        totalVestingFundSteem={totalVestingFundSteem}
      />
    );
  }

  return (
    <Container customTheme={customTheme}>
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
          totalVestingFundSteem={totalVestingFundSteem}
          totalVestingShares={totalVestingShares}
        />
        <TimeAgo created={action.timestamp} style={{ marginLeft: 10 }} />
      </MessageContainer>
    </Container>
  );
};

UserAction.propTypes = {
  customTheme: PropTypes.shape().isRequired,
  action: PropTypes.shape().isRequired,
  currentUsername: PropTypes.string.isRequired,
  navigation: PropTypes.shape().isRequired,
  totalVestingFundSteem: PropTypes.string.isRequired,
  totalVestingShares: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
});

export default connect(mapStateToProps)(UserAction);
