import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as authActions from 'state/actions/authActions';
import { getSteemConnectDisplayErrorModal } from 'state/rootReducer';
import { setSteemConnectErrorModalDisplay } from 'state/actions/appActions';
import SteemConnectErrorModal from './SteemConnectErrorModal';

const mapStateToProps = state => ({
  steemConnectDisplayErrorModal: getSteemConnectDisplayErrorModal(state),
});

const mapDispatchToProps = dispatch => ({
  authenticateUserSuccess: (accessToken, expiresIn, username, maxAge) =>
    dispatch(authActions.authenticateUser.success({ accessToken, expiresIn, username, maxAge })),
  authenticateUserError: error => dispatch(authActions.authenticateUser.fail(error)),
  closeSteemConnectErrorModal: () => dispatch(setSteemConnectErrorModalDisplay(false)),
});

const SteemConnectErrorModalContainer = ({
  steemConnectDisplayErrorModal,
  authenticateUserSuccess,
  authenticateUserError,
  closeSteemConnectErrorModal,
}) => {
  if (!steemConnectDisplayErrorModal) return null;

  return (
    <SteemConnectErrorModal
      visible={steemConnectDisplayErrorModal}
      authenticateUserSuccess={authenticateUserSuccess}
      authenticateUserError={authenticateUserError}
      closeSteemConnectErrorModal={closeSteemConnectErrorModal}
    />
  );
};

SteemConnectErrorModalContainer.propTypes = {
  steemConnectDisplayErrorModal: PropTypes.bool.isRequired,
  authenticateUserSuccess: PropTypes.func.isRequired,
  authenticateUserError: PropTypes.func.isRequired,
  closeSteemConnectErrorModal: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(SteemConnectErrorModalContainer);
