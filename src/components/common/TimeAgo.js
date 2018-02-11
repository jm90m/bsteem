import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { COLORS } from 'constants/styles';
import moment from 'moment-timezone';

const Container = styled.Text`
  color: ${COLORS.TERTIARY_COLOR};
  font-size: 14px;
`;

const TimeAgo = ({ created, style }) => {
  return (
    <Container style={style}>
      {`${moment(created)
        .tz(moment.tz.guess())
        .fromNow()}`}
    </Container>
  );
};

TimeAgo.propTypes = {
  created: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  style: PropTypes.shape(),
};

TimeAgo.defaultProps = {
  created: '',
  style: {},
};

export default TimeAgo;
