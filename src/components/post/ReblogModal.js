import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import ModalHeader from 'components/common/modal/ModalHeader';
import ModalFooter from 'components/common/modal/ModalFooter';
import { COLORS } from 'constants/styles';
import { connect } from 'react-redux';
import { getCustomTheme, getIntl } from 'state/rootReducer';
import tinycolor from 'tinycolor2';

const TouchableContainer = styled.TouchableOpacity`
  flex: 1;
`;

const Container = styled.View`
  padding-top: 10px;
  background-color: ${props => props.customTheme.primaryBackgroundColor};
`;

const ModalContent = styled.View`
  padding: 16px;
  border-bottom-color: ${props => props.customTheme.primaryBorderColor};
  border-bottom-width: 1px;
  background-color: ${props => props.customTheme.primaryBackgroundColor};
`;

const ModalContentText = styled.Text`
  color: ${props =>
    tinycolor(props.customTheme.primaryBackgroundColor).isDark()
      ? COLORS.LIGHT_TEXT_COLOR
      : COLORS.DARK_TEXT_COLOR};
`;

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
  intl: getIntl(state),
});

class ReblogModal extends Component {
  static propTypes = {
    customTheme: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    closeModal: PropTypes.func,
    confirmReblog: PropTypes.func,
  };

  static defaultProps = {
    closeModal: () => {},
    confirmReblog: () => {},
  };

  render() {
    const { closeModal, confirmReblog, customTheme, intl } = this.props;
    return (
      <TouchableContainer onPress={closeModal}>
        <Container customTheme={customTheme}>
          <ModalHeader title={intl.reblog_modal_title} closeModal={closeModal} />
          <ModalContent customTheme={customTheme}>
            <ModalContentText customTheme={customTheme}>
              {intl.reblog_modal_content}
            </ModalContentText>
          </ModalContent>
          <ModalFooter
            cancelText={intl.cancel}
            cancelPress={closeModal}
            successText={intl.reblog}
            successPress={confirmReblog}
          />
        </Container>
      </TouchableContainer>
    );
  }
}
export default connect(mapStateToProps)(ReblogModal);
