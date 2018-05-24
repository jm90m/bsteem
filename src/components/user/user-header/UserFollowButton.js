import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import FollowButton from 'components/common/FollowButton';
import { connect } from 'react-redux';
import { getCustomTheme } from 'state/rootReducer';

const Container = styled.View`
  height: 50px;
  padding: 5px 0;
  background-color: ${props => props.customTheme.primaryBackgroundColor};
  align-items: flex-start;
`;

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
});

const UserFollowButton = ({ username, customTheme }) => (
  <Container customTheme={customTheme}>
    <FollowButton username={username} />
  </Container>
);

UserFollowButton.propTypes = {
  username: PropTypes.string.isRequired,
  customTheme: PropTypes.shape().isRequired,
};

export default connect(mapStateToProps)(UserFollowButton);
