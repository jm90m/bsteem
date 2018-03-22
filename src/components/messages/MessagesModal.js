import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { Modal } from 'react-native';
import i18n from 'i18n/i18n';
import { connect } from 'react-redux';
import { MATERIAL_ICONS, COLORS } from 'constants/styles';
import BackButton from 'components/common/BackButton';
import HeaderEmptyView from 'components/common/HeaderEmptyView';
import Header from 'components/common/Header';
import { hideMessagesModal } from 'state/actions/appActions';
import { getDisplayMessagesModal } from 'state/rootReducer';
import { SearchBar } from 'react-native-elements';

const Container = styled.View``;

const TitleText = styled.Text`
  font-weight: bold;
  color: ${COLORS.PRIMARY_COLOR};
`;

const mapStateToProps = state => ({
  displayMessagesModal: getDisplayMessagesModal(state),
});

const mapDispatchToProps = dispatch => ({
  hideMessagesModal: () => dispatch(hideMessagesModal()),
});

class MessagesModal extends Component {
  static propTypes = {
    hideMessagesModal: PropTypes.func.isRequired,
    displayMessagesModal: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      currentSearchValue: '',
    };

    this.handleSearchOnChangeText = this.handleSearchOnChangeText.bind(this);
  }

  handleSearchOnChangeText(value) {
    this.setState({
      currentSearchValue: value,
    });
  }

  render() {
    const { displayMessagesModal } = this.props;
    const { currentSearchValue } = this.state;

    if (!displayMessagesModal) return null;

    return (
      <Modal
        visible={displayMessagesModal}
        animationType="slide"
        onRequestClose={this.props.hideMessagesModal}
      >
        <Container>
          <Header>
            <HeaderEmptyView />
            <TitleText>{i18n.titles.messages}</TitleText>
            <BackButton
              navigateBack={this.props.hideMessagesModal}
              iconName={MATERIAL_ICONS.close}
            />
          </Header>
          <SearchBar
            lightTheme
            onChangeText={this.handleSearchOnChangeText}
            placeholder=""
            value={currentSearchValue}
            containerStyle={{ backgroundColor: COLORS.PRIMARY_BACKGROUND_COLOR, marginTop: 10 }}
            inputStyle={{ backgroundColor: COLORS.PRIMARY_BACKGROUND_COLOR }}
            showLoadingIcon={false}
            autoCorrect={false}
            autoCapitalize="none"
          />
        </Container>
      </Modal>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MessagesModal);
