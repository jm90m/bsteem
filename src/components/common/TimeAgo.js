import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import moment from 'moment-timezone';
import { connect } from 'react-redux';
import { getCustomTheme } from 'state/rootReducer';
import PrimaryText from 'components/common/text/PrimaryText';

const Container = styled(PrimaryText)`
  color: ${props => props.customTheme.tertiaryColor};
  font-size: 14px;
`;

const TimeAgo = ({ created, style, customTheme }) => {
  const createdTime = `${created}Z`;
  return (
    <Container style={style} customTheme={customTheme}>
      {`${moment(createdTime)
        .tz(moment.tz.guess())
        .fromNow()}`}
    </Container>
  );
};

TimeAgo.propTypes = {
  created: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  customTheme: PropTypes.shape().isRequired,
  style: PropTypes.shape(),
};

TimeAgo.defaultProps = {
  created: '',
  style: {},
};

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
});

export default connect(mapStateToProps)(TimeAgo);
