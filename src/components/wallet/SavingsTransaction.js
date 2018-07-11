import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import Avatar from 'components/common/Avatar';
import * as accountHistoryConstants from 'constants/accountHistory';
import * as navigationConstants from 'constants/navigation';
import TimeAgo from 'components/common/TimeAgo';
import { connect } from 'react-redux';
import StyledTextByBackground from 'components/common/StyledTextByBackground';
import PrimaryText from 'components/common/text/PrimaryText';
import WalletTransactionContainer from './WalletTransactionContainer';
import { getCustomTheme } from '../../state/rootReducer';

const SavingsMessageContainer = styled.View`
  flex-direction: row;
`;

const Touchable = styled.TouchableOpacity``;

const Username = styled(PrimaryText)`
  color: ${props => props.customTheme.primaryColor};
`;

const SavingsContentContainer = styled.View`
  padding-left: 10px;
`;

class SavingsTransaction extends Component {
  static propTypes = {
    customTheme: PropTypes.shape().isRequired,
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

    this.props.navigation.push(navigationConstants.USER, { username: transactionDetails.to });
  }

  handleFromUserNavigate() {
    const { transactionDetails } = this.props;

    this.props.navigation.push(navigationConstants.USER, { username: transactionDetails.from });
  }

  renderAvatar() {
    const { transactionType, transactionDetails } = this.props;
    const username =
      transactionType === 'transfer_to_savings' ? transactionDetails.to : transactionDetails.from;
    return <Avatar username={username} size={40} />;
  }

  renderSavingsTransactionMessage() {
    const { transactionType, transactionDetails, amount, customTheme } = this.props;

    switch (transactionType) {
      case accountHistoryConstants.CANCEL_TRANSFER_FROM_SAVINGS:
        return (
          <StyledTextByBackground>
            {`Cancel transfer from savings (request ${transactionDetails.request_id}`}
          </StyledTextByBackground>
        );
      case accountHistoryConstants.TRANSFER_TO_SAVINGS:
        return (
          <SavingsMessageContainer>
            <StyledTextByBackground>{`Transfer to savings ${amount} to `}</StyledTextByBackground>
            <Touchable onPress={this.handleToUserNavigate}>
              <Username customTheme={customTheme}>{transactionDetails.to}</Username>
            </Touchable>
          </SavingsMessageContainer>
        );
      case accountHistoryConstants.TRANSFER_FROM_SAVINGS:
        return (
          <SavingsMessageContainer>
            <StyledTextByBackground>{`Transfer from savings ${amount} to `}</StyledTextByBackground>
            <Touchable onPress={this.handleFromUserNavigate}>
              <Username customTheme={customTheme}>{transactionDetails.from}</Username>
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
          <TimeAgo created={timestamp} />
          <StyledTextByBackground>{transactionDetails.memo}</StyledTextByBackground>
        </SavingsContentContainer>
      </WalletTransactionContainer>
    );
  }
}

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
});

export default connect(mapStateToProps)(SavingsTransaction);
