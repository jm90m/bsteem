import React from 'react';
import PropTypes from 'prop-types';
import { TouchableWithoutFeedback } from 'react-native';
import _ from 'lodash';
import styled from 'styled-components/native';
import { COMMENT_FILTERS } from 'constants/comments';
import MenuModalButton from 'components/common/menu/MenuModalButton';
import MenuWrapper from 'components/common/menu/MenuWrapper';
import MenuText from 'components/common/menu/MenuText';
import MenuModalContents from 'components/common/menu/MenuModalContents';
import MenuIcon from 'components/common/menu/MenuIcon';

const Container = styled.View`
  flex: 1;
  flex-direction: column-reverse;
  align-items: center;
`;

class CommentsMenu extends React.Component {
  static propTypes = {
    handleSortComments: PropTypes.func.isRequired,
    hideMenu: PropTypes.func.isRequired,
    intl: PropTypes.shape().isRequired,
  };

  render() {
    const { intl } = this.props;
    return (
      <TouchableWithoutFeedback onPress={this.props.hideMenu}>
        <Container>
          <MenuWrapper>
            {_.map(COMMENT_FILTERS, (filter, index) => (
              <MenuModalButton
                onPress={this.props.handleSortComments(filter)}
                key={filter.label}
                isLastElement={_.isEqual(index, _.size(COMMENT_FILTERS) - 1)}
              >
                <MenuModalContents>
                  <MenuIcon name={filter.icon} />
                  <MenuText>{intl[filter.label]}</MenuText>
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
