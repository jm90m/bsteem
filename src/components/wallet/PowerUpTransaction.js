import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { FONT_AWESOME_ICONS, COLORS, ICON_SIZES } from 'constants/styles';
import TimeAgo from 'components/common/TimeAgo';
import StyledTextByBackground from 'components/common/StyledTextByBackground';
import { connect } from 'react-redux';
import { getCustomTheme, getIntl } from 'state/rootReducer';
import WalletTransactionContainer from './WalletTransactionContainer';
import IconContainer from './IconContainer';
import tinycolor from 'tinycolor2';

const PowerUpTransaction = ({ timestamp, amount, customTheme, intl }) => (
  <WalletTransactionContainer>
    <IconContainer>
      <FontAwesome
        name={FONT_AWESOME_ICONS.bolt}
        size={ICON_SIZES.actionIcon}
        color={
          tinycolor(customTheme.tertiaryColor).isDark()
            ? COLORS.LIGHT_TEXT_COLOR
            : COLORS.DARK_TEXT_COLOR
        }
      />
    </IconContainer>
    <View>
      <StyledTextByBackground style={{ paddingLeft: 10, fontWeight: 'bold' }}>
        {intl.powered_up}
      </StyledTextByBackground>
      <TimeAgo created={timestamp} style={{ marginLeft: 10 }} />
    </View>
    <StyledTextByBackground style={{ marginLeft: 'auto', fontWeight: 'bold' }}>
      {amount}
    </StyledTextByBackground>
  </WalletTransactionContainer>
);

PowerUpTransaction.propTypes = {
  customTheme: PropTypes.shape().isRequired,
  timestamp: PropTypes.string.isRequired,
  amount: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
  intl: getIntl(state),
});

export default connect(mapStateToProps)(PowerUpTransaction);
