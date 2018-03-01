import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getDisplayNotifyModal, getNotifyTitle, getNotifyDescription } from 'state/rootReducer';
import * as appActions from 'state/actions/appActions';
import Notify from './Notify';

const mapStateToProps = state => ({
  displayNotifyModal: getDisplayNotifyModal(state),
  notifyTitle: getNotifyTitle(state),
  notifyDescription: getNotifyDescription(state),
});

const mapDispatchToProps = dispatch => ({
  hideNotifyModal: () => dispatch(appActions.hideNotifyModal()),
});
const NotifyModal = ({ displayNotifyModal, hideNotifyModal, notifyTitle, notifyDescription }) => {
  if (!displayNotifyModal) return null;
  return (
    <Notify
      displayNotifyModal={displayNotifyModal}
      hideNotifyModal={hideNotifyModal}
      title={notifyTitle}
      description={notifyDescription}
    />
  );
};

NotifyModal.propTypes = {
  hideNotifyModal: PropTypes.func.isRequired,
  displayNotifyModal: PropTypes.bool.isRequired,
  notifyTitle: PropTypes.string.isRequired,
  notifyDescription: PropTypes.string.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(NotifyModal);
