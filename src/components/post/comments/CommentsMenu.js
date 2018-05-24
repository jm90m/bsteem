import React from 'react';
import PropTypes from 'prop-types';
import { TouchableWithoutFeedback } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import _ from 'lodash';
import styled from 'styled-components/native';
import { ICON_SIZES } from 'constants/styles';
import { COMMENT_FILTERS } from 'constants/comments';
import MenuModalButton from 'components/common/menu/MenuModalButton';
import MenuWrapper from 'components/common/menu/MenuWrapper';

const Container = styled.View`
  flex: 1;
  flex-direction: column-reverse;
  align-items: center;
`;

const MenuModalContents = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const MenuText = styled.Text`
  margin-left: 5px;
  color: ${props => props.customTheme.primaryColor};
  font-weight: bold;
`;

class CommentsMenu extends React.Component {
  static propTypes = {
    handleSortComments: PropTypes.func.isRequired,
    hideMenu: PropTypes.func.isRequired,
    customTheme: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
  };

  render() {
    const { customTheme, intl } = this.props;
    return (
      <TouchableWithoutFeedback onPress={this.props.hideMenu}>
        <Container>
          <MenuWrapper>
            {_.map(COMMENT_FILTERS, filter => (
              <MenuModalButton onPress={this.props.handleSortComments(filter)} key={filter.label}>
                <MenuModalContents>
                  <MaterialCommunityIcons
                    size={ICON_SIZES.menuModalOptionIcon}
                    color={customTheme.primaryColor}
                    name={filter.icon}
                  />
                  <MenuText customTheme={customTheme}>{intl[filter.label]}</MenuText>
                </MenuModalContents>
              </MenuModalButton>
            ))}
          </MenuWrapper>
        </Container>
      </TouchableWithoutFeedback>
    );
  }
}

export default CommentsMenu;
