import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableWithoutFeedback } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import _ from 'lodash';
import styled from 'styled-components/native';
import { COLORS } from 'constants/styles';
import { FEED_FILTERS } from 'constants/feedFilters';
import MenuModalButton from 'components/common/menu/MenuModalButton';
import MenuWrapper from 'components/common/menu/MenuWrapper';

const Container = styled.View`
  flex: 1;
  flex-direction: column-reverse;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const MenuModalContents = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const MenuText = styled.Text`
  margin-left: 5px;
  color: ${COLORS.PRIMARY_COLOR};
  font-weight: bold;
`;

class FeedSort extends Component {
  static propTypes = {
    handleSortPost: PropTypes.func.isRequired,
    hideMenu: PropTypes.func.isRequired,
  };

  render() {
    return (
      <TouchableWithoutFeedback onPress={this.props.hideMenu}>
        <Container>
          <MenuWrapper>
            {_.map(FEED_FILTERS, filter => (
              <MenuModalButton onPress={() => this.props.handleSortPost(filter)} key={filter.label}>
                <MenuModalContents>
                  <MaterialIcons size={20} color={COLORS.PRIMARY_COLOR} name={filter.icon} />
                  <MenuText>{filter.label}</MenuText>
                </MenuModalContents>
              </MenuModalButton>
            ))}
          </MenuWrapper>
        </Container>
      </TouchableWithoutFeedback>
    );
  }
}

export default FeedSort;
