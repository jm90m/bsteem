import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import moment from 'moment';
import Avatar from 'components/common/Avatar';
import { COLORS } from 'constants/styles';
import * as accountHistoryConstants from 'constants/accountHistory';
import * as navigationConstants from 'constants/navigation';
import WalletTransactionContainer from './WalletTransactionContainer';

const SavingsMessageContainer = styled.View`
  flex-direction: row;
`;

const SavingsMessage = styled.Text`
`;

const Touchable = styled.TouchableOpacity``;

const Username = styled.Text`
  color: ${COLORS.PRIMARY_COLOR};
  font-weight: bold;
`;

const Memo = styled.Text`
`;

const TimeStamp = styled.Text`
  color: ${COLORS.BLUE.BOTICELLI};
  font-size: 14px;
`;

const SavingsContentContainer = styled.View`
  padding-left: 10px;
`;

class SavingsTransaction extends Component {
  static propTypes = {
    navigation: PropTypes.shape().isRequired,
    timestamp: PropTypes.string,
    transactionDetails: PropTypes.shape(),
    transactionType: PropTypes.string,
    amount: PropTypes.string,
  };

  static defaultProps = {
    timestamp: '',
    transactionDetails: {},
    transactionType: '',
    amount: '',
  };

  constructor(props) {
    super(props);

    this.handleToUserNavigate = this.handleToUserNavigate.bind(this);
    this.handleFromUserNavigate = this.handleFromUserNavigate.bind(this);
  }

  handleToUserNavigate() {
    const { transactionDetails } = this.props;

    this.props.navigation.navigate(navigationConstants.USER, { username: transactionDetails.to });
  }

  handleFromUserNavigate() {
    const { transactionDetails } = this.props;

    this.props.navigation.navigate(navigationConstants.USER, { username: transactionDetails.from });
  }

  renderAvatar() {
    const { transactionType, transactionDetails } = this.props;
    const username = transactionType === 'transfer_to_savings'
      ? transactionDetails.to
      : transactionDetails.from;
    return <Avatar username={username} size={40} />;
  }

  renderSavingsTransactionMessage() {
    const { transactionType, transactionDetails, amount } = this.props;

    switch (transactionType) {
      case accountHistoryConstants.CANCEL_TRANSFER_FROM_SAVINGS:
        return (
          <SavingsMessage>
            {`Cancel transfer from savings (request ${transactionDetails.request_id}`}
          </SavingsMessage>
        );
      case accountHistoryConstants.TRANSFER_TO_SAVINGS:
        return (
          <SavingsMessageContainer>
            <SavingsMessage>{`Transfer to savings ${amount} to `}</SavingsMessage>
            <Touchable onPress={this.handleToUserNavigate}>
              <Username>{transactionDetails.to}</Username>
            </Touchable>
          </SavingsMessageContainer>
        );
      case accountHistoryConstants.TRANSFER_FROM_SAVINGS:
        return (
          <SavingsMessageContainer>
            <SavingsMessage>{`Transfer from savings ${amount} to `}</SavingsMessage>
            <Touchable onPress={this.handleFromUserNavigate}>
              <Username>{transactionDetails.from}</Username>
            </Touchable>
          </SavingsMessageContainer>
        );
      default:
        return null;
    }
  }

  render() {
    const { transactionDetails, timestamp } = this.props;
    return (
      <WalletTransactionContainer>
        {this.renderAvatar()}
        <SavingsContentContainer>
          {this.renderSavingsTransactionMessage()}
          <TimeStamp>{moment(timestamp).fromNow()}</TimeStamp>
          <Memo>{transactionDetails.memo}</Memo>
        </SavingsContentContainer>
      </WalletTransactionContainer>
    );
  }
}

export default SavingsTransaction;
