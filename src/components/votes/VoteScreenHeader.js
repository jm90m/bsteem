import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import { MATERIAL_COMMUNITY_ICONS, ICON_SIZES } from 'constants/styles';
import Header from 'components/common/Header';
import { getCustomTheme } from 'state/rootReducer';
import { connect } from 'react-redux';
import BackButton from 'components/common/BackButton';
import StyledTextByBackground from 'components/common/StyledTextByBackground';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Touchable from '../common/Touchable';

const styles = StyleSheet.create({
  menu: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  menuTouchableContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  rightMenuIconContainer: {
    padding: 5,
    flexDirection: 'row',
  },
  votesCount: {
    marginHorizontal: 5,
  },
});

const VoteScreenHeader = ({
  customTheme,
  navigateBack,
  handleSetSortMenuDisplay,
  handleShowUpVotes,
  handleShowDownVotes,
  sort,
  selectedUpVotesMenu,
  upVotesSize,
  downVotesSize,
}) => (
  <Header>
    <BackButton navigateBack={navigateBack} />
    <View style={styles.menu}>
      <Touchable onPress={handleShowUpVotes}>
        <View style={styles.menuTouchableContainer}>
          <MaterialCommunityIcons
            name={MATERIAL_COMMUNITY_ICONS.voteFill}
            size={ICON_SIZES.menuIcon}
            color={selectedUpVotesMenu ? customTheme.primaryColor : customTheme.secondaryColor}
          />
          <StyledTextByBackground style={styles.votesCount}>{upVotesSize}</StyledTextByBackground>
        </View>
      </Touchable>
      <Touchable onPress={handleShowDownVotes}>
        <View style={styles.menuTouchableContainer}>
          <MaterialCommunityIcons
            name={MATERIAL_COMMUNITY_ICONS.unvoteFill}
            size={ICON_SIZES.menuIcon}
            color={!selectedUpVotesMenu ? customTheme.primaryColor : customTheme.secondaryColor}
          />
          <StyledTextByBackground style={styles.votesCount}>{downVotesSize}</StyledTextByBackground>
        </View>
      </Touchable>
    </View>
    <Touchable onPress={handleSetSortMenuDisplay(true)}>
      <View style={styles.rightMenuIconContainer}>
        <MaterialCommunityIcons
          name={sort.icon}
          color={customTheme.primaryColor}
          size={ICON_SIZES.menuIcon}
        />
        <MaterialCommunityIcons
          name={MATERIAL_COMMUNITY_ICONS.menuVertical}
          size={ICON_SIZES.menuIcon}
          color={customTheme.secondaryColor}
        />
      </View>
    </Touchable>
  </Header>
);

VoteScreenHeader.propTypes = {
  customTheme: PropTypes.shape().isRequired,
  navigateBack: PropTypes.func,
  handleSetSortMenuDisplay: PropTypes.func,
  handleShowUpVotes: PropTypes.func,
  handleShowDownVotes: PropTypes.func,
  sort: PropTypes.shape(),
  selectedUpVotesMenu: PropTypes.bool,
  upVotesSize: PropTypes.number,
  downVotesSize: PropTypes.number,
};

VoteScreenHeader.defaultProps = {
  selectedUpVotesMenu: true,
  navigateBack: () => {},
  handleSetSortMenuDisplay: () => {},
  handleShowUpVotes: () => {},
  handleShowDownVotes: () => {},
  upVotesSize: 0,
  downVotesSize: 0,
  sort: {},
};

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
});

export default connect(mapStateToProps)(VoteScreenHeader);
