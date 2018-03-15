import React, { Component } from 'react';
import Expo from 'expo';
import { TouchableWithoutFeedback } from 'react-native';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MATERIAL_COMMUNITY_ICONS, COLORS } from 'constants/styles';

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  padding-bottom: 5px;
`;

const Website = styled.Text`
  margin-left: 5px;
  color: ${COLORS.PRIMARY_COLOR};
`;

class UserWebsite extends Component {
  static propTypes = {
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
    const { website } = this.props;
    return (
      <Container>
        <MaterialCommunityIcons
          name={MATERIAL_COMMUNITY_ICONS.linkVariant}
          size={20}
          color={COLORS.GREY.CHARCOAL}
        />
        <TouchableWithoutFeedback onPress={this.handleOnClickWebsite}>
          <Website>{website}</Website>
        </TouchableWithoutFeedback>
      </Container>
    );
  }
}

export default UserWebsite;
