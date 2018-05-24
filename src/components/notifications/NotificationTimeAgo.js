import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import moment from 'moment-timezone';
import { connect } from 'react-redux';
import { getCustomTheme } from 'state/rootReducer';

const Container = styled.Text`
  color: ${props => props.customTheme.tertiaryColor};
  font-size: 14px;
  margin-left: 5px;
`;

const NotificationTimeAgo = ({ created, style, customTheme }) => (
  <Container style={style} customTheme={customTheme}>
    {`${moment(created)
      .tz(moment.tz.guess())
      .fromNow()}`}
  </Container>
);

NotificationTimeAgo.propTypes = {
  created: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  customTheme: PropTypes.shape().isRequired,
  style: PropTypes.shape(),
};

NotificationTimeAgo.defaultProps = {
  created: '',
  style: {},
};

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
});

export default connect(mapStateToProps)(NotificationTimeAgo);
