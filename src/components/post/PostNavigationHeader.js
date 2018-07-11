import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import Touchable from 'components/common/Touchable';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MATERIAL_COMMUNITY_ICONS, ICON_SIZES } from 'constants/styles';
import Header from 'components/common/Header';
import { getCustomTheme } from 'state/rootReducer';
import BackButton from 'components/common/BackButton';
import StyledTextByBackground from 'components/common/StyledTextByBackground';
import { connect } from 'react-redux';

const styles = StyleSheet.create({
  menu: {
    justifyContent: 'center',
    padding: 10,
  },
});

const PostNavigationLoadingHeaderContainer = ({
  author,
  navigateBack,
  displayMenu,
  customTheme,
}) => {
  return (
    <Header>
      <BackButton navigateBack={navigateBack} />
      <StyledTextByBackground>{author}</StyledTextByBackground>
      <View style={styles.menu}>
        <Touchable onPress={displayMenu}>
          <MaterialCommunityIcons
            size={ICON_SIZES.menuIcon}
            name={MATERIAL_COMMUNITY_ICONS.menuVertical}
            color={customTheme.secondaryColor}
          />
        </Touchable>
      </View>
    </Header>
  );
};

PostNavigationLoadingHeaderContainer.propTypes = {
  customTheme: PropTypes.shape().isRequired,
  author: PropTypes.string,
  navigateBack: PropTypes.func,
  displayMenu: PropTypes.func,
};

PostNavigationLoadingHeaderContainer.defaultProps = {
  author: '',
  navigateBack: () => {},
  displayMenu: () => {},
};

export default connect(state => ({
  customTheme: getCustomTheme(state),
}))(PostNavigationLoadingHeaderContainer);
