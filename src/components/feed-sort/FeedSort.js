import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { TouchableWithoutFeedback } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import _ from 'lodash';
import styled from 'styled-components/native';
import { COLORS } from 'constants/styles';
import { FEED_FILTERS } from 'constants/feedFilters';
import MenuModalButton from 'components/common/menu/MenuModalButton';
import MenuWrapper from 'components/common/menu/MenuWrapper';
import { CheckBox } from 'react-native-elements';
import { getIsAuthenticated } from 'state/rootReducer';
import i18n from '../../i18n/i18n';

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
  color: ${COLORS.PRIMARY_COLOR};
  font-weight: bold;
`;

const mapStateToProps = state => ({
  authenticated: getIsAuthenticated(state),
});

class FeedSort extends Component {
  static propTypes = {
    handleSortPost: PropTypes.func.isRequired,
    hideMenu: PropTypes.func.isRequired,
    authenticated: PropTypes.bool.isRequired,
    handleFilterFeedByFollowers: PropTypes.func.isRequired,
    filterFeedByFollowers: PropTypes.bool.isRequired,
  };

  render() {
    const { authenticated, filterFeedByFollowers, handleFilterFeedByFollowers } = this.props;
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
            {authenticated && (
              <MenuModalButton>
                <MenuModalContents>
                  <CheckBox
                    title={i18n.feed.filterCurrentFeedByFollowers}
                    checked={filterFeedByFollowers}
                    onPress={handleFilterFeedByFollowers}
                  />
                </MenuModalContents>
              </MenuModalButton>
            )}
          </MenuWrapper>
        </Container>
      </TouchableWithoutFeedback>
    );
  }
}

export default connect(mapStateToProps)(FeedSort);
