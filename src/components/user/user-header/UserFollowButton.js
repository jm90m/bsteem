import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import FollowButton from 'components/common/FollowButton';

const Container = styled.View`
  height: 50px;
  padding: 5px 0;
  background-color: white;
  align-items: flex-start;
`;

const UserFollowButton = ({ username }) => (
  <Container>
    <FollowButton username={username} />
  </Container>
);

UserFollowButton.propTypes = {
  username: PropTypes.string.isRequired,
};

export default UserFollowButton;
