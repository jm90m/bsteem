import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, MATERIAL_ICONS, ICON_SIZES } from 'constants/styles';
import { connect } from 'react-redux';
import tinycolor from 'tinycolor2';
import { getCustomTheme } from 'state/rootReducer';

const Container = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: 20px 16px 13px 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.customTheme.primaryBorderColor};
`;

const TitleText = styled.Text`
  color: ${props =>
    tinycolor(props.customTheme.primaryBackgroundColor).isDark()
      ? COLORS.LIGHT_TEXT_COLOR
      : COLORS.DARK_TEXT_COLOR};
  font-weight: bold;
  font-size: 16px;
`;

const Touchable = styled.TouchableOpacity``;

const ModalHeader = ({ title, closeModal, customTheme }) => (
  <Container customTheme={customTheme}>
    <TitleText customTheme={customTheme}>{title}</TitleText>
    <Touchable onPress={closeModal}>
      <MaterialIcons
        name={MATERIAL_ICONS.close}
        size={ICON_SIZES.contentTitleBlockIcon}
        color={
          tinycolor(customTheme.primaryBackgroundColor).isDark()
            ? COLORS.LIGHT_TEXT_COLOR
            : COLORS.DARK_TEXT_COLOR
        }
      />
    </Touchable>
  </Container>
);

ModalHeader.propTypes = {
  customTheme: PropTypes.shape().isRequired,
  title: PropTypes.string,
  closeModal: PropTypes.func,
};

ModalHeader.defaultProps = {
  title: '',
  closeModal: () => {},
};

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
});

export default connect(mapStateToProps)(ModalHeader);
