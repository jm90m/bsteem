import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { TouchableWithoutFeedback } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import _ from 'lodash';
import styled from 'styled-components/native';
import { FEED_FILTERS } from 'constants/feedFilters';
import MenuModalButton from 'components/common/menu/MenuModalButton';
import MenuWrapper from 'components/common/menu/MenuWrapper';
import { CheckBox } from 'react-native-elements';
import { getIsAuthenticated, getCustomTheme, getIntl } from 'state/rootReducer';

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

const mapStateToProps = state => ({
  authenticated: getIsAuthenticated(state),
  customTheme: getCustomTheme(state),
  intl: getIntl(state),
});

class FeedSort extends Component {
  static propTypes = {
    handleSortPost: PropTypes.func.isRequired,
    hideMenu: PropTypes.func.isRequired,
    authenticated: PropTypes.bool.isRequired,
    handleFilterFeedByFollowers: PropTypes.func.isRequired,
    filterFeedByFollowers: PropTypes.bool.isRequired,
    customTheme: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
  };

  handleSortPost = filter => () => this.props.handleSortPost(filter);

  render() {
    const {
      authenticated,
      filterFeedByFollowers,
      handleFilterFeedByFollowers,
      customTheme,
      intl,
    } = this.props;
    return (
      <TouchableWithoutFeedback onPress={this.props.hideMenu}>
        <Container>
          <MenuWrapper>
            {_.map(FEED_FILTERS, filter => (
              <MenuModalButton onPress={this.handleSortPost(filter)} key={filter.label}>
                <MenuModalContents>
                  <MaterialIcons size={20} color={customTheme.primaryColor} name={filter.icon} />
                  <MenuText customTheme={customTheme}>{intl[filter.label]}</MenuText>
                </MenuModalContents>
              </MenuModalButton>
            ))}
            {authenticated && (
              <MenuModalButton>
                <MenuModalContents>
                  <CheckBox
                    title={intl.filter_current_feed_by_followers}
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
