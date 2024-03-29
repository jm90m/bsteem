import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { connect } from 'react-redux';
import { getCustomTheme } from 'state/rootReducer';

const WalletTransactionContainer = styled.View`
  flex-direction: row;
  background-color: ${props => props.customTheme.primaryBackgroundColor};
  border-bottom-color: ${props => props.customTheme.primaryBorderColor};
  border-bottom-width: 1px;
  padding: 5px;
`;

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
});

WalletTransactionContainer.propTypes = {
  customTheme: PropTypes.shape().isRequired,
};

export default connect(mapStateToProps)(WalletTransactionContainer);
