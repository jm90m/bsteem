import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { TouchableWithoutFeedback } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import _ from 'lodash';
import tinycolor from 'tinycolor2';
import styled from 'styled-components/native';
import { FEED_FILTERS } from 'constants/feedFilters';
import MenuModalButton from 'components/common/menu/MenuModalButton';
import MenuWrapper from 'components/common/menu/MenuWrapper';
import MenuText from 'components/common/menu/MenuText';
import MenuModalContents from 'components/common/menu/MenuModalContents';
import { CheckBox } from 'react-native-elements';
import { getIsAuthenticated, getCustomTheme, getIntl } from 'state/rootReducer';
import { ICON_SIZES, COLORS } from 'constants/styles';

const Container = styled.View`
  flex: 1;
  flex-direction: column-reverse;
  align-items: center;
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
            {_.map(FEED_FILTERS, (filter, index) => (
              <MenuModalButton
                onPress={this.handleSortPost(filter)}
                key={filter.label}
                isLastElement={_.isEqual(index, _.size(FEED_FILTERS) - 1) && !authenticated}
              >
                <MenuModalContents>
                  <MaterialIcons
                    size={ICON_SIZES.menuModalOptionIcon}
                    color={
                      tinycolor(customTheme.primaryBackgroundColor).isDark()
                        ? COLORS.LIGHT_TEXT_COLOR
                        : COLORS.DARK_TEXT_COLOR
                    }
                    name={filter.icon}
                  />
                  <MenuText customTheme={customTheme}>{intl[filter.label]}</MenuText>
                </MenuModalContents>
              </MenuModalButton>
            ))}
            {authenticated && (
              <MenuModalButton onPress={handleFilterFeedByFollowers} isLastElement>
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
