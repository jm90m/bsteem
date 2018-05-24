import React, { Component } from 'react';
import Expo from 'expo';
import { TouchableWithoutFeedback } from 'react-native';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { getCustomTheme } from 'state/rootReducer';
import tinycolor from 'tinycolor2';
import { MATERIAL_COMMUNITY_ICONS, COLORS, ICON_SIZES } from 'constants/styles';

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  padding-bottom: 5px;
`;

const Website = styled.Text`
  margin-left: 5px;
  color: ${props => props.customTheme.primaryColor};
`;

class UserWebsite extends Component {
  static propTypes = {
    customTheme: PropTypes.shape().isRequired,
    website: PropTypes.string,
  };

  static defaultProps = {
    website: '',
  };

  constructor(props) {
    super(props);
    this.handleOnClickWebsite = this.handleOnClickWebsite.bind(this);
  }

  handleOnClickWebsite() {
    let { website } = this.props;

    if (website && website.indexOf('http://') === -1 && website.indexOf('https://') === -1) {
      website = `http://${website}`;
    }

    try {
      Expo.WebBrowser.openBrowserAsync(website).catch(error => {
        console.log('invalid url', error, website);
      });
    } catch (e) {}
  }

  render() {
    const { website, customTheme } = this.props;
    return (
      <Container>
        <MaterialCommunityIcons
          name={MATERIAL_COMMUNITY_ICONS.linkVariant}
          size={ICON_SIZES.userHeaderIcon}
          color={
            tinycolor(customTheme.primaryBackgroundColor).isDark()
              ? COLORS.LIGHT_TEXT_COLOR
              : COLORS.DARK_TEXT_COLOR
          }
        />
        <TouchableWithoutFeedback onPress={this.handleOnClickWebsite}>
          <Website customTheme={customTheme}>{website}</Website>
        </TouchableWithoutFeedback>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
});

export default connect(mapStateToProps)(UserWebsite);
