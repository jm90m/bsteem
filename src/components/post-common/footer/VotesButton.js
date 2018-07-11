import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ICON_SIZES, MATERIAL_ICONS } from 'constants/styles';
import Touchable from 'components/common/Touchable';
import SmallLoading from 'components/common/SmallLoading';
import { connect } from 'react-redux';
import { getCustomTheme } from 'state/rootReducer';
import commonStyles from 'styles/common';

class VotesButton extends React.PureComponent {
  static propTypes = {
    customTheme: PropTypes.shape().isRequired,
    likedPost: PropTypes.bool,
    loadingVote: PropTypes.bool,
    onPressVote: PropTypes.func,
    activeVotes: PropTypes.number,
  };

  static defaultProps = {
    likedPost: false,
    loadingVote: false,
    onPressVote: () => {},
    activeVotes: 0,
  };

  renderVoteButton() {
    const { likedPost, onPressVote, loadingVote, customTheme } = this.props;

    if (loadingVote) {
      return <SmallLoading />;
    }

    if (likedPost) {
      return (
        <Touchable onPress={onPressVote}>
          <MaterialIcons
            name={MATERIAL_ICONS.like}
            size={ICON_SIZES.footerActionIcon}
            color={customTheme.primaryColor}
          />
        </Touchable>
      );
    }

    return (
      <Touchable onPress={onPressVote}>
        <MaterialIcons
          name={MATERIAL_ICONS.like}
          size={ICON_SIZES.footerActionIcon}
          color={customTheme.tertiaryColor}
        />
      </Touchable>
    );
  }
  render() {
    const { onPressVote, customTheme, activeVotes } = this.props;

    return (
      <View style={commonStyles.rowAlignedCenterContainer}>
        {this.renderVoteButton()}
        <Touchable onPress={onPressVote}>
          <View>
            <Text
              style={[
                commonStyles.primaryText,
                commonStyles.footerValue,
                { color: customTheme.tertiaryColor },
              ]}
            >
              {activeVotes}
            </Text>
          </View>
        </Touchable>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
});

export default connect(mapStateToProps)(VotesButton);
