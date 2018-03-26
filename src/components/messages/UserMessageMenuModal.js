import React from 'react';
import PropTypes from 'prop-types';
import BSteemModal from 'components/common/BSteemModal';
import UserMessageMenu from './UserMessageMenu';

const UserMessageMenuModal = ({
  hideMenu,
  visible,
  handleNavigateToUser,
  handleBlockUser,
  isBlocked,
  handleHideUserMessage,
}) => {
  if (!visible) return null;

  return (
    <BSteemModal visible={visible} handleOnClose={hideMenu}>
      <UserMessageMenu
        hideMenu={hideMenu}
        handleNavigateToUser={handleNavigateToUser}
        handleBlockUser={handleBlockUser}
        isBlocked={isBlocked}
        handleHideUserMessage={handleHideUserMessage}
      />
    </BSteemModal>
  );
};

UserMessageMenuModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  isBlocked: PropTypes.bool.isRequired,
  hideMenu: PropTypes.func.isRequired,
  handleNavigateToUser: PropTypes.func.isRequired,
  handleBlockUser: PropTypes.func.isRequired,
  handleHideUserMessage: PropTypes.func.isRequired,
};

export default UserMessageMenuModal;
