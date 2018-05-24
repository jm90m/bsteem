import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableWithoutFeedback } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import _ from 'lodash';
import styled from 'styled-components/native';
import { ICON_SIZES } from 'constants/styles';
import { VOTE_SORT } from 'constants/postConstants';
import MenuModalButton from 'components/common/menu/MenuModalButton';
import MenuWrapper from 'components/common/menu/MenuWrapper';
import BSteemModal from 'components/common/BSteemModal';
import { connect } from 'react-redux';
import { getCustomTheme } from 'state/rootReducer';

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

class VoteSortMenu extends Component {
  static propTypes = {
    customTheme: PropTypes.shape().isRequired,
    hideMenu: PropTypes.func.isRequired,
    handleSortVotes: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired,
  };

  render() {
    const { visible, hideMenu, customTheme } = this.props;

    if (!visible) return null;

    return (
      <BSteemModal visible={visible} handleOnClose={hideMenu}>
        <TouchableWithoutFeedback onPress={hideMenu}>
          <Container>
            <MenuWrapper>
              {_.map(VOTE_SORT, sort => (
                <MenuModalButton onPress={this.props.handleSortVotes(sort)} key={sort.label}>
                  <MenuModalContents>
                    <MaterialCommunityIcons
                      size={ICON_SIZES.menuModalOptionIcon}
                      color={customTheme.primaryColor}
                      name={sort.icon}
                    />
                    <MenuText customTheme={customTheme}>{sort.label}</MenuText>
                  </MenuModalContents>
                </MenuModalButton>
              ))}
            </MenuWrapper>
          </Container>
        </TouchableWithoutFeedback>
      </BSteemModal>
    );
  }
}

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
});

export default connect(mapStateToProps)(VoteSortMenu);
