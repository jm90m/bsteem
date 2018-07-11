import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableWithoutFeedback } from 'react-native';
import _ from 'lodash';
import styled from 'styled-components/native';
import { VOTE_SORT } from 'constants/postConstants';
import MenuModalButton from 'components/common/menu/MenuModalButton';
import MenuWrapper from 'components/common/menu/MenuWrapper';
import MenuIcon from 'components/common/menu/MenuIcon';
import MenuText from 'components/common/menu/MenuText';
import MenuModalContents from 'components/common/menu/MenuModalContents';
import BSteemModal from 'components/common/BSteemModal';

const Container = styled.View`
  flex: 1;
  flex-direction: column-reverse;
  align-items: center;
`;

class VoteSortMenu extends Component {
  static propTypes = {
    hideMenu: PropTypes.func.isRequired,
    handleSortVotes: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired,
  };

  render() {
    const { visible, hideMenu } = this.props;

    if (!visible) return null;

    return (
      <BSteemModal visible={visible} handleOnClose={hideMenu}>
        <TouchableWithoutFeedback onPress={hideMenu}>
          <Container>
            <MenuWrapper>
              {_.map(VOTE_SORT, (sort, index) => (
                <MenuModalButton
                  onPress={this.props.handleSortVotes(sort)}
                  key={sort.label}
                  isLastElement={_.isEqual(index, _.size(VOTE_SORT) - 1)}
                >
                  <MenuModalContents>
                    <MenuIcon name={sort.icon} />
                    <MenuText>{sort.label}</MenuText>
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

export default VoteSortMenu;
6;
